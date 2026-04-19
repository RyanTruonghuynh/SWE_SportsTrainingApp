import mongoose from "mongoose";

const completionItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
  },
  { _id: false }
);

const dayProgressSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    workoutItems: [completionItemSchema],
    skillItems: [completionItemSchema],
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workoutPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
      required: true,
    },
    sportType: {
      type: String,
      enum: ["racketsports", "soccer", "volleyball", "football"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    weekStart: {
      type: Date,
      required: true,
      index: true,
    },
    days: [dayProgressSchema],
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, weekStart: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
