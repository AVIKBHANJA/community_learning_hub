const ForumPost = require("../models/ForumPost");
const ForumComment = require("../models/ForumComment");
const User = require("../models/User");
const CreditTransaction = require("../models/CreditTransaction");

// @desc    Get all forum posts with pagination
// @route   GET /api/forum
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    // Implement pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filter by tags if provided
    let query = {};
    if (req.query.tags) {
      const tags = req.query.tags.split(",");
      query.tags = { $in: tags };
    }

    // Search functionality
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { body: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Get posts with sort options
    const sortOption = {};
    if (req.query.sort === "newest") {
      sortOption.createdAt = -1;
    } else if (req.query.sort === "oldest") {
      sortOption.createdAt = 1;
    } else if (req.query.sort === "popular") {
      sortOption.viewCount = -1;
    } else {
      sortOption.createdAt = -1; // Default to newest
    }

    // Pin posts that are marked as pinned
    if (!req.query.sort || req.query.sort === "newest") {
      sortOption.isPinned = -1;
    }

    const posts = await ForumPost.find(query)
      .populate({
        path: "author",
        select: "name avatar",
      })
      .sort(sortOption)
      .skip(startIndex)
      .limit(limit);

    // Get total count
    const total = await ForumPost.countDocuments(query);

    // Get comment count for each post
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await ForumComment.countDocuments({
          post: post._id,
        });
        return {
          ...post.toObject(),
          commentCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: postsWithCommentCount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get single forum post with comments
// @route   GET /api/forum/:id
// @access  Public
exports.getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate({
        path: "author",
        select: "name avatar role",
      })
      .populate({
        path: "comments",
        populate: [
          {
            path: "author",
            select: "name avatar role",
          },
          {
            path: "replies",
            populate: {
              path: "author",
              select: "name avatar role",
            },
          },
        ],
      })
      .populate("acceptedAnswer");

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Forum post not found",
      });
    }

    // Increment view count only if not the author viewing
    if (req.user && req.user.id !== post.author._id.toString()) {
      post.viewCount += 1;
      await post.save();
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Create a forum post
// @route   POST /api/forum
// @access  Private
exports.createPost = async (req, res) => {
  try {
    // Add user to req.body
    req.body.author = req.user.id;

    const post = await ForumPost.create(req.body);

    // Award credits for creating a post
    await CreditTransaction.create({
      user: req.user.id,
      type: "earn",
      amount: 3,
      purpose: "create_forum_post",
      description: `Created forum post: ${post.title}`,
    });

    // Update user's credits
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: 3 } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      data: post,
      credits: {
        earned: 3,
        message: "You earned 3 credits for creating a forum post!",
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Update forum post
// @route   PUT /api/forum/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    let post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Forum post not found",
      });
    }

    // Make sure user is post owner
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this post",
      });
    }

    post = await ForumPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Delete forum post
// @route   DELETE /api/forum/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Forum post not found",
      });
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this post",
      });
    }

    await post.remove();

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

