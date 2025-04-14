import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connectDb} from "./config/db.js";

import authRoutes from './routes/auth.routes.js'
import allCourses from './routes/AdminRoutes/allCourses.routes.js'
import lesson from './routes/AdminRoutes/lesson.routes.js'
import quiz from './routes/AdminRoutes/quiz.routes.js'
import userProgressRoutes from './routes/EmployeeRoutes/userProgress.routes.js'
import trainingCourseRoutes from './routes/AdminRoutes/trainingCourse.routes.js'
import trainingAssignmentRoutes from './routes/AdminRoutes/trainingAssignment.routes.js'
import successionPlanRoutes from './routes/AdminRoutes/successionPlan.routes.js'
import adminDashboardRoutes from './routes/AdminRoutes/adminDashboard.routes.js'


dotenv.config();
connectDb();

const app = express({ limit: "10mb" });
const PORT = process.env.PORT || 7684;


const allowedOrigins = [
  "https://core2.jjm-manufacturing.com",
  "http://localhost:5173", // Keep this for local development
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/allCourses", allCourses);
app.use("/api/lesson", lesson)
app.use("/api/quiz", quiz)
app.use("/api/progress", userProgressRoutes)
app.use("/api/trainingCourse", trainingCourseRoutes)
app.use("/api/trainingAssignment", trainingAssignmentRoutes)
app.use("/api/sucessionPlan", successionPlanRoutes)
app.use("/api/adminDashboard", adminDashboardRoutes)



app.listen(PORT, () => {
  console.log(`Server running in mode on port ${PORT}`);
});