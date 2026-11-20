
const express = require("express");
const mongoose = require("mongoose");
const Article = require("../models/Article");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET all articles — public
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

// GET one article — public
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }

    const article = await Article.findById(req.params.id)
      .populate("author", "name");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch article" });
  }
});

// CREATE an article — login required
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { category, title, excerpt, image, content } = req.body;

    if (!category || !title || !excerpt || !image || !content) {
      return res.status(400).json({
        message: "Please provide a category, title, excerpt, image, and content.",
      });
    }

    const article = await Article.create({
      category,
      title,
      excerpt,
      image,
      content,
      author: req.user.userId,
    });

    res.status(201).json({
      message: "Article created successfully.",
      article,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create article",
    });
  }
});

// UPDATE an article — owner only
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (
      !article.author ||
      article.author.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only edit your own articles.",
      });
    }

    const allowedFields = [
      "category",
      "title",
      "excerpt",
      "image",
      "content",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        article[field] = req.body[field];
      }
    });

    await article.save();

    res.json({
      message: "Article updated successfully.",
      article,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update article",
    });
  }
});

// DELETE an article — owner only
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (
      !article.author ||
      article.author.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only delete your own articles.",
      });
    }

    await article.deleteOne();

    res.json({ message: "Article deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete article" });
  }
});

module.exports = router;
