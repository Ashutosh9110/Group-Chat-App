const express = require("express");
const router = express.Router();
const groupMessageController = require("../controllers/groupMessageController");
const {authenticate } = require("../middleware/auth");

router.post("/create", authenticate, groupMessageController.createGroup);
router.post("/join", authenticate, groupMessageController.joinGroup);
router.get("/user", authenticate, groupMessageController.getUserGroups);
router.post("/add-user", authenticate, groupMessageController.addUserToGroup);

module.exports = router;
