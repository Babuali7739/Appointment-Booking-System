import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";

import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const PORT = process.env.PORT || 4000;

// connect services
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// API routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

// =============================
// SERVE FRONTEND (IMPORTANT)
// =============================

const __dirname = path.resolve();

// serve frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// React routing support
app.get("/", (req, res) => {
  res.send("API is working fine");
});

app.all("/*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});
// =============================

app.listen(PORT, () => {
  console.log("Server Started on port", PORT);
});