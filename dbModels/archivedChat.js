const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db-connection");



  const ArchivedChat = sequelize.define("archivedChat", {
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
    isFile: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
  });


  module.exports = { ArchivedChat };
