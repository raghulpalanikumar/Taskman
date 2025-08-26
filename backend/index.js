import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import aiRoutes from './routes/ai.js';
import cron from 'node-cron';
import Task from './models/Task.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from config.env
dotenv.config({ path: './config.env' });

const app = express();
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Use MONGODB_URI from config.env
const mongoURI = process.env.MONGODB_URI;
console.log('MongoDB URI:', mongoURI);
mongoose.connect(mongoURI,
    {
    useNewUrlParser:true,
    useUnifiedTopology:true
    }).then(()=>console.log("MongoDB connected")).catch((err)=>console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use('/api/ai', aiRoutes);

// Centralized error handling middleware
import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`Server is running on port ${port}`));

// Daily cron at 00:05 server time: roll daily tasks forward
cron.schedule('5 0 * * *', async () => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // For tasks with recurrence 'daily', if dueDate is today or missing, set/clone next day's task
    const dailyTasks = await Task.find({ recurrence: 'daily' });

    for (const task of dailyTasks) {
      // Compute next due date: if task has a dueDate, add 1 day; else set to tomorrow
      const baseDate = task.dueDate ? new Date(task.dueDate) : startOfToday;
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + 1);

      // If dueDate already beyond today, skip
      if (task.dueDate && task.dueDate > endOfToday) continue;

      // Create a new task instance for the next day preserving key fields
      const newTask = new Task({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        tags: task.tags,
        dueDate: nextDate,
        status: 'todo',
        progress: 0,
        recurrence: 'daily',
        user: task.user
      });
      await newTask.save();
    }
    console.log(`Daily recurrence job completed at ${now.toISOString()}`);
  } catch (error) {
    console.error('Error in daily recurrence job:', error);
  }
});
