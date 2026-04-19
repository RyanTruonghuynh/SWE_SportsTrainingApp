import express from "express";
import WorkoutPlan from "../models/WorkoutPlan.js";

const router = express.Router();

const sportMap = {
  Football: "football",
  Soccer: "soccer",
  "Racquet Sports": "racketsports",
  Volleyball: "volleyball",
};

const calculateExperienceLevel = (yearsExperience, workoutFreq) => {
  let score = 0;

  if (yearsExperience >= 5) {
    score += 3;
  } else if (yearsExperience >= 2) {
    score += 2;
  } else if (yearsExperience >= 1) {
    score += 1;
  }

  if (workoutFreq >= 5) {
    score += 3;
  } else if (workoutFreq >= 3) {
    score += 2;
  } else if (workoutFreq >= 1) {
    score += 1;
  }

  if (score >= 5) {
    return { experienceLevel: "advanced", score };
  }

  if (score >= 3) {
    return { experienceLevel: "intermediate", score };
  }

  return { experienceLevel: "beginner", score };
};

router.post("/questionnaire", async (req, res) => {
  try {
    const { sport, yearsExperience, workoutFreq, age } = req.body;

    if (!sport || yearsExperience === undefined || workoutFreq === undefined || age === undefined) {
      return res.status(400).json({ message: "sport, yearsExperience, workoutFreq, and age are required" });
    }

    const normalizedSport = sportMap[sport];
    if (!normalizedSport) {
      return res.status(400).json({ message: "Invalid sport selected" });
    }

    const parsedYearsExperience = Number(yearsExperience);
    const parsedWorkoutFreq = Number(workoutFreq);
    const parsedAge = Number(age);

    if (
      Number.isNaN(parsedYearsExperience) ||
      Number.isNaN(parsedWorkoutFreq) ||
      Number.isNaN(parsedAge)
    ) {
      return res.status(400).json({ message: "yearsExperience, workoutFreq, and age must be numbers" });
    }

    if (parsedYearsExperience < 0 || parsedWorkoutFreq < 0 || parsedWorkoutFreq > 7 || parsedAge < 1) {
      return res.status(400).json({ message: "Questionnaire values are out of range" });
    }

    const { experienceLevel, score } = calculateExperienceLevel(parsedYearsExperience, parsedWorkoutFreq);

    const workoutPlan = await WorkoutPlan.findOne({
      sportType: normalizedSport,
      experienceLevel,
    }).lean();

    if (!workoutPlan) {
      return res.status(404).json({
        message: "No workout plan found for this sport and experience level",
        sportType: normalizedSport,
        experienceLevel,
      });
    }

    res.json({
      sportType: normalizedSport,
      experienceLevel,
      score,
      workoutPlan,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/skill-level", async (req, res) => {
  try {
    const { yearsExperience, workoutFreq } = req.body;
    const parsedYearsExperience = Number(yearsExperience);
    const parsedWorkoutFreq = Number(workoutFreq);

    if (Number.isNaN(parsedYearsExperience) || Number.isNaN(parsedWorkoutFreq)) {
      return res.status(400).json({ message: "yearsExperience and workoutFreq must be numbers" });
    }

    const result = calculateExperienceLevel(parsedYearsExperience, parsedWorkoutFreq);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
