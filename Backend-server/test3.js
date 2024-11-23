const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const ChatRoom = require("./chatRoomModel");

const app = express();
const server = http.Server(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/chatapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

// Helper to generate random IDs
const generateID = () => Math.random().toString(36).substring(2, 10);

// Socket.IO functionality
io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // Create a new chat room
  socket.on("createRoom", async (name) => {
    try {
      const room = new ChatRoom({ name, messages: [] });
      await room.save(); // Save room in DB
      const chatRooms = await ChatRoom.find(); // Fetch all rooms from DB
      io.emit("roomsList", chatRooms); // Broadcast updated rooms
    } catch (err) {
      console.error("Error creating room:", err);
    }
  });

  // Find room messages
  socket.on("findRoom", async (id) => {
    try {
      const room = await ChatRoom.findById(id);
      if (room) {
        socket.emit("foundRoom", room.messages);
      }
    } catch (err) {
      console.error("Error finding room:", err);
    }
  });

  // Handle a new message
  socket.on("newMessage", async (data) => {
    const { room_id, message, user, timestamp } = data;

    try {
      const room = await ChatRoom.findById(room_id);
      if (room) {
        const newMessage = {
          text: message,
          user,
          time: `${timestamp.hour}:${timestamp.mins}`,
        };

        room.messages.push(newMessage); // Add new message to room
        await room.save(); // Save the updated room in DB

        // Emit updated messages to the room
        socket.to(room.name).emit("roomMessage", newMessage);

        // Update rooms and send them to the client
        const chatRooms = await ChatRoom.find();
        const rooms = chatRooms.map((room) => ({
          id: room._id,
          name: room.name,
          messages: room.messages,
        }));
        socket.emit("roomsList", rooms);
        socket.emit("foundRoom", room.messages);
      }
    } catch (err) {
      console.error("Error handling new message:", err);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

// API endpoint to fetch all chat rooms
app.get("/message", async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find(); // Fetch all rooms
    const rooms = chatRooms.map((room) => ({
      id: room._id,
      name: room.name,
      messages: room.messages,
    }));
    res.json(rooms); // Send the modified response
  } catch (err) {
    console.error("Error fetching chat rooms:", err);
    res.status(500).json({ error: "Error fetching chat rooms" });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
