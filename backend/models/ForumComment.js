const mongoose = require("mongoose");

const ForumCommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "ForumPost",
      required: true,
    },
    body: {
      type: String,
      required: [true, "Please add comment content"],
      maxlength: [2000, "Comment cannot be more than 2000 characters"],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.ObjectId,
      ref: "ForumComment",
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    isAcceptedAnswer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate with replies (nested comments)
ForumCommentSchema.virtual("replies", {
  ref: "ForumComment",
  localField: "_id",
  foreignField: "parentComment",
  justOne: false,
});

module.exports = mongoose.model("ForumComment", ForumCommentSchema);
