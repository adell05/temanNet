const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// GET semua postingan
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil post" });
  }
});

// POST posting baru
router.post("/", async (req, res) => {
  try {
    const newPost = new Post({
      user: req.body.userId,
      caption: req.body.caption,
      image: req.body.image,
    });

    await newPost.save();
    res.json({ message: "Post berhasil dibuat" });
  } catch (err) {
    res.status(500).json({ message: "Gagal membuat post" });
  }
});

module.exports = router;
