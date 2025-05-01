const LearningPath = require("../models/LearningPath");
const User = require("../models/User");
const CreditTransaction = require("../models/CreditTransaction");

// @desc    Get all learning paths
// @route   GET /api/learning-paths
// @access  Public
exports.getLearningPaths = async (req, res) => {
  try {
    // Implement pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filter learning paths by category, difficulty, etc.
    let query = { isPublished: true };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }

    if (req.query.tags) {
      const tags = req.query.tags.split(",");
      query.tags = { $in: tags };
    }

    const learningPaths = await LearningPath.find(query)
      .select(
        "title description difficulty category estimatedHours tags image averageRating enrolledUsers"
      )
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await LearningPath.countDocuments(query);

    res.status(200).json({
      success: true,
      count: learningPaths.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: learningPaths,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get single learning path
// @route   GET /api/learning-paths/:id
// @access  Public
exports.getLearningPath = async (req, res) => {
  try {
    const learningPath = await LearningPath.findById(req.params.id)
      .populate({
        path: "modules.content.contentId",
        select: "title description source url imageUrl tags",
      })
      .populate({
        path: "createdBy",
        select: "name avatar",
      });

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        error: "Learning path not found",
      });
    }

    res.status(200).json({
      success: true,
      data: learningPath,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Create new learning path
// @route   POST /api/learning-paths
// @access  Private/Admin/Moderator
exports.createLearningPath = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const learningPath = await LearningPath.create(req.body);

    res.status(201).json({
      success: true,
      data: learningPath,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Update learning path
// @route   PUT /api/learning-paths/:id
// @access  Private/Admin/Moderator
exports.updateLearningPath = async (req, res) => {
  try {
    let learningPath = await LearningPath.findById(req.params.id);

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        error: "Learning path not found",
      });
    }

    // Make sure user is path creator or admin
    if (
      learningPath.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this learning path",
      });
    }

    learningPath = await LearningPath.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: learningPath,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Delete learning path
// @route   DELETE /api/learning-paths/:id
// @access  Private/Admin/Moderator
exports.deleteLearningPath = async (req, res) => {
  try {
    const learningPath = await LearningPath.findById(req.params.id);

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        error: "Learning path not found",
      });
    }

    // Make sure user is path creator or admin
    if (
      learningPath.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this learning path",
      });
    }

    await learningPath.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Enroll in learning path
