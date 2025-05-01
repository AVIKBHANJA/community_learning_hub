const mongoose = require("mongoose");

const UserAchievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    achievement: {
      type: mongoose.Schema.ObjectId,
      ref: "Achievement",
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    creditAwarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure one user-achievement pair
UserAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

module.exports = mongoose.model("UserAchievement", UserAchievementSchema);
