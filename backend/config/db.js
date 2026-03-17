// Import mongoose to interact with MongoDB
const mongoose = require("mongoose");

//establish connection to MongoDB
const connectDB = async () => {
//Attempt to connect using the connection string from .env
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  }
  catch (error){
    console.error("Database connection failed:", error.message);
    //Exit the application to prevent running without Database
    process.exit(1);
  }
};

//Export the function so it can be used in server.js
module.exports = connectDB;