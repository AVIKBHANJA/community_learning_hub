const Achievement = require("../models/Achievement");
const UserAchievement = require("../models/UserAchievement");
const User = require("../models/User");
const CreditTransaction = require("../models/CreditTransaction");

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
exports.getAchievements = async (req, res) => {
  try {
    // Only show active achievements
    const query = { isActive: true };

    // If not logged in, hide secret achievements
    if (!req.user) {
      query.isSecret = false;
    }

    // Handle filters
    if (req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.tier) {
      query.tier = req.query.tier;
    }

    const achievements = await Achievement.find(query).sort({
      displayOrder: 1,
      tier: 1,
    });

    // If user is logged in, include their progress on each achievement
    let achievementsWithProgress = achievements;

    if (req.user) {
      const userAchievements = await UserAchievement.find({
        user: req.user.id,
      });

      // Map user progress to achievements
      achievementsWithProgress = achievements.map((achievement) => {
        const userAchievement = userAchievements.find(
          (ua) => ua.achievement.toString() === achievement._id.toString()
        );

        const achievementObj = achievement.toObject();

        if (userAchievement) {
          achievementObj.progress = userAchievement.progress;
          achievementObj.isCompleted = userAchievement.isCompleted;
          achievementObj.earnedAt = userAchievement.earnedAt;
          achievementObj.completedAt = userAchievement.completedAt;
        } else {
          achievementObj.progress = 0;
          achievementObj.isCompleted = false;
        }

        return achievementObj;
      });
    }

    res.status(200).json({
      success: true,
      count: achievementsWithProgress.length,
      data: achievementsWithProgress,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
exports.getAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: "Achievement not found",
      });
    }

    // If secret and user not logged in, return 404
    if (achievement.isSecret && !req.user) {
      return res.status(404).json({
        success: false,
        error: "Achievement not found",
      });
    }

    // If user is logged in, include their progress
    let achievementWithProgress = achievement.toObject();

    if (req.user) {
      const userAchievement = await UserAchievement.findOne({
        user: req.user.id,
        achievement: achievement._id,
      });

      if (userAchievement) {
        achievementWithProgress.progress = userAchievement.progress;
        achievementWithProgress.isCompleted = userAchievement.isCompleted;
        achievementWithProgress.earnedAt = userAchievement.earnedAt;
        achievementWithProgress.completedAt = userAchievement.completedAt;
      } else {
        achievementWithProgress.progress = 0;
        achievementWithProgress.isCompleted = false;
      }
    }

    res.status(200).json({
      success: true,
      data: achievementWithProgress,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get current user's achievements
// @route   GET /api/achievements/user/progress
// @access  Private
exports.getUserAchievements = async (req, res) => {
  try {
    const userAchievements = await UserAchievement.find({ user: req.user.id })
      .populate("achievement")
      .sort({ completedAt: -1, updatedAt: -1 });

    const completed = userAchievements.filter((ua) => ua.isCompleted);
    const inProgress = userAchievements.filter(
      (ua) => !ua.isCompleted && ua.progress > 0
    );

    // Get all achievements to identify not started ones
    const allAchievements = await Achievement.find({ isActive: true });

    const userAchievementIds = userAchievements.map((ua) =>
      ua.achievement._id.toString()
    );

    const notStarted = allAchievements
      .filter(
        (a) => !userAchievementIds.includes(a._id.toString()) && !a.isSecret
      )
      .map((a) => ({
        achievement: a,
        progress: 0,
        isCompleted: false,
      }));

    res.status(200).json({
      success: true,
      data: {
        completed: completed,
        inProgress: inProgress,
        notStarted: notStarted,
        summary: {
          total: allAchievements.length,
          completed: completed.length,
          inProgress: inProgress.length,
          notStarted: notStarted.length,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Create a new achievement
// @route   POST /api/achievements
// @access  Admin
exports.createAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);

    res.status(201).json({
      success: true,
      data: achievement,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Admin
exports.updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: "Achievement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: achievement,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Admin
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: "Achievement not found",
      });
    }

    // Check if any user has this achievement before deleting
    const hasUserAchievements = await UserAchievement.countDocuments({
      achievement: req.params.id,
    });

    if (hasUserAchievements > 0) {
      // Instead of deleting, just mark it as inactive
      achievement.isActive = false;
      await achievement.save();

      return res.status(200).json({
        success: true,
        message:
          "Achievement has been deactivated as users have already earned it",
        data: achievement,
      });
    }

    await achievement.remove();

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

// @desc    Check and update user achievement progress
// @route   POST /api/achievements/user/check/:id
// @access  Private
exports.checkUserAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement || !achievement.isActive) {
      return res.status(404).json({
        success: false,
        error: "Achievement not found or inactive",
      });
    }

    // Find or create user achievement record
    let userAchievement = await UserAchievement.findOne({
      user: req.user.id,
      achievement: achievement._id,
    });

    if (!userAchievement) {
      userAchievement = await UserAchievement.create({
        user: req.user.id,
        achievement: achievement._id,
        progress: 0,
        isCompleted: false,
      });
    }

    // If already completed, no need to check again
    if (userAchievement.isCompleted) {
      return res.status(200).json({
        success: true,
        message: "Achievement already completed",
        data: userAchievement,
      });
    }

    // Process the achievement criteria based on achievement type
    // This will be different for each type of achievement
    // In a real implementation, this would be more complex and specific to achievement types

    // For this example, we'll use a simple progress update from the request body
    const { progress } = req.body;
    let isNewlyCompleted = false;

    if (progress !== undefined) {
      userAchievement.progress = progress;

      // Check if achievement is now completed
      if (progress >= 100 && !userAchievement.isCompleted) {
        userAchievement.isCompleted = true;
        userAchievement.completedAt = Date.now();
        isNewlyCompleted = true;
      }

      await userAchievement.save();
    }

    // Award credits if achievement was just completed and has a credit reward
    if (
      isNewlyCompleted &&
      achievement.creditReward > 0 &&
      !userAchievement.creditAwarded
    ) {
      userAchievement.creditAwarded = true;
      await userAchievement.save();

      // Create a credit transaction
      await CreditTransaction.create({
        user: req.user.id,
        type: "earn",
        amount: achievement.creditReward,
        purpose: "achievement_completed",
        description: `Completed achievement: ${achievement.title}`,
      });

      // Update user's credits
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { credits: achievement.creditReward },
      });
    }

    await userAchievement.populate("achievement");

    const response = {
      success: true,
      data: userAchievement,
    };

    if (isNewlyCompleted) {
      response.message = `Congratulations! You've completed the "${achievement.title}" achievement`;

      if (achievement.creditReward > 0) {
        response.credits = {
          earned: achievement.creditReward,
          message: `You earned ${achievement.creditReward} credits for completing this achievement!`,
        };
      }
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get achievements leaderboard
// @route   GET /api/achievements/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    // Aggregate to get users with their completed achievement counts
    const leaderboard = await UserAchievement.aggregate([
      { $match: { isCompleted: true } },
      {
        $group: {
          _id: "$user",
          achievementsCompleted: { $sum: 1 },
          lastCompletedAt: { $max: "$completedAt" },
        },
      },
      { $sort: { achievementsCompleted: -1, lastCompletedAt: 1 } },
      { $limit: 20 },
    ]);

    // Populate user details
    const populatedLeaderboard = await User.populate(leaderboard, {
      path: "_id",
      select: "name avatar",
    });

    // Format the response
    const formattedLeaderboard = populatedLeaderboard.map((entry, index) => ({
      rank: index + 1,
      user: entry._id,
      achievementsCompleted: entry.achievementsCompleted,
      lastCompletedAt: entry.lastCompletedAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedLeaderboard,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
