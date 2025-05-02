const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
let isDbConnected = false;
connectDB().then((connected) => {
  isDbConnected = connected;

  if (!connected && process.env.NODE_ENV === "production") {
    console.warn(
      "Started server despite database connection issues. Will retry connection for requests."
    );
  }
});

// Initialize express app
const app = express();

// Enhanced CORS configuration for deployment
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "https://community-learning-hub-henna.vercel.app",
          "https://community-learning-hub.onrender.com",
          "https://community-learning-hub-api.onrender.com",
          process.env.FRONTEND_URL,
          /\.vercel\.app$/,
          /\.netlify\.app$/,
          /\.onrender\.com$/,
        ]
      : "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  preflightContinue: false,
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

// Custom middleware to ensure CORS headers are set on all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

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

// Enhanced health check endpoint for diagnostics
app.get("/health", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const packageJson = require("./package.json");

    // Test database connection
    let dbStatus;
    let dbCollections = [];

    try {
      // If not connected, try to reconnect
      if (mongoose.connection.readyState !== 1) {
        await connectDB();
      }

      const state = mongoose.connection.readyState;
      const states = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
        99: "uninitialized",
      };

      dbStatus = states[state] || "unknown";

      if (state === 1) {
        const collections = await mongoose.connection.db
          .listCollections()
          .toArray();
        dbCollections = collections.map((c) => c.name);
      }
    } catch (dbError) {
      dbStatus = `Error: ${dbError.message}`;
    }

    // Check required environment variables
    const envVars = {
      NODE_ENV: process.env.NODE_ENV || "not set",
      PORT: process.env.PORT || "not set",
      MONGODB_URI: process.env.MONGODB_URI
        ? `${process.env.MONGODB_URI.substring(
            0,
            12
          )}...${process.env.MONGODB_URI.substring(
            process.env.MONGODB_URI.length - 10
          )}`
        : "not set",
      JWT_SECRET: process.env.JWT_SECRET ? "set (hidden)" : "not set",
      JWT_EXPIRE: process.env.JWT_EXPIRE || "not set",
      FRONTEND_URL: process.env.FRONTEND_URL || "not set",
    };

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      server: {
        version: packageJson.version,
        nodeVersion: process.version,
        uptime: `${Math.floor(process.uptime())} seconds`,
      },
      database: {
        status: dbStatus,
        collections: dbCollections,
      },
      config: envVars,
      cors: {
        origin: corsOptions.origin,
        credentials: corsOptions.credentials,
      },
    });
  } catch (err) {
    console.error("Health check error:", err);
    res.status(500).json({
      status: "unhealthy",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
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
