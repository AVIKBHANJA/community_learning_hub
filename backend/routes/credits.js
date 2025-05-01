const express = require("express");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Import controllers
const {
  getCreditBalance,
  getCreditHistory,
  earnCredits,
  spendCredits,
  getRewards,
  getReward,
  createReward,
  updateReward,
  deleteReward,
  redeemReward,
  getUserRedemptions,
} = require("../controllers/credits");

// Protect all routes
router.use(protect);

router.get("/balance", getCreditBalance);
router.get("/history", getCreditHistory);
router.post("/earn", earnCredits);
router.post("/spend", spendCredits);

// Get all rewards
router.get("/rewards", getRewards);

// Get specific reward
router.get("/rewards/:id", getReward);

// Get user's redemption history
router.get("/redemptions", getUserRedemptions);

// Redeem a reward
router.post("/rewards/:id/redeem", redeemReward);

// Admin only routes
router.use(authorize("admin"));
router.post("/rewards", createReward);
router.put("/rewards/:id", updateReward);
router.delete("/rewards/:id", deleteReward);

module.exports = router;
