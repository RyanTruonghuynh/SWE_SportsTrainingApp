import "dotenv/config";
import process from "node:process";
import connectDB from "../config/db.js";
import WorkoutPlan from "../models/WorkoutPlan.js";

const sports = [
  { sportType: "football", title: "Football" },
  { sportType: "soccer", title: "Soccer" },
  { sportType: "volleyball", title: "Volleyball" },
  { sportType: "racketsports", title: "Racquet Sports" },
];

const levels = ["beginner", "intermediate", "advanced"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const makeWeeklyPlan = (sportTitle, experienceLevel) =>
  days.map((day, index) => ({
    day,
    workoutItems: [
      {
        title: `${sportTitle} Strength ${index + 1}`,
        description: `Foundational ${experienceLevel} strength work for ${sportTitle.toLowerCase()}.`,
        category: "workout",
        sets: experienceLevel === "advanced" ? "4" : experienceLevel === "intermediate" ? "3" : "2",
        reps: experienceLevel === "advanced" ? "10" : "12",
        duration: "30 min",
      },
    ],
    skillsItems: [
      {
        title: `${sportTitle} Skill ${index + 1}`,
        description: `Technical ${experienceLevel} practice block for ${sportTitle.toLowerCase()}.`,
        category: "skill",
        sets: "3",
        reps: "8",
        duration: "20 min",
      },
    ],
  }));

const seedPlans = sports.flatMap(({ sportType, title }) =>
  levels.map((experienceLevel) => ({
    sportType,
    experienceLevel,
    title: `${title} ${experienceLevel[0].toUpperCase()}${experienceLevel.slice(1)} Plan`,
    description: `Auto-seeded ${experienceLevel} training plan for ${title.toLowerCase()}.`,
    weeklyPlan: makeWeeklyPlan(title, experienceLevel),
  }))
);

try {
  await connectDB();
  await WorkoutPlan.deleteMany({});
  await WorkoutPlan.insertMany(seedPlans);
  console.log(`Seeded ${seedPlans.length} workout plans.`);
  process.exit(0);
} catch (error) {
  console.error("Failed to seed workout plans:", error.message);
  process.exit(1);
}
