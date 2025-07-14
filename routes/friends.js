const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Ambil daftar teman
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("friends", "name email");
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    res.json(user.friends);
  } catch (error) {
    console.error("❌ Error ambil teman:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
