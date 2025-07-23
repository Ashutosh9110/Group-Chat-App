const { GroupMessage, GroupMember } = require("../models/groupModel");
const { usersChat } = require("../models/userModel")


const postGroupMessage = async (req, res) => {
  try {
    const { message, groupId } = req.body;
    const userId = req.user.userId;
    const isMember = await GroupMember.findOne({ where: { userId, groupId } });
    if (!isMember) return res.status(403).json({ msg: "Not a group member" });

    const newMessage = await GroupMessage.create({ message, groupId, userId });
    const fullMessage = await GroupMessage.findOne({
      where: { id: newMessage.id },
      include: {
        model: usersChat,
        as: "sender",
        attributes: ["name"],
      },
    });
    res.status(201).json(fullMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to post group message" });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const messages = await GroupMessage.findAll({
      where: { groupId },
      order: [["createdAt", "ASC"]],
      include: {
        model: usersChat,
        as: "sender",
        attributes: ["name"],
      },
    });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch group messages" });
  }
};


const promoteToAdmin = async (req, res) => {
  try {
    const { email, groupId } = req.body;
    const requesterId = req.user.userId;
    console.log("Promote request body:", req.body);
    console.log("Requester ID from token:", requesterId);
    
    const requester = await GroupMember.findOne({ where: { userId: requesterId, groupId, isAdmin: true } });
    if (!requester) return res.status(403).json({ msg: "Only admins can promote" });

    const user = await usersChat.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const membership = await GroupMember.findOne({ where: { userId: user.id, groupId } });
    if (!membership) return res.status(400).json({ msg: "User is not in group" });

    membership.isAdmin = true;
    await membership.save();

    res.status(200).json({ msg: "User promoted to admin" });
  } catch (err) {
    console.error("🔥 Error in promoteToAdmin:", err);
    res.status(500).json({ msg: "Internal server error while promoting user" });
  }
};




const removeUserFromGroup = async (req, res) => {
  const { email, groupId } = req.body;
  const requesterId = req.user.userId;

  const isAdmin = await GroupMember.findOne({ where: { userId: requesterId, groupId, isAdmin: true } });
  if (!isAdmin) return res.status(403).json({ msg: "Only admins can remove users" });

  const user = await usersChat.findOne({ where: { email } });
  if (!user) return res.status(404).json({ msg: "User not found" });

  await GroupMember.destroy({ where: { userId: user.id, groupId } });
  res.status(200).json({ msg: "User removed from group" });
};


module.exports = {
  postGroupMessage,
  getGroupMessages,
  promoteToAdmin,
  removeUserFromGroup
}