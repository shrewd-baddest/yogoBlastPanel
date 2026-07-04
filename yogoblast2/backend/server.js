import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import User from "./Routers/user.js";
import pages from "./Routers/pages.js";
import db from "./controllers/dbConnect.js"; // make sure this exports your db instance
import callbackRouter from "./Routers/callback.js";

const app = express();
const port = process.env.PORT || 3001;

// Middleware

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("trust proxy", 1);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date(),
  });
});
app.use("/callback", callbackRouter);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later.",
});
app.use(limiter);

// Routes
app.use("/user", User);
app.use("/pages", pages);

// Frontend setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../YoGo-Blast/form/dist");

app.use(express.static(frontendPath));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

//  Start server ONLY after DB connects
db.on("connect", () => {
  console.log("Connected to the database");

  app.listen(port, () => {
    console.log(` Server is running on port ${port}`);
  });
});

//  Handle DB errors
db.on("error", (err) => {
  console.error("❌ Database error:", err);
});
