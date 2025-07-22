const { usersChat } = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const signUp = async (req, res) => {

  try {
  const { name, email, phone, password } = req.body
    const existingUser = await usersChat.findOne({ where : {email}})
    if(existingUser) {
      return res.status(401).json({ msg : "User already exists, Please Login!"})
    } 

    bcrypt.hash(password, 10, async(err, hash) => {
      const newUser = await usersChat.create({ name, email, phone, password:hash})
      return res.status(201).json({ msg : `User with name ${name} has been created`, userId: newUser.id })
    })

  } catch (error) {
      res.status(500).json({ msg : "Failed to signup the user"})
  }
}


const signIn = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await usersChat.findOne({ where: { email }})
    if(!user){
      return res.status(404).json({ msg : "User not found, please signup to access the chats"})
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
      return res.status(401).json({ msg : "Incorrect password."})
    }
  
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {expiresIn: "1h"})
    res.status(200).json({ msg : "User logged in", token, userId: user.id })
  } catch (error) {
    res.status(500).json({ msg : "Failed to signin the user"})
  }
}



module.exports = {
  signUp,
  signIn
}