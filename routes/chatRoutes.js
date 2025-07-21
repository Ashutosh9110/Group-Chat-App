const express = require("express")
const router = express.Router()
const { authenticate } = require("../middleware/auth")
const chatController = require("../controller/chatController")




router.post("/send", authenticate, chatController.postMessage)
router.get("/all", authenticate, chatController.getAllMessages)


module.exports = router

