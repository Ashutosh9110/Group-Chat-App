const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db-connection");
const { chatMessage } = require("./chatModel");

const usersChat = sequelize.define("usersChat", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
})



usersChat.hasMany(chatMessage);
chatMessage.belongsTo(usersChat);


module.exports = { usersChat }