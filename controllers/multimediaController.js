// controllers/messageController.js
const { chatMessage } = require("../dbModels/chatModel");

const uploadFileMessage = async (req, res) => {
  try {
    const { receiverId, groupId } = req.body; // if group, use groupId
    const filePath = req.file.path;

    const message = await chatMessage.create({
      message: filePath,
      userId: req.user.userId,
      receiverId: receiverId || null,
      groupId: groupId || null,
      isFile: true
    });

    // Emit via socket to relevant room
    req.app.get('io').emit(groupId ? `group:${groupId}` : `user:${receiverId}`, {
      message,
      senderId: req.user.userId,
    });

    res.status(200).json({ success: true, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
};


module.exports = { uploadFileMessage }