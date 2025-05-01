const express = require("express");
const {
  getAchievements,
  getUserAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  checkUserAchievement,
  getLeaderboard,
} = require("../controllers/achievements");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAchievements);
router.get("/leaderboard", getLeaderboard);
router.get("/:id", getAchievement);

// Protected routes
router.use(protect);
router.get("/user/progress", getUserAchievements);
router.post("/user/check/:id", checkUserAchievement);

// Admin only routes
router.use(authorize("admin"));
router.post("/", createAchievement);
router.put("/:id", updateAchievement);
router.delete("/:id", deleteAchievement);

module.exports = router;
