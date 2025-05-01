const mongoose = require("mongoose");

const CreditTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["earn", "spend"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
    enum: [
      "watch_content",
      "engage_feed",
      "share_content",
      "unlock_premium",
      "attend_event",
      "other",
    ],
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CreditTransaction", CreditTransactionSchema);
