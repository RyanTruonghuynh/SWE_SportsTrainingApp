// Import mongoose to define schema and model
import mongoose from "mongoose";


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
  },
  {timestamps: true}    // automatically adds createdAt & updatedAt
);


//Export the model so it can be used in routes/controllers
export default mongoose.model("User", userSchema);