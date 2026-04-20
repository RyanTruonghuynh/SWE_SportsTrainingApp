import express from "express";
import Progress from "../models/Progress.js";
import User from "../models/User.js";
import WorkoutPlan from "../models/WorkoutPlan.js";

const router = express.Router();

const getWeekStart = (date = new Date()) => {
  const utcDate = new Date(date);
  const day = utcDate.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  utcDate.setUTCDate(utcDate.getUTCDate() + diff);
  utcDate.setUTCHours(0, 0, 0, 0);
  return utcDate;
};

const buildDayProgress = (weeklyPlan) =>
  weeklyPlan.map((day) => ({
    day: day.day,
    workoutItems: (day.workoutItems ?? []).map((item) => ({
      title: item.title,
      completed: false,
    })),
    skillItems: (day.skillsItems ?? []).map((item) => ({
      title: item.title,
      completed: false,
    })),
  }));

const resolveWorkoutPlanForUser = async (user) => {
  if (!user?.questionaire?.sportType || !user?.questionaire?.experienceLevel) {
    return null;
  }

  let workoutPlan = null;
  if (user.questionaire.workoutPlan) {
    workoutPlan = await WorkoutPlan.findById(user.questionaire.workoutPlan).lean();
  }

  if (workoutPlan) {
    return workoutPlan;
  }

  workoutPlan = await WorkoutPlan.findOne({
    sportType: user.questionaire.sportType,
    experienceLevel: user.questionaire.experienceLevel,
  }).lean();

  if (!workoutPlan) {
    return null;
  }

  await User.findByIdAndUpdate(user._id, {
    $set: {
      "questionaire.workoutPlan": workoutPlan._id,
    },
  });

  return workoutPlan;
};

const WEEKS_PER_LEVEL = 8

const calcLevelCompletionPercent = (allProgressDocs, workoutPlan) => {
  const itemsPerWeek = (workoutPlan.weeklyPlan ?? []).reduce(
    (sum, day) => sum + (day.workoutItems?.length ?? 0) + (day.skillsItems?.length ?? 0),
    0
  )
  const totalLevelItems = itemsPerWeek * WEEKS_PER_LEVEL
  if (totalLevelItems === 0) return 0

  const completedAcrossLevel = allProgressDocs.reduce(
    (sum, doc) =>
      sum +
      doc.days.reduce(
        (daySum, day) =>
          daySum +
          (day.workoutItems ?? []).filter((i) => i.completed).length +
          (day.skillItems ?? []).filter((i) => i.completed).length,
        0
      ),
    0
  )

  return Math.min(100, Math.round((completedAcrossLevel / totalLevelItems) * 100))
}

const formatProgress = (progressDoc) => {
  const totalItems = progressDoc.days.reduce(
    (sum, day) => sum + day.workoutItems.length + day.skillItems.length,
    0
  );
  const completedItems = progressDoc.days.reduce(
    (sum, day) =>
      sum +
      day.workoutItems.filter((item) => item.completed).length +
      day.skillItems.filter((item) => item.completed).length,
    0
  );

  const completionPercent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return {
    id: progressDoc._id,
    weekStart: progressDoc.weekStart,
    sportType: progressDoc.sportType,
    experienceLevel: progressDoc.experienceLevel,
    completionPercent,
    completedItems,
    totalItems,
    days: progressDoc.days,
  };
};

const ensureProgressForUser = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) {
    return { error: { status: 404, body: { message: "User not found" } } };
  }

  if (!user.questionaire?.workoutPlan) {
    return { error: { status: 400, body: { message: "User has not completed the questionnaire yet" } } };
  }

  const weekStart = getWeekStart();
  let progress = await Progress.findOne({ user: user._id, weekStart });
  if (progress) {
    return { user, progress };
  }

  const workoutPlan = await resolveWorkoutPlanForUser(user);
  if (!workoutPlan) {
    return {
      error: { status: 404, body: { message: "Assigned workout plan could not be found for this user" } },
    };
  }

  await Progress.updateMany(
    {
      user: user._id,
      workoutPlan: { $ne: workoutPlan._id },
      sportType: user.questionaire.sportType,
      experienceLevel: user.questionaire.experienceLevel,
    },
    {
      $set: {
        workoutPlan: workoutPlan._id,
      },
    }
  );

  progress = await Progress.create({
    user: user._id,
    workoutPlan: workoutPlan._id,
    sportType: user.questionaire.sportType,
    experienceLevel: user.questionaire.experienceLevel,
    weekStart,
    weekStartDate: weekStart,
    days: buildDayProgress(workoutPlan.weeklyPlan ?? []),
    completedItems: [],
  });

  return { user, progress };
};

