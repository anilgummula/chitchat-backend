const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();
// require('./config/db.js');
const connectDB = require("./src/libs/db.js");

const authRouter = require('./src/routes/auth.route.js');
const userRouter = require('./src/routes/user.route.js')
const messageRouter = require('./src/routes/message.route.js');

const {Server} = require('socket.io');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

//http server
const server = http.createServer(app);

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/message',messageRouter);


// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // change to frontend URL in production
    methods: ["GET", "POST"]
  }
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("⚡ A user connected:", socket.id);

  // Save userId → socketId mapping
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("✅ User added:", userId);
  });

  // Send message to specific user
  socket.on("sendMessage", ({ senderId, receiverId, text, image }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", {
        senderId,
        text,
        image,
        createdAt: new Date()
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});



app.set("io", io);
app.set("onlineUsers", onlineUsers);

server.listen(PORT,()=>{
    console.log('server running at port: ',PORT); 
    connectDB();
})