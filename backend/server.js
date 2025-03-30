import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connectDb} from "./config/db.js";

import authRoutes from './routes/auth.routes.js'


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



app.listen(PORT, () => {
  console.log(`Server running in mode on port ${PORT}`);
});