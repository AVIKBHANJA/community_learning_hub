const User = require("../models/User");
const mongoose = require("mongoose");

// Helper function to check database connection
const checkDBConnection = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
    99: "uninitialized",
  };
  return states[state] || "unknown";
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check database connection
    const dbState = checkDBConnection();
    console.log(`Database connection state during register: ${dbState}`);
    if (dbState !== "connected") {
      return res.status(500).json({
        success: false,
        error: "Database connection issue. Please try again later.",
        details: `Current connection state: ${dbState}`,
      });
    }

    console.log(`Attempting to register user: ${email}`);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User with email ${email} already exists`);
      return res.status(400).json({
        success: false,
        error: "Email already in use",
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    console.log(`User created successfully: ${user._id}`);

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("Registration error:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(", "),
      });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        error: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error during registration",
      details: err.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check database connection
    const dbState = checkDBConnection();
    console.log(`Database connection state during login: ${dbState}`);
    if (dbState !== "connected") {
      return res.status(500).json({
        success: false,
        error: "Database connection issue. Please try again later.",
        details: `Current connection state: ${dbState}`,
      });
    }

    console.log(`Attempting to login user: ${email}`);

    // Validate email & password
    if (!email || !password) {
      console.log("Login attempt failed: Missing email or password");
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log(`Login attempt failed: No user found with email ${email}`);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log(
        `Login attempt failed: Password does not match for user ${email}`
      );
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    console.log(`User logged in successfully: ${user._id}`);
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      error: "Server error during login",
      details: err.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // Check database connection
    const dbState = checkDBConnection();
    console.log(`Database connection state during getMe: ${dbState}`);
    if (dbState !== "connected") {
      return res.status(500).json({
        success: false,
        error: "Database connection issue. Please try again later.",
        details: `Current connection state: ${dbState}`,
      });
    }

    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching profile",
      details: err.message,
    });
  }
};

// @desc    Check if JWT_SECRET is properly set
// @route   GET /api/auth/check-config
// @access  Public
exports.checkConfig = (req, res) => {
  const jwtSecretStatus = process.env.JWT_SECRET
    ? `JWT_SECRET is set (length: ${process.env.JWT_SECRET.length})`
    : "JWT_SECRET is not set!";

  const jwtExpireStatus = process.env.JWT_EXPIRE || "JWT_EXPIRE is not set!";

  const dbConnState = checkDBConnection();

  res.status(200).json({
    success: true,
    config: {
      environment: process.env.NODE_ENV || "development",
      database: {
        connectionState: dbConnState,
        uri: process.env.MONGODB_URI
          ? `URI starts with: ${process.env.MONGODB_URI.substring(0, 20)}...`
          : "MongoDB URI is undefined",
      },
      auth: {
        jwtSecret: jwtSecretStatus,
        jwtExpire: jwtExpireStatus,
      },
    },
  });
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  try {
    // Create token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set!");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    const token = user.getSignedJwtToken();

    console.log(`Token generated successfully for user: ${user._id}`);

    res.status(statusCode).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (err) {
    console.error("Error generating token:", err);
    res.status(500).json({
      success: false,
      error: "Error generating authentication token",
      details: err.message,
    });
  }
};
