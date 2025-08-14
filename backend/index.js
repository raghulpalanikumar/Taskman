import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from config.env
dotenv.config({ path: './config.env' });

const app = express();
app.use(cors());
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

// Centralized error handling middleware
import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`Server is running on port ${port}`));
