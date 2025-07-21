require("dotenv").config()
const express = require("express")
const path = require("path")
const app = express()
const cors = require("cors")

const {sequelize} = require("./utils/db-connection")
const setupAssociations = require("./models/associations");
setupAssociations();

const userRoutes = require("./routes/userRoutes") 
const chatRoutes = require("./routes/chatRoutes")



app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json())
app.use(express.static('public'));
app.use("/users", userRoutes)
app.use("/chats", chatRoutes)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})


sequelize.sync().then(() => {
  app.listen(process.env.PORT || 5000)
}).catch((err) => {
    console.log(err);
  })