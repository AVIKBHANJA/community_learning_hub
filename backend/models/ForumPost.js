const mongoose = require("mongoose");

const ForumPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    body: {
      type: String,
      required: [true, "Please add post content"],
      maxlength: [5000, "Post content cannot be more than 5000 characters"],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: [
        "general",
        "beginner-questions",
        "programming",
        "data-science",
        "web-development",
        "mobile-development",
        "cloud-computing",
        "devops",
        "cybersecurity",
        "career-advice",
        "project-showcase",
        "resources",
      ],
    },
    tags: {
      type: [String],
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    relatedLearningPath: {
      type: mongoose.Schema.ObjectId,
      ref: "LearningPath",
    },
    relatedContent: {
      type: mongoose.Schema.ObjectId,
      ref: "Content",
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
    acceptedAnswer: {
      type: mongoose.Schema.ObjectId,
      ref: "ForumComment",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate with comments
ForumPostSchema.virtual("comments", {
  ref: "ForumComment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

// Cascade delete comments when a post is deleted
ForumPostSchema.pre("remove", async function (next) {
  await this.model("ForumComment").deleteMany({ post: this._id });
  next();
});

module.exports = mongoose.model("ForumPost", ForumPostSchema);