router.get("/:userId/current-week", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await ensureProgressForUser(userId);

    if (result.error) {
      return res.status(result.error.status).json(result.error.body);
    }

    res.json({ progress: formatProgress(result.progress) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:userId/items", async (req, res) => {
  try {
    const { userId } = req.params;
    const { day, category, title, completed } = req.body;

    if (!day || !category || !title || typeof completed !== "boolean") {
      return res.status(400).json({ message: "day, category, title, and completed are required" });
    }

    if (!["workout", "skill"].includes(category)) {
      return res.status(400).json({ message: "category must be either workout or skill" });
    }

    const result = await ensureProgressForUser(userId);
    if (result.error) {
      return res.status(result.error.status).json(result.error.body);
    }

    const progress = result.progress;
    const dayProgress = progress.days.find((entry) => entry.day === day);
    if (!dayProgress) {
      return res.status(404).json({ message: "Day not found in progress" });
    }

    const items = category === "workout" ? dayProgress.workoutItems : dayProgress.skillItems;
    const targetItem = items.find((item) => item.title === title);

    if (!targetItem) {
      return res.status(404).json({ message: "Progress item not found" });
    }

    targetItem.completed = completed;
    targetItem.completedAt = completed ? new Date() : undefined;

    const legacyTitleKey = category === "workout" ? "workout" : "skill";
    const existingLegacyItem = progress.completedItems.find(
      (item) => item.day === day && item.itemType === legacyTitleKey && item.itemTitle === title
    );

    if (existingLegacyItem) {
      existingLegacyItem.completed = completed;
    } else {
      progress.completedItems.push({
        day,
        itemType: legacyTitleKey,
        itemTitle: title,
        completed,
      });
    }

    await progress.save();

    res.json({ progress: formatProgress(progress) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.questionaire?.workoutPlan) {
      return res.status(400).json({ message: "User has not completed the questionnaire yet" });
    }

    const workoutPlan = await resolveWorkoutPlanForUser(user);
    if (!workoutPlan) {
      return res.status(404).json({ message: "Assigned workout plan could not be found" });
    }

    const progressResult = await ensureProgressForUser(userId);
    if (progressResult.error) {
      return res.status(progressResult.error.status).json(progressResult.error.body);
    }

    const allProgressDocs = await Progress.find({
      user: user._id,
      workoutPlan: workoutPlan._id,
    }).lean();

    const levelCompletionPercent = calcLevelCompletionPercent(allProgressDocs, workoutPlan);
    const currentWeekFormatted = formatProgress(progressResult.progress);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        questionaire: user.questionaire,
      },
      workoutPlan,
      progress: {
        ...currentWeekFormatted,
        completionPercent: levelCompletionPercent,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced']

router.patch('/:userId/advance-level', async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).lean()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const current = user.questionaire?.experienceLevel
    const currentIndex = LEVEL_ORDER.indexOf(current)

    if (currentIndex === -1) {
      return res.status(400).json({ message: 'Unknown experience level' })
    }

    if (currentIndex === LEVEL_ORDER.length - 1) {
      return res.status(400).json({ message: 'Already at max level' })
    }

    const nextLevel = LEVEL_ORDER[currentIndex + 1]

    await User.findByIdAndUpdate(userId, {
      $set: {
        'questionaire.experienceLevel': nextLevel,
        'questionaire.workoutPlan': null,
      },
    })

    res.json({ experienceLevel: nextLevel })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router;
