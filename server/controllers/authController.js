import User from "../models/User.js";
import bcrypt from "bcryptjs";

// 📩 REGISTER USER
export const register = async (req, res) => {
  console.log("📩 Data dari frontend:", req.body);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("✅ User baru disimpan:", newUser.email);
    res.status(201).json({ message: "Registrasi berhasil." });
  } catch (err) {
    console.error("❌ Error saat registrasi:", err);
    res.status(500).json({ message: "Server error saat registrasi." });
  }
};

// 🔐 LOGIN USER
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email tidak ditemukan." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah." });
    }

    res.status(200).json({
      message: "Login berhasil.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Error saat login:", err);
    res.status(500).json({ message: "Server error saat login." });
  }
};
