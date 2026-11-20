const express = require("express");
const mongoose = require("mongoose");

const Bookmark = require("../models/Bookmark");
const Article = require("../models/Article");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET all bookmarks belonging to the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user.userId,
    })
      .populate("article")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookmarks });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch saved articles." });
  }
});

// ADD an article to bookmarks
router.post("/:articleId", authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.params;

    if (!mongoose.isValidObjectId(articleId)) {
      return res.status(400).json({ message: "Invalid article ID." });
    }

    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }

    const existingBookmark = await Bookmark.findOne({
      user: req.user.userId,
      article: articleId,
    });

    if (existingBookmark) {
      return res.status(409).json({
        message: "This article is already saved.",
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user.userId,
      article: articleId,
    });

    res.status(201).json({
      message: "Article saved successfully.",
      bookmark,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This article is already saved.",
      });
    }

    res.status(500).json({ message: "Unable to save this article." });
  }
});

// REMOVE an article from bookmarks
router.delete("/:articleId", authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.params;

    if (!mongoose.isValidObjectId(articleId)) {
      return res.status(400).json({ message: "Invalid article ID." });
    }

    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user.userId,
      article: articleId,
    });

    if (!bookmark) {
      return res.status(404).json({
        message: "Saved article not found.",
      });
    }

    res.status(200).json({
      message: "Article removed from saved articles.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to remove this saved article.",
    });
  }
});

module.exports = router;
