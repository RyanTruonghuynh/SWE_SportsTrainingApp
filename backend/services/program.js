import WorkoutPlan from "../models/WorkoutPlan.js";

const levels = ["beginner", "intermediate", "advanced"];

export const getWorkoutPlan = async (sportType, experienceLevel) => {
    if (!sportType) {
        throw new Error("Sport type is required.");
    }

    if (!levels.includes(experienceLevel)) {
        throw new Error("Experience level must be beginner, intermediate, or advanced.");
    }

    const workoutPlan = await WorkoutPlan.findOne({
        sportType,
        experienceLevel,
    });

    if (!workoutPlan) {
        throw new Error("Workout plan not found.");
    }

    return workoutPlan;
};
