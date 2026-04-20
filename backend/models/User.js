// Import mongoose to define schema and model
import mongoose from "mongoose";

const questionaireSchema = new mongoose.Schema({
  sportType: {
    type: String,
    enum: ["racketsports", "soccer", "volleyball","football"],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true
  },
  daysPerWeek: {
    type: Number,
    required: true,
    default: 1,
  },
  age: {
    type: Number,
    required: true,
  },
  workoutPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkoutPlan",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
}, {_id:false});

const userSchema = new mongoose.Schema(
  {
    //the user's username, which is required and will be trimmed of whitespace
    username:{
      type: String,
      required: true,
      trim: true,
    },
    //the user's email address, which must be unique and is required for account creation
    email:{
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    //the user's password, which is required
    password:{
      type: String,
      required: true,
    },
    questionaire:{
      type: questionaireSchema,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  {timestamps: true}    // automatically adds createdAt & updatedAt
);


//Export the model so it can be used in routes/controllers
export default mongoose.model("User", userSchema);
