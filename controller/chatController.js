const { chatMessage } = require("../models/chatModel")
const { usersChat } = require("../models/userModel")

const postMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.userId; 
  try {
    const newMessage = await chatMessage.create({ message, userId });
    const fullMessage = await chatMessage.findOne({
      where: { id: newMessage.id },
      include: {
        model: usersChat,
        as: "sender",
        attributes: ["name"]
      }
    });
    res.status(201).json(fullMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send message" });
  }
};


const getAllMessages = async (req, res) => {
  try {
    const messages = await chatMessage.findAll({
      order: [["createdAt", "ASC"]],
      include: {
        model: usersChat,
        as: "sender",
        attributes: ["name"]
      }
    });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch messages" });
  }
};



module.exports = { postMessage, getAllMessages };
