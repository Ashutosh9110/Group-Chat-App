const { chatMessage } = require("../models/chatModel")
const { usersChat } = require("../models/userModel")
const { Op } = require("sequelize");


const postMessage = async (req, res) => {

  const { message } = req.body;
  const userId = req.user.userId
  try {

    const existingUser = await usersChat.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ msg: "User does not exist" });
    }
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


const getNewMessages = async (req, res) => {
  const afterId = parseInt(req.query.afterId) || 0;
  try {
    const messages = await chatMessage.findAll({
      where: {
        id: { [Op.gt]: afterId }
      },
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
    res.status(500).json({ msg: "Failed to fetch new messages" });
  }
};




module.exports = { postMessage, getAllMessages, getNewMessages };