const Post = require("../models/Post");

// Ambil semua postingan
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name photo").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah postingan
const createPost = async (req, res) => {
  const { caption, image } = req.body;
  try {
    const newPost = new Post({
      user: req.user.id,
      caption,
      image,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hapus postingan
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });
    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Tidak boleh menghapus postingan orang lain" });

    await post.deleteOne();
    res.json({ message: "Post dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like / Unlike Postingan
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah Komentar
const commentPost = async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    const newComment = {
      user: req.user.id,
      name: req.user.name,
      text,
    };

    post.comments.push(newComment);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPosts,
  createPost,
  deletePost,
  likePost,
  commentPost,
};
