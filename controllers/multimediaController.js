const { chatMessage } = require("../dbModels/chatModel");

const uploadFileMessage = async (req, res) => {
  console.log(">>> req.file:", req.file); // ADD THIS
  console.log(">>> req.body:", req.body); // Also useful

  try {
    const { receiverId, groupId } = req.body; // if group, use groupId
    const filePath = req.file.path;
    console.log("req.file:", req.file); // Should be defined

    const message = await chatMessage.create({
      message: filePath,
      userId: req.user.userId,
      receiverId: receiverId || null,
      groupId: groupId || null,
      isFile: true
    });
  // Emit via socket to relevant room
  req.app.get('io').emit(groupId ? `group_${groupId}` : `user:${receiverId}`, {
    message: filePath,
    senderId: req.user.id,
    type: 'file',
    timestamp: new Date().toISOString()
  });
  

  
    res.status(200).json({ success: true, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
};


module.exports = { uploadFileMessage }