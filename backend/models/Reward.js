const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema(
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
      required: [true, "Please specify a reward type"],
      enum: [
        "premium_content",
        "exclusive_event",
        "mentorship",
        "badge",
        "certificate",
        "merchandise",
        "discount",
        "donation",
        "other",
      ],
    },
    imageUrl: {
      type: String,
      default: "default-reward.jpg",
    },
    cost: {
      type: Number,
      required: [true, "Please specify the credit cost"],
      min: [1, "Cost must be at least 1 credit"],
    },
    availableQuantity: {
      type: Number,
      default: -1, // -1 means unlimited
    },
    expiresAt: {
      type: Date,
    },
    redemptionInstructions: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate if a reward is available based on quantity and expiration
RewardSchema.virtual("isAvailable").get(function () {
  if (!this.isActive) return false;

  if (this.expiresAt && new Date() > this.expiresAt) return false;

  if (this.availableQuantity === -1) return true;

  return this.availableQuantity > 0;
});

module.exports = mongoose.model("Reward", RewardSchema);
