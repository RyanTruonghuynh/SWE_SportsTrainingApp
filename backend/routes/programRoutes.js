import express from "express";
import Progress from "../models/Progress.js";
import WorkoutPlan from "../models/WorkoutPlan.js";
import { getWorkoutPlan } from "../services/program.js";

const router = express.Router();

function getStartOfWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    today.setDate(today.getDate() - daysSinceMonday);
    today.setHours(0, 0, 0, 0);

    return today;
}

function calculateProgress(workoutPlan, progress) {
    let totalItems = 0;

    workoutPlan.weeklyPlan.forEach((day) => {
        totalItems += day.workoutItems.length;
        totalItems += day.skillsItems.length;
    });

    if (totalItems === 0 || !progress) {
        return 0;
    }

    if (progress.days?.length) {
        let completedItems = 0;

        progress.days.forEach((day) => {
            completedItems += day.workoutItems.filter((item) => item.completed).length;
            completedItems += day.skillItems.filter((item) => item.completed).length;
        });

        return Math.round((completedItems / totalItems) * 100);
    }

    let completedItems = 0;

    (progress.completedItems ?? []).forEach((item) => {
        if (item.completed) {
            completedItems += 1;
        }
    });

    return Math.round((completedItems / totalItems) * 100);
}

router.get("/current", async (req, res) => {
    try {
        const userId = req.query.userId;
        const sportType = req.query.sportType;
        const experienceLevel = req.query.experienceLevel;

        const workoutPlan = await getWorkoutPlan(sportType, experienceLevel);

        let progress = null;

        if (userId) {
            progress = await Progress.findOne({
                user: userId,
                workoutPlan: workoutPlan._id,
                $or: [{ weekStartDate: getStartOfWeek() }, { weekStart: getStartOfWeek() }],
            });
        }

        res.json({
            workoutPlan,
            progress: progress || { completedItems: [], days: [] },
            progressPercent: calculateProgress(workoutPlan, progress),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/progress", async (req, res) => {
    try {
        const userId = req.body.userId;
        const workoutPlanId = req.body.workoutPlanId;
        const day = req.body.day;
        const itemType = req.body.itemType;
        const itemTitle = req.body.itemTitle;
        const completed = req.body.completed;

        const workoutPlan = await WorkoutPlan.findById(workoutPlanId);

        if (!workoutPlan) {
            return res.status(404).json({ message: "Workout plan not found" });
        }

        let progress = await Progress.findOne({
            user: userId,
            workoutPlan: workoutPlanId,
            $or: [{ weekStartDate: getStartOfWeek() }, { weekStart: getStartOfWeek() }],
        });

        if (!progress) {
            progress = new Progress({
                user: userId,
                workoutPlan: workoutPlanId,
                weekStartDate: getStartOfWeek(),
                weekStart: getStartOfWeek(),
                completedItems: [],
            });
        }

        const existingItem = progress.completedItems.find((item) => {
            return item.day === day && item.itemType === itemType && item.itemTitle === itemTitle;
        });

        if (existingItem) {
            existingItem.completed = completed;
        } else {
            progress.completedItems.push({
                day,
                itemType,
                itemTitle,
                completed,
            });
        }

        const dayProgress = progress.days?.find((entry) => entry.day === day);
        if (dayProgress) {
            const items = itemType === "workout" ? dayProgress.workoutItems : dayProgress.skillItems;
            const targetItem = items.find((item) => item.title === itemTitle);

            if (targetItem) {
                targetItem.completed = completed;
                targetItem.completedAt = completed ? new Date() : undefined;
            }
        }

        await progress.save();

        res.json({
            progress,
            progressPercent: calculateProgress(workoutPlan, progress),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
