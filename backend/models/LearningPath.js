const mongoose = require("mongoose");

const LearningPathSchema = new mongoose.Schema(
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
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
    },
    estimatedHours: {
      type: Number,
      required: [true, "Please add estimated hours to complete"],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    modules: [
      {
        title: {
          type: String,
          required: [true, "Please add a module title"],
        },
        description: {
          type: String,
        },
        content: [
          {
            contentId: {
              type: mongoose.Schema.ObjectId,
              ref: "Content",
            },
            order: {
              type: Number,
            },
          },
        ],
      },
    ],
    enrolledUsers: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        progress: {
          type: Number,
          default: 0,
        },
        completedContent: [
          {
            type: mongoose.Schema.ObjectId,
            ref: "Content",
          },
        ],
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
      default: "default-path.jpg",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isOfficial: {
      type: Boolean,
      default: false,
    },
    ratings: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        review: {
          type: String,
          maxlength: [200, "Review cannot be more than 200 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate average rating when ratings are added or modified
LearningPathSchema.pre("save", function (next) {
  if (this.ratings && this.ratings.length > 0) {
    this.averageRating =
      this.ratings.reduce((acc, item) => acc + item.rating, 0) /
      this.ratings.length;
  } else {
    this.averageRating = undefined;
  }
  next();
});

module.exports = mongoose.model("LearningPath", LearningPathSchema);
