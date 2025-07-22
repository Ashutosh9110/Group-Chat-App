const express = require("express")
const router = express.Router()
const { authenticate } = require("../middleware/auth")
const chatController = require("../controllers/chatController")




router.post("/send", authenticate, chatController.postMessage)
router.get("/all", authenticate, chatController.getAllMessages)
router.get("/new", authenticate, chatController.getNewMessages);


module.exports = router

