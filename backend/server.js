import "dotenv/config"
import process from "node:process";
import express from "express";
import authRoutes from "./routes/userRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";

const app = express(); //creates express app object
const PORT = process.env.PORT || 5001;

app.use(cors()); //allows frontend and backend to communicate
app.use(express.json()); //allows JSON parsing
app.use("/auth",authRoutes);
app.use("/assessment", assessmentRoutes);

await connectDB(); //connect to MongoDB

app.listen(PORT,() => console.log(`Server running on port ${PORT}.`)); //starts server
