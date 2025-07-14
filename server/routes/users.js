const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/User");

// Setup Upload Directory
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Setup Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)),
});
const upload = multer({ storage });


// ========== FRIEND SYSTEM ==========

// Kirim Permintaan Teman
router.post("/send-request", async (req, res) => {
  try {
    const { from, to } = req.body;
    const recipient = await User.findById(to);
    if (!recipient) return res.status(404).json({ error: "User tidak ditemukan" });

    if (recipient.requests.includes(from)) return res.status(400).json({ error: "Sudah mengirim permintaan" });
    if (recipient.friends.includes(from)) return res.status(400).json({ error: "Sudah menjadi teman" });

    recipient.requests.push(from);
    await recipient.save();
    res.json({ message: "Permintaan teman dikirim" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Terima Permintaan Teman
router.post("/accept-request", async (req, res) => {
  try {
    const { from, to } = req.body;
    const user = await User.findById(to);
    const sender = await User.findById(from);
    if (!user || !sender) return res.status(404).json({ error: "User tidak ditemukan" });

    user.requests = user.requests.filter((id) => id.toString() !== from);

    if (!user.friends.includes(from)) user.friends.push(from);
    if (!sender.friends.includes(to)) sender.friends.push(to);

    if (!user.followers.includes(from)) user.followers.push(from);
    if (!user.following.includes(from)) user.following.push(from);
    if (!sender.followers.includes(to)) sender.followers.push(to);
    if (!sender.following.includes(to)) sender.following.push(to);

    await user.save();
    await sender.save();

    res.json({ message: "Permintaan teman diterima" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Tolak Permintaan Teman
router.post("/decline-request", async (req, res) => {
  try {
    const { from, to } = req.body;
    const user = await User.findById(to);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    user.requests = user.requests.filter((id) => id.toString() !== from);
    await user.save();
    res.json({ message: "Permintaan teman ditolak" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Hapus Teman
router.post("/remove-friend", async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) return res.status(404).json({ error: "User tidak ditemukan" });

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    user.followers = user.followers.filter((id) => id.toString() !== friendId);
    user.following = user.following.filter((id) => id.toString() !== friendId);
    friend.followers = friend.followers.filter((id) => id.toString() !== userId);
    friend.following = friend.following.filter((id) => id.toString() !== userId);

    await user.save();
    await friend.save();
    res.json({ message: "Teman dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ========== GET DATA ==========

// Saran Teman
router.get("/suggestions/:userId", async (req, res) => {
  try {
    const suggestions = await User.find({
      _id: { $ne: req.params.userId },
      friends: { $ne: req.params.userId },
      requests: { $ne: req.params.userId },
    }).select("-password");
    res.json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Daftar Teman
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("friends", "-password");
    res.json(user.friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Permintaan Teman
router.get("/requests/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("requests", "-password");
    res.json(user.requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Followers
router.get("/followers/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("followers", "-password");
    res.json(user.followers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Following
router.get("/following/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("following", "-password");
    res.json(user.following);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Semua User
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ========== UPLOAD FOTO PROFIL ==========
router.put("/photo/:id", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Tidak ada file diunggah" });
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: "ID user tidak valid" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    if (user.photo) {
      const oldPath = path.join(uploadDir, path.basename(user.photo));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.photo = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ message: "Foto profil diperbarui", photo: user.photo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memperbarui foto" });
  }
});

module.exports = router;
