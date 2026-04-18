import "dotenv/config"
import express from "express";
import authRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";

const Trainr = express(); //creates Trainr express object
const PORT = process.env.PORT || 5001;

Trainr.use(cors()); //allows frontend and backend to communicate
Trainr.use(express.json()); //allows JSON parsing
Trainr.use("/auth",authRoutes);

await connectDB(); //connect to MongoDB

Trainr.listen(PORT,() => console.log(`Server running on port ${PORT}.`)); //starts server
