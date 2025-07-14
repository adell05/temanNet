const User = require("../models/User");

exports.getFriends = async (req, res) => {
  const user = await User.findById(req.params.userId).populate("friends", "_id name");
  res.json({ friends: user.friends });
};

exports.getRequests = async (req, res) => {
  const user = await User.findById(req.params.userId).populate("friendRequests", "_id name");
  res.json({ requests: user.friendRequests });
};

exports.getSuggestions = async (req, res) => {
  const user = await User.findById(req.params.userId);
  const suggestions = await User.find({
    _id: { $nin: [user._id, ...user.friends, ...user.friendRequests] },
  }).select("_id name");
  res.json({ suggestions });
};

exports.sendRequest = async (req, res) => {
  const { from, to } = req.body;
  const target = await User.findById(to);
  if (!target.friendRequests.includes(from)) {
    target.friendRequests.push(from);
    await target.save();
  }
  res.json({ message: "Request sent." });
};

exports.acceptRequest = async (req, res) => {
  const { userId, requesterId } = req.body;
  const user = await User.findById(userId);
  const requester = await User.findById(requesterId);

  user.friends.push(requesterId);
  requester.friends.push(userId);
  user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requesterId);
  await user.save();
  await requester.save();

  res.json({ message: "Friend request accepted." });
};

exports.rejectRequest = async (req, res) => {
  const { userId, requesterId } = req.body;
  const user = await User.findById(userId);
  user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requesterId);
  await user.save();
  res.json({ message: "Friend request rejected." });
};

exports.unfriend = async (req, res) => {
  const { userId, friendId } = req.body;
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  user.friends = user.friends.filter((id) => id.toString() !== friendId);
  friend.friends = friend.friends.filter((id) => id.toString() !== userId);

  await user.save();
  await friend.save();
  res.json({ message: "Friend removed." });
};