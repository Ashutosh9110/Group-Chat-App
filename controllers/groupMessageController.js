const { Group, GroupMember } = require("../models/groupModel");


const addUserToGroup = async (req, res) => {
  try {
    const { email, groupId } = req.body;
    const requesterId = req.user.userId;

    // Check if requester is a member of the group
    const isRequesterMember = await GroupMember.findOne({
      where: { userId: requesterId, groupId }
    });
    if (!isRequesterMember) {
      return res.status(403).json({ msg: "You are not a member of this group" });
    }

    // Find user by email
    const user = await usersChat.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Check if already a member
    const isAlreadyMember = await GroupMember.findOne({
      where: { userId: user.id, groupId }
    });
    if (isAlreadyMember) {
      return res.status(400).json({ msg: "User is already a group member" });
    }

    await GroupMember.create({ userId: user.id, groupId });
    res.status(200).json({ msg: "User added to group" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to add user to group" });
  }
};



const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;
    const group = await Group.create({ name, createdBy: userId });
    await GroupMember.create({ userId, groupId: group.id });
    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create group" });
  }
};

const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.userId;
    const isMember = await GroupMember.findOne({ where: { userId, groupId } });
    if (isMember) return res.status(400).json({ msg: "Already a member" });
    await GroupMember.create({ userId, groupId });
    res.status(200).json({ msg: "Joined group" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to join group" });
  }
};

const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groups = await Group.findAll({
      include: {
        model: GroupMember,
        where: { userId },
      },
    });
    res.status(200).json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch groups" });
  }
};


module.exports = {
  createGroup,
  joinGroup,
  getUserGroups,
  addUserToGroup
}