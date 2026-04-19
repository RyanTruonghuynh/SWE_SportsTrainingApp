import "dotenv/config";
import process from "node:process";
import connectDB from "../config/db.js";
import WorkoutPlan from "../models/WorkoutPlan.js";
import { exercises, skills } from "./seedData.js";

const sports = [
  { sportType: "football", title: "Football" },
  { sportType: "soccer", title: "Soccer" },
  { sportType: "volleyball", title: "Volleyball" },
  { sportType: "racketsports", title: "Racquet Sports" },
];

const levels = ["beginner", "intermediate", "advanced"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const exerciseDurationMap = {
  flexibility: "10 min",
  endurance: "20 min",
  agility: "20 min",
  strength: "30 min",
};

const getMatchingItems = (items, sportType, experienceLevel) => {
  const exactMatches = items.filter(
    (item) => item.sport.includes(sportType) && item.difficultyLevel === experienceLevel
  );

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  const sportMatches = items.filter((item) => item.sport.includes(sportType));
  if (sportMatches.length > 0) {
    return sportMatches;
  }

  return items.filter((item) => item.difficultyLevel === experienceLevel);
};

const mapExerciseToWorkoutItem = (exercise) => ({
  title: exercise.name,
  description: exercise.description,
  category: "workout",
  sets: String(exercise.sets),
  reps: String(exercise.reps),
  duration: exerciseDurationMap[exercise.category] ?? "20 min",
});

const mapSkillToPlanItem = (skill) => ({
  title: skill.name,
  description: skill.description,
  category: "skill",
  sets: String(skill.sets),
  reps: String(skill.reps),
  duration: "20 min",
});

const buildRotatingItems = (items, mapper, countPerDay, dayIndex) => {
  if (items.length === 0) {
    return [];
  }

  return Array.from({ length: Math.min(countPerDay, items.length) }, (_, itemOffset) => {
    const item = items[(dayIndex + itemOffset) % items.length];
    return mapper(item);
  });
};

const makeWeeklyPlan = (sportType, experienceLevel) => {
  const matchingExercises = getMatchingItems(exercises, sportType, experienceLevel);
  const matchingSkills = getMatchingItems(skills, sportType, experienceLevel);

  return days.map((day, index) => ({
    day,
    workoutItems: buildRotatingItems(matchingExercises, mapExerciseToWorkoutItem, 3, index),
    skillsItems: buildRotatingItems(matchingSkills, mapSkillToPlanItem, 2, index),
  }));
};

const seedPlans = sports.flatMap(({ sportType, title }) =>
  levels.map((experienceLevel) => ({
    sportType,
    experienceLevel,
    title: `${title} ${experienceLevel[0].toUpperCase()}${experienceLevel.slice(1)} Plan`,
    description: `Structured ${experienceLevel} training plan for ${title.toLowerCase()}.`,
    weeklyPlan: makeWeeklyPlan(sportType, experienceLevel),
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
