const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db-connection");

const Group = sequelize.define("Group", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},{
  timestamps: true,
});

const GroupMember = sequelize.define("GroupMember", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "GroupMembers", // optional: avoids Sequelize renaming to plural
  timestamps: false
},{
  timestamps: true,
});

const GroupMessage = sequelize.define("GroupMessage", {
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
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "GroupMessages",
},{
  timestamps: true,
});

module.exports = {
  Group,
  GroupMember,
  GroupMessage,
};
