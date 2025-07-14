import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await User.deleteMany({});
    console.log("✅ Semua user dihapus. Register ulang.");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Gagal koneksi:", err);
    process.exit(1);
  });
