import express from "express";
import authRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";

const Trainr = express(); //creates Trainr express object
Trainr.use(cors()); //allows frontend and backend to communicate
Trainr.use(express.json()); //allows JSON parsing
Trainr.use("/auth",authRoutes);

connectDB(); //connect to MongoDB

Trainr.listen(5000,() => console.log("Server running.")); //starts server