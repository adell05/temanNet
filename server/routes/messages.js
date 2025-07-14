const router = require("express").Router();
const Message = require("../models/Message");
const User = require("../models/User");

// Ambil semua pesan antara dua user (hanya jika mereka teman)
router.get("/:userId/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findById(userId);
    if (!user || !user.friends.includes(friendId)) {
      return res.status(403).json("Hanya bisa melihat pesan dengan teman.");
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json("Terjadi kesalahan saat mengambil pesan.");
  }
});

// Kirim pesan teks atau audio (hanya jika mereka teman)
router.post("/", async (req, res) => {
  try {
    const { sender, receiver, text, audio } = req.body;

    const senderUser = await User.findById(sender);
    if (!senderUser || !senderUser.friends.includes(receiver)) {
      return res.status(403).json("Hanya bisa mengirim pesan ke teman.");
    }

    const newMessage = new Message({
      sender,
      receiver,
      text: text || "",
      audio: audio || "",
    });

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json("Terjadi kesalahan saat mengirim pesan.");
  }
});

module.exports = router;
