const mongoose = require("mongoose");

const RedemptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    reward: {
      type: mongoose.Schema.ObjectId,
      ref: "Reward",
      required: true,
    },
    creditsCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "fulfilled", "cancelled"],
      default: "pending",
    },
    fulfillmentDetails: {
      type: String,
    },
    fulfilledAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Redemption", RedemptionSchema);
