const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const uploadsDir = path.join(__dirname, "uploads");

// Pastikan folder uploads ada
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("📁 Folder 'uploads' berhasil dibuat");
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/messages", require("./routes/messages"));

// Cek jika routes/friends.js ada baru dipakai
try {
  if (fs.existsSync(path.join(__dirname, "routes", "friends.js"))) {
    app.use("/api/friends", require("./routes/friends"));
    console.log("✅ routes/friends.js aktif");
  } else {
    console.log("ℹ️ routes/friends.js tidak ditemukan, dilewati");
  }
} catch (err) {
  console.error("❌ Error cek routes/friends.js:", err.message);
}

// Endpoint Test
app.get("/", (req, res) => {
  res.send("✅ Server TemanNet berjalan dengan baik");
});

// Koneksi MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ Terkoneksi ke MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Server aktif di http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi ke MongoDB:", err.message);
    process.exit(1);
  });
