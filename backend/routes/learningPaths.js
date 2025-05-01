const express = require("express");
const {
  getLearningPaths,
  getLearningPath,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
  enrollInLearningPath,
  updateProgress,
  rateLearningPath,
  getEnrolledPaths,
  getRecommendedPaths,
} = require("../controllers/learningPaths");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Routes open to authenticated users
router.get("/", getLearningPaths);
router.get("/enrolled", protect, getEnrolledPaths);
router.get("/recommended", protect, getRecommendedPaths);
router.get("/:id", getLearningPath);

// Routes requiring user authentication
router.post("/:id/enroll", protect, enrollInLearningPath);
router.put("/:id/progress", protect, updateProgress);
router.post("/:id/rate", protect, rateLearningPath);

// Routes requiring admin/moderator authentication
router.post("/", protect, authorize("admin", "moderator"), createLearningPath);
router.put(
  "/:id",
  protect,
  authorize("admin", "moderator"),
  updateLearningPath
);
router.delete(
  "/:id",
  protect,
  authorize("admin", "moderator"),
  deleteLearningPath
);

module.exports = router;