// @desc    Create a comment on a forum post
// @route   POST /api/forum/:id/comments
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Forum post not found",
      });
    }

    // Create the comment
    const comment = await ForumComment.create({
      post: req.params.id,
      body: req.body.body,
      author: req.user.id,
      parentComment: req.body.parentComment || null,
    });

    // Populate the author
    await comment.populate({
      path: "author",
      select: "name avatar role",
    });

    // Award credits for commenting
    const creditAmount = req.body.parentComment ? 1 : 2; // Less credits for replies
    const creditDescription = req.body.parentComment
      ? "Replied to a comment in forum post"
      : "Posted a comment on a forum post";

    await CreditTransaction.create({
      user: req.user.id,
      type: "earn",
      amount: creditAmount,
      purpose: "create_forum_comment",
      description: creditDescription,
    });

    // Update user's credits
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: creditAmount } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      data: comment,
      credits: {
        earned: creditAmount,
        message: `You earned ${creditAmount} credits for your comment!`,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Like a forum post
// @route   POST /api/forum/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Forum post not found",
      });
    }

    // Check if post has already been liked by this user
    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter((like) => like.toString() !== req.user.id);
      await post.save();

      return res.status(200).json({
        success: true,
        data: {
          likes: post.likes,
          action: "unliked",
        },
      });
    }

    // Like the post
    post.likes.push(req.user.id);
    await post.save();

    // Award credits to the post author (not to the liker)
    // Only if the liker is different from the author
    if (post.author.toString() !== req.user.id) {
      await CreditTransaction.create({
        user: post.author,
        type: "earn",
        amount: 1,
        purpose: "post_liked",
        description: "Your forum post was liked by another user",
      });

      // Update post author's credits
      await User.findByIdAndUpdate(
        post.author,
        { $inc: { credits: 1 } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: {
        likes: post.likes,
        action: "liked",
      },
      authorCredited: post.author.toString() !== req.user.id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Like a comment
// @route   POST /api/forum/comments/:commentId/like
// @access  Private
exports.likeComment = async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }

    // Check if comment has already been liked by this user
    const isLiked = comment.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike the comment
      comment.likes = comment.likes.filter(
        (like) => like.toString() !== req.user.id
      );
      await comment.save();

      return res.status(200).json({
        success: true,
        data: {
          likes: comment.likes,
          action: "unliked",
        },
      });
    }

    // Like the comment
    comment.likes.push(req.user.id);
    await comment.save();

    // Award credits to the comment author (not to the liker)
    // Only if the liker is different from the author
    if (comment.author.toString() !== req.user.id) {
      await CreditTransaction.create({
        user: comment.author,
        type: "earn",
        amount: 1,
        purpose: "comment_liked",
        description: "Your comment was liked by another user",
      });

      // Update comment author's credits
      await User.findByIdAndUpdate(
        comment.author,
        { $inc: { credits: 1 } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: {
        likes: comment.likes,
        action: "liked",
      },
      authorCredited: comment.author.toString() !== req.user.id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Accept answer on a forum post
// @route   POST /api/forum/:id/accept-answer/:commentId
// @access  Private
exports.acceptAnswer = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    const comment = await ForumComment.findById(req.params.commentId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Forum post not found",
      });
    }

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }

    // Make sure user is post owner
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to mark an answer as accepted",
      });
    }

    // Make sure comment belongs to the post
    if (comment.post.toString() !== post._id.toString()) {
      return res.status(400).json({
        success: false,
        error: "Comment does not belong to this post",
      });
    }

    // Update the post with accepted answer
    post.acceptedAnswer = comment._id;
    post.isSolved = true;
    await post.save();

    // Update the comment
    comment.isAcceptedAnswer = true;
    await comment.save();

    // Award credits to the comment author
    if (comment.author.toString() !== req.user.id) {
      await CreditTransaction.create({
        user: comment.author,
        type: "earn",
        amount: 5,
        purpose: "answer_accepted",
        description: "Your answer was accepted as the solution",
      });

      // Update comment author's credits
      await User.findByIdAndUpdate(
        comment.author,
        { $inc: { credits: 5 } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: {
        post,
        comment,
      },
      credits:
        comment.author.toString() !== req.user.id
          ? {
              earned: 5,
              userId: comment.author,
              message:
                "Commenter earned 5 credits for having their answer accepted!",
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

// @desc    Get posts by a specific user
// @route   GET /api/forum/user/:userId
// @access  Private
exports.getPostsByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const posts = await ForumPost.find({ author: req.params.userId })
      .populate({
        path: "author",
        select: "name avatar",
      })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await ForumPost.countDocuments({ author: req.params.userId });

    // Get comment count for each post
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await ForumComment.countDocuments({
          post: post._id,
        });
        return {
          ...post.toObject(),
          commentCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: postsWithCommentCount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get posts by category
// @route   GET /api/forum/category/:category
// @access  Public
exports.getPostsByCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const posts = await ForumPost.find({ category: req.params.category })
      .populate({
        path: "author",
        select: "name avatar",
      })
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await ForumPost.countDocuments({
      category: req.params.category,
    });

    // Get comment count for each post
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await ForumComment.countDocuments({
          post: post._id,
        });
        return {
          ...post.toObject(),
          commentCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: postsWithCommentCount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get popular posts
// @route   GET /api/forum/popular
// @access  Public
exports.getPopularPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const posts = await ForumPost.find()
      .populate({
        path: "author",
        select: "name avatar",
      })
      .sort({ viewCount: -1, likes: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await ForumPost.countDocuments();

    // Get comment count for each post
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await ForumComment.countDocuments({
          post: post._id,
        });
        return {
          ...post.toObject(),
          commentCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: postsWithCommentCount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
