const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const groupMessageController = require("../controllers/groupMessageController")
const {authenticate } = require("../middleware/auth");

router.post("/create", authenticate, groupController.createGroup);
router.post("/join", authenticate, groupController.joinGroup);
router.get("/user", authenticate, groupController.getUserGroups);
router.post("/add-user", authenticate, groupController.addUserToGroup);
router.post("/promote-user", authenticate, groupMessageController.promoteToAdmin);
router.post("/remove-user", authenticate, groupMessageController.removeUserFromGroup);


module.exports = router;
