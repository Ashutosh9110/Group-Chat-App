const { usersChat } = require("./userModel");
const { chatMessage } = require("./chatModel");

function setupAssociations() {
  usersChat.hasMany(chatMessage, {
    foreignKey: "userId",
    sourceKey: "id",  // optional but helps clarify
    as: "messages"
  });

  chatMessage.belongsTo(usersChat, {
    foreignKey: "userId",
    targetKey: "id",
    as: "sender"
  });
}



module.exports = setupAssociations
