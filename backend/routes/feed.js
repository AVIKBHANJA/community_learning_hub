const express = require("express");
const {
  getFeed,
  saveContent,
  shareContent,
  reportContent,
  getSavedContent,
} = require("../controllers/feed");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);

router.get("/", getFeed);
router.get("/saved", getSavedContent);
router.post("/:id/save", saveContent);
router.post("/:id/share", shareContent);
router.post("/:id/report", reportContent);

module.exports = router;
