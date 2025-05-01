const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    type: {
      type: String,
      required: [true, "Please specify an achievement type"],
      enum: [
        "forum_participation",
        "learning_progress",
        "content_creation",
        "community_contribution",
        "event_participation",
        "streak",
        "milestone",
        "challenge",
        "other",
      ],
    },
    criteria: {
      type: Object,
      required: [true, "Please specify achievement criteria"],
    },
    icon: {
      type: String,
      default: "default-achievement.svg",
    },
    badgeUrl: {
      type: String,
    },
    creditReward: {
      type: Number,
      default: 0,
    },
    tier: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum", "diamond"],
      default: "bronze",
    },
    isSecret: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Achievement", AchievementSchema);
