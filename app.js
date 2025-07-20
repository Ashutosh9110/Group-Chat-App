require("dotenv").config()
const express = require("express")
const path = require("path")
const app = express()
const cors = require("cors")

const {sequelize} = require("./utils/db-connection")

const userRouter = require("./routes/userRoutes") 

app.use(cors({
  origin: "http://localhost:3000  ",
  credentials: true
}))
app.use(express.json())
app.use(express.static('public'));
app.use("/users", userRouter)


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})


sequelize.sync({force: false, logging: console.log}).then(() => {
  app.listen(process.env.PORT || 5000)
}).catch((err) => {
    console.log(err);
  })