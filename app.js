require("dotenv").config()
const express = require("express")
const path = require("path")
const cors = require("cors")
// const http = require('http');
const { Server } = require("socket.io");

const {sequelize} = require("./utils/db-connection")
const setupAssociations = require("./dbModels/associations");
setupAssociations();

const userRoutes = require("./routes/userRoutes") 
const chatRoutes = require("./routes/chatRoutes")
const groupRoutes = require("./routes/groupRoutes");
const messageRoutes = require("./routes/messageRoutes");


const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});
app.set("io", io);  

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
app.use('/messages', express.static('uploads'));

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})



io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join user-specific room on login or connection
  socket.on("registerUser", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined user_${userId}`);
  });

  // Handle sending personal message
  socket.on("sendPersonalMessage", ({ recipientId, message, sender }) => {
    const payload = {
      message,
      sender,
      timestamp: new Date().toISOString(),
    };
    io.to(`user_${recipientId}`).emit("newPersonalMessage", payload);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



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
  http.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});