import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["footwork", "coordination", "technique", "tactical"],
      required: true,
      trim: true,
    },
    sport: [
      {
        type: String,
        enum: ["racketsports", "soccer", "volleyball", "football"],
      },
    ],
    difficultyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    sets: {
      type: Number,
      required: true,
      default: 1,
    },
    reps: {
      type: Number,
      required: true,
      default: 1,
    },
    duration: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
