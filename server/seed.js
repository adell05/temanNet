const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ Terkoneksi ke MongoDB");
    return seedData();
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi ke MongoDB:", err.message);
  });

async function seedData() {
  try {
    // Kosongkan koleksi User
    await User.deleteMany();

    // Buat Dummy User
    const userA = new User({
      username: "alice",
      email: "alice@mail.com",
      password: "123456",
    });

    const userB = new User({
      username: "bob",
      email: "bob@mail.com",
      password: "123456",
    });

    const userC = new User({
      username: "charlie",
      email: "charlie@mail.com",
      password: "123456",
    });

    await userA.save();
    await userB.save();
    await userC.save();

    // Buat mereka saling follow
    userA.friends.push(userB._id, userC._id);
    userB.friends.push(userA._id);
    userC.friends.push(userA._id);

    await userA.save();
    await userB.save();
    await userC.save();

    console.log("✅ Dummy user & followers-following berhasil dibuat");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error saat seed data:", err.message);
    process.exit(1);
  }
}
