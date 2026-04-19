import "dotenv/config";
import process from "node:process";
import express from "express";
import authRoutes from "./routes/userRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";
import WorkoutPlan from "./models/WorkoutPlan.js";
import { seedWorkoutPlans } from "./scripts/seedWorkoutPlans.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/assessment", assessmentRoutes);
app.use("/progress", progressRoutes);
app.use("/program", programRoutes);

await connectDB();

const planCount = await WorkoutPlan.countDocuments();
if (planCount === 0) await seedWorkoutPlans();

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
