require("dotenv").config()
const express = require("express")
const path = require("path")
const cors = require("cors")
const http = require('http');
const { Server } = require("socket.io");

const {sequelize} = require("./utils/db-connection")
const setupAssociations = require("./dbModels/associations");
setupAssociations();

const userRoutes = require("./routes/userRoutes") 
const chatRoutes = require("./routes/chatRoutes")
const groupRoutes = require("./routes/groupRoutes");
const messageRoutes = require("./routes/messageRoutes");


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json())
app.use(express.static('public'))

app.use("/users", userRoutes)
app.use("/chats", chatRoutes)
app.use("/groups", groupRoutes)
app.use("/group-messages", messageRoutes)

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})



// SOCKET.IO EVENTS
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a group room
  socket.on("joinGroup", (groupId) => {
    socket.join(`group_${groupId}`);
    console.log(`Socket ${socket.id} joined group_${groupId}`);
  });

  // Broadcast new message to the group
  socket.on("sendMessage", ({ groupId, message, sender }) => {
    const payload = {
      groupId,
      message,
      sender,
      timestamp: new Date().toISOString()
    };
    io.to(`group_${groupId}`).emit("newMessage", payload);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// DB Sync + Server Start
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});