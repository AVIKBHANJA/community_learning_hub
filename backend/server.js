const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Enhanced CORS configuration for deployment
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [process.env.FRONTEND_URL, /\.vercel\.app$/, /\.netlify\.app$/]
      : "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" })); // Increased payload limit for file uploads
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Import routes
const authRoutes = require("./routes/auth");
const feedRoutes = require("./routes/feed");
const creditRoutes = require("./routes/credits");
const adminRoutes = require("./routes/admin");
const learningPathsRoutes = require("./routes/learningPaths");
const achievementsRoutes = require("./routes/achievements");
const forumRoutes = require("./routes/forum");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/credits", creditRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/learning-paths", learningPathsRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/forum", forumRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Community Learning Hub API" });
});

// Add health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});
