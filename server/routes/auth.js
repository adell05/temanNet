const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, dan password wajib diisi." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username sudah terdaftar." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      photo: "",
    });
    await newUser.save();

    res.status(201).json({
      message: "Registrasi berhasil!",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        photo: newUser.photo,
      },
    });
  } catch (error) {
    console.error("❌ Gagal registrasi:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan server saat registrasi." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email atau password salah." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email atau password salah." });
    }

    res.status(200).json({
      message: "Login berhasil!",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error("❌ Gagal login:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan server saat login." });
  }
});

module.exports = router;
