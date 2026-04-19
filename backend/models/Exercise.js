import { type } from "@testing-library/user-event/dist/cjs/utility/index.js";
import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["strength", "agility", "endurance", "flexibility"],
        required: true,
    },
    muscleGroups:[
        {
            type: String,
            enum: ["chest", "back", "shoulders", "legs","glutes", "arms", "core"],
        },
    ],
    sport:[
        {
            type: String,
            enum: ["racketsports", "soccer", "volleyball","football"],
        },
    ],
    difficultyLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true,
    },
    sets: {
        type: Number,
        default: 1,
    },
    reps: {
        type: Number,
        default: 1,
    },
    duration:{
        type: String,
        default: "",
    },
},
{timestamps: true}
);

export default mongoose.model("Exercise", exerciseSchema);