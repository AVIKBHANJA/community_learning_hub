const express = require("express");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Import admin controllers
const {
  getReports,
  reviewReport,
  getStats,
  manageUsers,
} = require("../controllers/admin");

// Protect all routes and restrict to admin/moderator
router.use(protect);
router.use(authorize("admin", "moderator"));

// Report routes
router.get("/reports", getReports);
router.put("/reports/:id", reviewReport);

// Stats routes
router.get("/stats", getStats);

// User management routes
router.get("/users", manageUsers);

module.exports = router;
