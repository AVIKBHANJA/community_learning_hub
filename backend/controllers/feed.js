const Content = require("../models/Content");
const User = require("../models/User");
const Report = require("../models/Report");
const CreditTransaction = require("../models/CreditTransaction");

// @desc    Get feed content
// @route   GET /api/feed
// @access  Private
exports.getFeed = async (req, res) => {
  try {
    // Implement pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filter by source if provided
    const sourceFilter = req.query.source ? { source: req.query.source } : {};

    const content = await Content.find(sourceFilter)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Content.countDocuments(sourceFilter);

    res.status(200).json({
      success: true,
      count: content.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: content,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Save content for later
// @route   POST /api/feed/:id/save
// @access  Private
exports.saveContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: "Content not found",
      });
    }

    // Check if already saved
    if (content.saved.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: "Content already saved",
      });
    }

    // Add user to saved array
    content.saved.push(req.user.id);
    await content.save();

    // Add content to user's saved content
    const user = await User.findById(req.user.id);
    user.savedContent.push(content._id);
    await user.save();

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Share content
// @route   POST /api/feed/:id/share
// @access  Private
exports.shareContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: "Content not found",
      });
    }

    // Add user to shared array
    content.shared.push(req.user.id);
    await content.save();

    // Award credits for sharing
    await CreditTransaction.create({
      user: req.user.id,
      type: "earn",
      amount: 5, // Award 5 credits for sharing
      purpose: "share_content",
      description: `Shared content: ${content.title}`,
    });

    // Update user's credits
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: 5 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: content,
      credits: {
        earned: 5,
        message: "You earned 5 credits for sharing content!",
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Report content
// @route   POST /api/feed/:id/report
// @access  Private
exports.reportContent = async (req, res) => {
  try {
    const { reason, details } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: "Please provide a reason for reporting",
      });
    }

    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: "Content not found",
      });
    }

    // Create report
    const report = await Report.create({
      content: content._id,
      reportedBy: req.user.id,
      reason,
      details: details || "",
    });

    // Add report to content's reported array
    content.reported.push(report._id);
    await content.save();

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get user's saved content
// @route   GET /api/feed/saved
// @access  Private
exports.getSavedContent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedContent");

    res.status(200).json({
      success: true,
      count: user.savedContent.length,
      data: user.savedContent,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
