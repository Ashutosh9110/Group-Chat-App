const express = require("express");
const router = express.Router();
const groupMessageController = require("../controllers/groupMessageController"); // or wherever you define it
const { authenticate } = require("../middleware/auth")
const upload = require('../middleware/upload');


router.post("/", authenticate, groupMessageController.postGroupMessage);
router.get("/:groupId", authenticate, groupMessageController.getGroupMessages);

module.exports = router;
