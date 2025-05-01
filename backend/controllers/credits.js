const User = require("../models/User");
const CreditTransaction = require("../models/CreditTransaction");
const Reward = require("../models/Reward");
const Redemption = require("../models/Redemption");

// @desc    Get user's credit balance
// @route   GET /api/credits/balance
// @access  Private
exports.getCreditBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        credits: user.credits,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get user's credit transaction history
// @route   GET /api/credits/history
// @access  Private
exports.getCreditHistory = async (req, res) => {
  try {
    // Implement pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filter by transaction type if provided
    const typeFilter = req.query.type
      ? { user: req.user.id, type: req.query.type }
      : { user: req.user.id };

    const transactions = await CreditTransaction.find(typeFilter)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await CreditTransaction.countDocuments(typeFilter);

    res.status(200).json({
      success: true,
      count: transactions.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: transactions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Earn credits for activities
// @route   POST /api/credits/earn
// @access  Private
exports.earnCredits = async (req, res) => {
  try {
    const { amount, purpose, description } = req.body;

    if (!amount || !purpose) {
      return res.status(400).json({
        success: false,
        error: "Please provide amount and purpose",
      });
    }

    // Create credit transaction
    const transaction = await CreditTransaction.create({
      user: req.user.id,
      type: "earn",
      amount,
      purpose,
      description: description || purpose,
    });

    // Update user's credit balance
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: amount } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      data: {
        transaction,
        newBalance: user.credits,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Spend credits for rewards or premium content
// @route   POST /api/credits/spend
// @access  Private
exports.spendCredits = async (req, res) => {
  try {
    const { amount, purpose, description } = req.body;

    if (!amount || !purpose) {
      return res.status(400).json({
        success: false,
        error: "Please provide amount and purpose",
      });
    }

    // Check if user has enough credits
    const user = await User.findById(req.user.id);

    if (user.credits < amount) {
      return res.status(400).json({
        success: false,
        error: "Insufficient credits",
      });
    }

    // Create credit transaction
    const transaction = await CreditTransaction.create({
      user: req.user.id,
      type: "spend",
      amount,
      purpose,
      description: description || purpose,
    });

    // Update user's credit balance
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: -amount } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      data: {
        transaction,
        newBalance: updatedUser.credits,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get all rewards
// @route   GET /api/credits/rewards
// @access  Public
exports.getRewards = async (req, res) => {
  try {
    // Implement pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filter active rewards only unless admin
    let query = { isActive: true };

    if (req.user && req.user.role === "admin") {
      // Admins can see all rewards with optional filter
      if (req.query.showAll !== "true") {
        query = { isActive: req.query.isActive === "true" };
      } else {
        query = {};
      }
    }

    // Filter by type if provided
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by featured flag
    if (req.query.featured === "true") {
      query.featured = true;
    }

    // Sort options
    let sortBy = {};
    if (req.query.sort === "cost-asc") {
      sortBy = { cost: 1 };
    } else if (req.query.sort === "cost-desc") {
      sortBy = { cost: -1 };
    } else if (req.query.sort === "newest") {
      sortBy = { createdAt: -1 };
    } else {
      // Default sort: featured first, then newest
      sortBy = { featured: -1, createdAt: -1 };
    }

    const rewards = await Reward.find(query)
      .populate({
        path: "createdBy",
        select: "name",
      })
      .sort(sortBy)
      .skip(startIndex)
      .limit(limit);

    const total = await Reward.countDocuments(query);

    // Add availability status to each reward
    const rewardsWithAvailability = rewards.map((reward) => {
      const rewardObj = reward.toObject();
      rewardObj.isAvailable = reward.isAvailable;

      // For expired rewards
      if (reward.expiresAt && new Date() > reward.expiresAt) {
        rewardObj.unavailableReason = "This reward has expired";
      }
      // For out of stock rewards
      else if (reward.availableQuantity === 0) {
        rewardObj.unavailableReason = "This reward is out of stock";
      }
      // For inactive rewards
      else if (!reward.isActive) {
        rewardObj.unavailableReason = "This reward is currently unavailable";
      }

      return rewardObj;
    });

    // Check which rewards the user can afford
    let userCredits = 0;
    if (req.user) {
      const user = await User.findById(req.user.id).select("credits");
      userCredits = user.credits;
    }

    res.status(200).json({
      success: true,
      count: rewards.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      userCredits,
      data: rewardsWithAvailability,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get a single reward
// @route   GET /api/credits/rewards/:id
// @access  Public
exports.getReward = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id).populate({
      path: "createdBy",
      select: "name",
    });

    if (!reward) {
      return res.status(404).json({
        success: false,
        error: "Reward not found",
      });
    }

    // If not admin and reward is not active, return error
    if (!req.user || (req.user.role !== "admin" && !reward.isActive)) {
      return res.status(404).json({
        success: false,
        error: "Reward not available",
      });
    }

    const rewardObj = reward.toObject();
    rewardObj.isAvailable = reward.isAvailable;

    // For expired rewards
    if (reward.expiresAt && new Date() > reward.expiresAt) {
      rewardObj.unavailableReason = "This reward has expired";
    }
    // For out of stock rewards
    else if (reward.availableQuantity === 0) {
      rewardObj.unavailableReason = "This reward is out of stock";
    }
    // For inactive rewards
    else if (!reward.isActive) {
      rewardObj.unavailableReason = "This reward is currently unavailable";
    }

    // Check if user can afford this reward
    let canAfford = false;
    if (req.user) {
      const user = await User.findById(req.user.id).select("credits");
      canAfford = user.credits >= reward.cost;
      rewardObj.userCredits = user.credits;
    }

    rewardObj.canAfford = canAfford;

    res.status(200).json({
      success: true,
      data: rewardObj,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Create a new reward
// @route   POST /api/credits/rewards
// @access  Admin only
exports.createReward = async (req, res) => {
  try {
    // Add admin user as creator
    req.body.createdBy = req.user.id;

    const reward = await Reward.create(req.body);

    res.status(201).json({
      success: true,
      data: reward,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Update a reward
// @route   PUT /api/credits/rewards/:id
// @access  Admin only
exports.updateReward = async (req, res) => {
  try {
    let reward = await Reward.findById(req.params.id);

    if (!reward) {
      return res.status(404).json({
        success: false,
        error: "Reward not found",
      });
    }

    reward = await Reward.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: reward,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Delete a reward
// @route   DELETE /api/credits/rewards/:id
// @access  Admin only
exports.deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);

    if (!reward) {
      return res.status(404).json({
        success: false,
        error: "Reward not found",
      });
    }

    // Check if any user has redeemed this reward
    const redemptions = await Redemption.countDocuments({
      reward: req.params.id,
    });

    if (redemptions > 0) {
      // If redemptions exist, just mark as inactive instead of deleting
      reward.isActive = false;
      await reward.save();

      return res.status(200).json({
        success: true,
        message:
          "Reward has been deactivated as users have already redeemed it",
        data: reward,
      });
    }

    await reward.remove();

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

// @desc    Redeem a reward
// @route   POST /api/credits/rewards/:id/redeem
// @access  Private
exports.redeemReward = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);

    if (!reward) {
      return res.status(404).json({
        success: false,
        error: "Reward not found",
      });
    }

    // Check if reward is available
    if (!reward.isAvailable) {
      let reason = "Reward is not available";

      if (reward.expiresAt && new Date() > reward.expiresAt) {
        reason = "This reward has expired";
      } else if (reward.availableQuantity === 0) {
        reason = "This reward is out of stock";
      } else if (!reward.isActive) {
        reason = "This reward is currently unavailable";
      }

      return res.status(400).json({
        success: false,
        error: reason,
      });
    }

    // Check if user has enough credits
    const user = await User.findById(req.user.id).select("credits");

    if (user.credits < reward.cost) {
      return res.status(400).json({
        success: false,
        error: `Not enough credits. You have ${user.credits} credits, but this reward costs ${reward.cost} credits.`,
      });
    }

    // Create redemption record
    const redemption = await Redemption.create({
      user: req.user.id,
      reward: reward._id,
      creditsCost: reward.cost,
      status: "pending",
    });

    // Create credit transaction to spend credits
    await CreditTransaction.create({
      user: req.user.id,
      type: "spend",
      amount: reward.cost,
      purpose: "redeem_reward",
      description: `Redeemed reward: ${reward.title}`,
    });

    // Update user's credits
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: -reward.cost } },
      { new: true }
    );

    // Update reward quantity if it's not unlimited
    if (reward.availableQuantity !== -1) {
      reward.availableQuantity -= 1;
      await reward.save();
    }

    // Populate the redemption with reward details
    await redemption.populate({
      path: "reward",
      select: "title description type redemptionInstructions",
    });

    res.status(200).json({
      success: true,
      data: redemption,
      message: `Successfully redeemed "${reward.title}" for ${reward.cost} credits!`,
      creditsRemaining: user.credits - reward.cost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get user's redemption history
// @route   GET /api/credits/redemptions
// @access  Private
exports.getUserRedemptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const redemptions = await Redemption.find({ user: req.user.id })
      .populate({
        path: "reward",
        select: "title description type imageUrl cost redemptionInstructions",
      })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Redemption.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: redemptions.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: redemptions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
