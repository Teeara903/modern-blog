const express = require("express");
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Article = require("../models/Article");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET comments for an article — public
router.get("/:articleId", async (req, res) => {
  try {
    const { articleId } = req.params;

    if (!mongoose.isValidObjectId(articleId)) {
      return res.status(400).json({
        message: "Invalid article ID.",
      });
    }

    const articleExists = await Article.exists({ _id: articleId });

    if (!articleExists) {
      return res.status(404).json({
        message: "Article not found.",
      });
    }

    const comments = await Comment.find({ article: articleId })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    return res.json(comments);
  } catch (error) {
    console.error("Fetch comments error:", error.message);

    return res.status(500).json({
      message: "Unable to fetch comments.",
    });
  }
});

// POST a comment — login required
router.post("/:articleId", authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(articleId)) {
      return res.status(400).json({
        message: "Invalid article ID.",
      });
    }

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        message: "Please write a comment.",
      });
    }

    if (content.trim().length > 1000) {
      return res.status(400).json({
        message: "Comments cannot exceed 1000 characters.",
      });
    }

    const articleExists = await Article.exists({ _id: articleId });

    if (!articleExists) {
      return res.status(404).json({
        message: "Article not found.",
      });
    }

    const comment = await Comment.create({
      article: articleId,
      author: req.user.userId,
      content: content.trim(),
    });

    await comment.populate("author", "name");

    return res.status(201).json({
      message: "Comment posted successfully.",
      comment,
    });
  } catch (error) {
    console.error("Post comment error:", error.message);

    return res.status(500).json({
      message: "Unable to post comment.",
    });
  }
});

// EDIT a comment — comment owner only
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid comment ID.",
      });
    }

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        message: "Please write a comment.",
      });
    }

    if (content.trim().length > 1000) {
      return res.status(400).json({
        message: "Comments cannot exceed 1000 characters.",
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }

    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only edit your own comments.",
      });
    }

    comment.content = content.trim();
    await comment.save();
    await comment.populate("author", "name");

    return res.json({
      message: "Comment updated successfully.",
      comment,
    });
  } catch (error) {
    console.error("Edit comment error:", error.message);

    return res.status(500).json({
      message: "Unable to update comment.",
    });
  }
});

// DELETE a comment — comment owner or article owner
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid comment ID.",
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }

    const article = await Article.findById(comment.article);

    const isCommentOwner = comment.author.toString() === req.user.userId;

    const isArticleOwner =
      article &&
      article.author &&
      article.author.toString() === req.user.userId;

    if (!isCommentOwner && !isArticleOwner) {
      return res.status(403).json({
        message: "You are not allowed to delete this comment.",
      });
    }

    await comment.deleteOne();

    return res.json({
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete comment error:", error.message);

    return res.status(500).json({
      message: "Unable to delete comment.",
    });
  }
});

module.exports = router;
