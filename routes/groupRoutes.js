const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const {authenticate } = require("../middleware/auth");

router.post("/create", authenticate, groupController.createGroup);
router.post("/join", authenticate, groupController.joinGroup);
router.get("/user", authenticate, groupController.getUserGroups);
router.post("/add-user", authenticate, groupController.addUserToGroup);

module.exports = router;
