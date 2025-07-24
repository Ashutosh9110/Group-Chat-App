const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const groupMessageController = require("../controllers/groupMessageController")
const {authenticate } = require("../middleware/auth");


// Group Management
router.post("/create", authenticate, groupController.createGroup);
router.post("/join", authenticate, groupController.joinGroup);
router.get("/user", authenticate, groupController.getUserGroups);
router.post("/add-user", authenticate, groupController.addUserToGroup);

// Group Admin Features
router.post("/promote-user", authenticate, groupMessageController.promoteToAdmin);
router.post("/remove-user", authenticate, groupMessageController.removeUserFromGroup);


// Group Messages
router.post("/message", authenticate, groupMessageController.postGroupMessage);
router.get("/messages/:groupId", authenticate, groupMessageController.getGroupMessages);


module.exports = router;