// @route   POST /api/learning-paths/:id/enroll
// @access  Private
exports.enrollInLearningPath = async (req, res) => {
  try {
    const learningPath = await LearningPath.findById(req.params.id);

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        error: "Learning path not found",
      });
    }

    // Check if user is already enrolled
    const isEnrolled = learningPath.enrolledUsers.some(
      (enrollment) => enrollment.user.toString() === req.user.id
    );

    if (isEnrolled) {
      return res.status(400).json({
        success: false,
        error: "User already enrolled in this learning path",
      });
    }

    // Add user to enrolledUsers array
    learningPath.enrolledUsers.push({
      user: req.user.id,
      progress: 0,
      completedContent: [],
      enrolledAt: Date.now(),
    });

    await learningPath.save();

    // Award credits for enrolling in a learning path
    await CreditTransaction.create({
      user: req.user.id,
      type: "earn",
      amount: 5,
      purpose: "enroll_learning_path",
      description: `Enrolled in learning path: ${learningPath.title}`,
    });

    // Update user's credits
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: 5 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: learningPath,
      credits: {
        earned: 5,
        message: "You earned 5 credits for enrolling in a learning path!",
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Update progress in learning path
// @route   PUT /api/learning-paths/:id/progress
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { contentId } = req.body;

    if (!contentId) {
      return res.status(400).json({
        success: false,
        error: "Please provide a content ID",
      });
    }

    const learningPath = await LearningPath.findById(req.params.id);

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        error: "Learning path not found",
      });
    }

    // Find user's enrollment
    const enrollmentIndex = learningPath.enrolledUsers.findIndex(
      (enrollment) => enrollment.user.toString() === req.user.id
    );

    if (enrollmentIndex === -1) {
      return res.status(400).json({
        success: false,
        error: "User not enrolled in this learning path",
      });
    }

    const enrollment = learningPath.enrolledUsers[enrollmentIndex];

    // Check if content is already completed
    if (enrollment.completedContent.includes(contentId)) {
      return res.status(400).json({
        success: false,
        error: "Content already completed",
      });
    }

    // Add content to completed content
    enrollment.completedContent.push(contentId);

    // Calculate progress percentage
    let totalContentItems = 0;
    for (const module of learningPath.modules) {
      totalContentItems += module.content.length;
    }

    const progress = Math.round(
      (enrollment.completedContent.length / totalContentItems) * 100
    );

    enrollment.progress = progress;

    await learningPath.save();

    // Award credits for completing content
    await CreditTransaction.create({
      user: req.user.id,
      type: "earn",
      amount: 2,
      purpose: "complete_learning_content",
      description: `Completed content in learning path: ${learningPath.title}`,
    });

    // Update user's credits
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: 2 } },
      { new: true }
    );

    // If path is now 100% completed, award bonus credits
    let completionBonus = 0;
    if (progress === 100) {
      completionBonus = 20;

      // Award bonus credits for completing the entire path
      await CreditTransaction.create({
        user: req.user.id,
        type: "earn",
        amount: completionBonus,
        purpose: "complete_learning_path",
        description: `Completed entire learning path: ${learningPath.title}`,
      });

      // Update user's credits
      await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { credits: completionBonus } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: {
        progress,
        completedContent: enrollment.completedContent,
      },
      credits: {
        earned: 2 + completionBonus,
        message: completionBonus
          ? `You earned 2 credits for progress and ${completionBonus} bonus credits for completing the path!`
          : "You earned 2 credits for your progress!",
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Rate learning path
// @route   POST /api/learning-paths/:id/rate
// @access  Private
exports.rateLearningPath = async (req, res) => {
  try {
    const { rating, review } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Please provide a rating between 1 and 5",
      });
    }

    const learningPath = await LearningPath.findById(req.params.id);

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        error: "Learning path not found",
      });
    }

    // Check if user has completed at least 50% of the path
    const enrollment = learningPath.enrolledUsers.find(
      (enrollment) => enrollment.user.toString() === req.user.id
    );

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        error: "You must be enrolled in this path to rate it",
      });
    }

    if (enrollment.progress < 50) {
      return res.status(400).json({
        success: false,
        error: "You must complete at least 50% of the path to rate it",
      });
    }

    // Check if user has already rated
    const ratingIndex = learningPath.ratings.findIndex(
      (r) => r.user.toString() === req.user.id
    );

    if (ratingIndex !== -1) {
      // Update existing rating
      learningPath.ratings[ratingIndex].rating = rating;
      learningPath.ratings[ratingIndex].review = review || "";
    } else {
      // Add new rating
      learningPath.ratings.push({
        user: req.user.id,
        rating,
        review: review || "",
      });

      // Award credits for first-time rating
      await CreditTransaction.create({
        user: req.user.id,
        type: "earn",
        amount: 3,
        purpose: "rate_learning_path",
        description: `Rated learning path: ${learningPath.title}`,
      });

      // Update user's credits
      await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { credits: 3 } },
        { new: true }
      );
    }

    await learningPath.save();

    res.status(200).json({
      success: true,
      data: learningPath.ratings.find((r) => r.user.toString() === req.user.id),
      credits:
        ratingIndex === -1
          ? {
              earned: 3,
              message: "You earned 3 credits for rating this learning path!",
            }
          : null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get user's enrolled learning paths
// @route   GET /api/learning-paths/enrolled
// @access  Private
exports.getEnrolledPaths = async (req, res) => {
  try {
    const learningPaths = await LearningPath.find({
      "enrolledUsers.user": req.user.id,
    }).select(
      "title description difficulty category estimatedHours tags image averageRating enrolledUsers"
    );

    // Map enrolled paths with user's progress information
    const enrolledPaths = learningPaths.map((path) => {
      const enrollment = path.enrolledUsers.find(
        (e) => e.user.toString() === req.user.id
      );

      return {
        _id: path._id,
        title: path.title,
        description: path.description,
        difficulty: path.difficulty,
        category: path.category,
        estimatedHours: path.estimatedHours,
        tags: path.tags,
        image: path.image,
        averageRating: path.averageRating,
        userProgress: enrollment ? enrollment.progress : 0,
        enrolledAt: enrollment ? enrollment.enrolledAt : null,
      };
    });

    res.status(200).json({
      success: true,
      count: enrolledPaths.length,
      data: enrolledPaths,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get recommended learning paths based on user interests and behavior
// @route   GET /api/learning-paths/recommended
// @access  Private
exports.getRecommendedPaths = async (req, res) => {
  try {
    // Get user for their interests
    const user = await User.findById(req.user.id).select(
      "interests savedContent"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Get paths that match user interests or saved content tags
    const interests = user.interests || [];

    // Find content the user has saved
    const savedContent = await Content.find({
      _id: { $in: user.savedContent },
    }).select("tags");

    // Extract tags from saved content
    const savedContentTags = savedContent.reduce((tags, content) => {
      return [...tags, ...content.tags];
    }, []);

    // Combine all user interests and tags from saved content
    const allInterests = [...interests, ...savedContentTags];

    // Find paths that match user interests or aren't already enrolled in
    const enrolledPaths = await LearningPath.find({
      "enrolledUsers.user": req.user.id,
    }).select("_id");

    const enrolledPathIds = enrolledPaths.map((path) => path._id);

    let recommendedPaths;

    if (allInterests.length > 0) {
      // Find paths that match user interests and aren't already enrolled in
      recommendedPaths = await LearningPath.find({
        isPublished: true,
        _id: { $nin: enrolledPathIds },
        $or: [
          { tags: { $in: allInterests } },
          { category: { $in: interests } },
        ],
      })
        .select(
          "title description difficulty category estimatedHours tags image averageRating"
        )
        .sort({ averageRating: -1 })
        .limit(5);
    } else {
      // If no interests or saved content, recommend popular paths
      recommendedPaths = await LearningPath.find({
        isPublished: true,
        _id: { $nin: enrolledPathIds },
      })
        .select(
          "title description difficulty category estimatedHours tags image averageRating enrolledUsers"
        )
        .sort({ "enrolledUsers.length": -1, averageRating: -1 })
        .limit(5);
    }

    res.status(200).json({
      success: true,
      count: recommendedPaths.length,
      data: recommendedPaths,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
