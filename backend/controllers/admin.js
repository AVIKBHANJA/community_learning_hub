const Report = require("../models/Report");
const User = require("../models/User");
const Content = require("../models/Content");
const CreditTransaction = require("../models/CreditTransaction");

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getReports = async (req, res) => {
  try {
    // Filter by status if provided
    const statusFilter = req.query.status ? { status: req.query.status } : {};

    // Implement pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const reports = await Report.find(statusFilter)
      .populate({
        path: "content",
        select: "title description source url",
      })
      .populate({
        path: "reportedBy",
        select: "username email",
      })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Report.countDocuments(statusFilter);

    res.status(200).json({
      success: true,
      count: reports.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: reports,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Review a report
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
exports.reviewReport = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Please provide a status update",
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found",
      });
    }

    // Update report
    report.status = status;
    report.reviewedBy = req.user.id;

    if (notes) {
      report.details += `\n\nModerator Notes: ${notes}`;
    }

    if (status === "resolved" || status === "dismissed") {
      report.resolvedAt = Date.now();
    }

    await report.save();

    res.status(200).json({
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

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    // Get user stats
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    // Get content stats
    const totalContent = await Content.countDocuments();
    const contentBySource = await Content.aggregate([
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get top saved content
    const topSavedContent = await Content.find()
      .sort({ "saved.length": -1 })
      .limit(5)
      .select("title source url saved");

    // Get credit stats
    const totalCreditsEarned = await CreditTransaction.aggregate([
      {
        $match: { type: "earn" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalCreditsSpent = await CreditTransaction.aggregate([
      {
        $match: { type: "spend" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          new: newUsers,
        },
        content: {
          total: totalContent,
          bySource: contentBySource,
        },
        topContent: topSavedContent,
        credits: {
          earned:
            totalCreditsEarned.length > 0 ? totalCreditsEarned[0].total : 0,
          spent: totalCreditsSpent.length > 0 ? totalCreditsSpent[0].total : 0,
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

// @desc    Manage users (list, filter)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.manageUsers = async (req, res) => {
  try {
    // Filter by role if provided
    const roleFilter = req.query.role ? { role: req.query.role } : {};

    // Implement pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const users = await User.find(roleFilter)
      .select("username email role credits createdAt")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await User.countDocuments(roleFilter);

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
