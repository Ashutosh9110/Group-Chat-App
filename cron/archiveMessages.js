const cron = require('node-cron');
const { chatMessage } = require("../dbModels/chatModel");
const { archivedChat } = require("../dbModels/archivedChat");
const { Op } = require('sequelize');

// Schedule job to run every night at 2 AM
cron.schedule('0 2 * * *', async () => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Find old messages
    const oldMessages = await chatMessage.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo
        }
      }
    });

    if (oldMessages.length > 0) {
      // Bulk insert into ArchivedChat table
      const archiveData = oldMessages.map(msg => ({
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        groupId: msg.groupId,
        message: msg.message,
        fileUrl: msg.fileUrl,
        isFile: msg.isFile,
        createdAt: msg.createdAt,
      }));
      await archivedChat.bulkCreate(archiveData);

      // Delete from original table
      const idsToDelete = oldMessages.map(msg => msg.id);
      await chatMessage.destroy({
        where: {
          id: { [Op.in]: idsToDelete }
        }
      });

      console.log(`Archived and deleted ${idsToDelete.length} messages.`);
    }
  } catch (error) {
    console.error("Error archiving messages:", error);
  }
});
