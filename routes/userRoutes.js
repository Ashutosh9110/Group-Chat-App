const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")

// router.get("/", userController.signUp)
router.post("/signup", userController.signUp)




module.exports = router