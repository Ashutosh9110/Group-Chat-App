const { usersChat } = require("../models/usermodel")
const bcrypt = require("bcrypt")


const signUp = async (req, res) => {



  try {
  const { name, email, phone, password } = req.body
    const existingUser = await usersChat.findOne({ where : {email}})
    if(existingUser) {
      return res.status(401).json({ msg : "User already exists, Please Login!"})
    } 

    bcrypt.hash(password, 10, async(err, hash) => {
      await usersChat.create({ name, email, phone, password:hash})
      return res.status(201).json({ msg : `User with name ${name} has been created`})
    })

  } catch (error) {
      res.status(500).json({ msg : "Failed to signup the user"})
  }




}



module.exports = {
  signUp
}