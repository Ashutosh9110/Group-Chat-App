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


module.exports = {
  postGroupMessage,
  getGroupMessages
}