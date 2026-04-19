import mongoose from "mongoose";

const completedItemSchema = new mongoose.Schema(
    {
        day: {
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            required: true,
        },
        itemType: {
            type: String,
            enum: ["workout", "skill"],
            required: true,
        },
        itemTitle: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: true,
        },
    },
    { _id: false }
);

const progressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        workoutPlan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkoutPlan",
            required: true,
        },
        weekStartDate: {
            type: Date,
            required: true,
        },
        completedItems: [completedItemSchema],
    },
    { timestamps: true }
);

progressSchema.index({ user: 1, workoutPlan: 1, weekStartDate: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
