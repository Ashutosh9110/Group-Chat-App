const { usersChat } = require("./userModel");
const { chatMessage } = require("./chatModel");
const { Group, GroupMember, GroupMessage } = require("../models/groupModel");

function setupAssociations() {
  usersChat.hasMany(chatMessage, { foreignKey: "userId", as: "messages" });
  chatMessage.belongsTo(usersChat, { foreignKey: "userId", as: "sender" });

  usersChat.belongsToMany(Group, {
    through: GroupMember,
    foreignKey: "userId",
    otherKey: "groupId"
  });

  Group.belongsToMany(usersChat, {
    through: GroupMember,
    foreignKey: "groupId",
    otherKey: "userId"
  });

  Group.hasMany(GroupMessage, { foreignKey: "groupId" });
  GroupMessage.belongsTo(Group, { foreignKey: "groupId" });

  usersChat.hasMany(GroupMessage, { foreignKey: "userId" });
  GroupMessage.belongsTo(usersChat, { as: "sender", foreignKey: "userId" });

  Group.hasMany(GroupMember, { foreignKey: "groupId" });
  GroupMember.belongsTo(Group, { foreignKey: "groupId" });

// (optional if you want to get GroupMember → usersChat)
  GroupMember.belongsTo(usersChat, { foreignKey: "userId" });

}

module.exports = setupAssociations;
