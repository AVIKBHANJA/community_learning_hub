const express = require("express");
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  createComment,
  likeComment,
  acceptAnswer,
  getPostsByUser,
  getPostsByCategory,
  getPopularPosts,
} = require("../controllers/forum");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getPosts);
router.get("/popular", getPopularPosts);
router.get("/category/:category", getPostsByCategory);
router.get("/:id", getPost);

// Protected routes
router.use(protect);
router.get("/user/:userId", getPostsByUser);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.post("/:id/like", likePost);
router.post("/:id/comments", createComment);
router.post("/comments/:commentId/like", likeComment);
router.post("/:id/accept-answer/:commentId", acceptAnswer);

module.exports = router;
