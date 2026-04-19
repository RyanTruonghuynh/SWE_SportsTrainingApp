import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    muscleGroups: {
      type: [String],
      default: [],
    },
    sport: {
      type: [String],
      default: [],
    },
    difficultyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Exercise", exerciseSchema);
