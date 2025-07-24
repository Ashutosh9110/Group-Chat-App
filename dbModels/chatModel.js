const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db-connection");

const chatMessage = sequelize.define("chatMessage", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = { chatMessage };
