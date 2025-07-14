const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Ambil semua post (terbaru di atas)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name photo")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("❌ Error ambil post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Buat post baru
router.post("/", async (req, res) => {
  try {
    const { userId, caption, image } = req.body;

    const newPost = new Post({
      user: userId,
      caption,
      image,
    });

    await newPost.save();
    res.status(201).json({ message: "Post berhasil dibuat" });
  } catch (err) {
    console.error("❌ Error buat post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Like atau Unlike post
router.put("/like/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({
      message: alreadyLiked ? "Unlike berhasil" : "Like berhasil",
      likes: post.likes,
    });
  } catch (err) {
    console.error("❌ Error like/unlike post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Tambah komentar
router.post("/comment/:id", async (req, res) => {
  try {
    const { userId, name, text } = req.body;

    if (!text) return res.status(400).json({ message: "Komentar tidak boleh kosong" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    const newComment = {
      user: userId,
      name,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      message: "Komentar berhasil ditambahkan",
      comments: post.comments,
    });
  } catch (err) {
    console.error("❌ Error tambah komentar:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
