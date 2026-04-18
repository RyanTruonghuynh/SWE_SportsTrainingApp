import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";
import mongoose from "mongoose";

const objectScehma = new mongoose.Schema({
    title: {type: String},
    description: {type: String},
    category: {
        type: String,
        enum: ["workout", "skill"],
        required: true
    },
    reps: String,
    duration: String,
    sets: String,
    },
    {_id:false}
);
const dayTemplateSchema = new mongoose.Schema({
    day: {type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true},
    workoutItems: [objectScehma],
    skillsItems: [objectScehma],
});
const workoutPlanSchema = new mongoose.Schema({
    sportType:{
        type: String,
        enum: ["racketsports", "soccer", "volleyball","football"],
        required: true
    },
    experienceLevel:{
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    weeklyPlan: [dayTemplateSchema],
}, {timestamps: true});

export default mongoose.model("WorkoutPlan", workoutPlanSchema);