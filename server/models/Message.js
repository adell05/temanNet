const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String }, // Tidak wajib, bisa kosong kalau cuma kirim audio
    audio: { type: String }, // Path file audio, boleh kosong
  },
  { timestamps: true } // Otomatis buat createdAt & updatedAt
);

module.exports = mongoose.model("Message", MessageSchema);
