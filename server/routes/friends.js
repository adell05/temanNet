const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");

// GET daftar teman berdasarkan userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Cek validitas ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID user tidak valid" });
    }

    // Cari user, populate teman
    const user = await User.findById(userId).populate({
      path: "friends",
      select: "_id username name email photo",
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({
      count: user.friends.length,
      friends: user.friends,
    });
  } catch (error) {
    console.error("❌ Error ambil daftar teman:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

module.exports = router;
