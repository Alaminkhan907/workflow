const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Project = require("./projectModel");
const Task = require("./taskModel");
const User = require("./userModel");
const ChatRoom = require("./chatRoomModel");

const app = express();
const server = http.Server(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Environment variables
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// MongoDB connection
mongoose.connect("mongodb://mongo:27017/workflow", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});


// Helper to generate random IDs
const generateID = () => Math.random().toString(36).substring(2, 10);

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // Create a new chat room
  socket.on("createRoom", async (name) => {
    try {
      const room = new ChatRoom({ name, messages: [] });
      await room.save();
      const chatRooms = await ChatRoom.find();
      io.emit("roomsList", chatRooms);
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

        room.messages.push(newMessage);
        await room.save();

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

// Example Express APIs (for testing)
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});
// JWT Middleware
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).send({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).send({ error: "Not authorized, no token" });
  }
};

// Sign-up Route
app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send({ error: "User already exists" });
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(201).json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } else {
    return res.status(400).send({ error: "Invalid user data" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } else {
    return res.status(401).send({ error: "Invalid email or password" });
  }
});

// Profile Route
app.get("/profile", async (req, res) => {
  User.find({}, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
});

// Protected Project Route
app.post("/addProject", (req, res) => {
  const { name, dueDate, description, status, assignee } = req.body;

  const newProject = new Project({
    name,
    dueDate,
    description,
    status,
    assignee,
  });

  newProject.save((err, Project) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(Project);
  });
});

// Protected Project Route
app.get("/getProject", (req, res) => {
  Project.find({}, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
});

// Route to find Project by ID
app.get("/getProject/:id", (req, res) => {
  Project.findById(req.params.id, (err, Project) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!Project) {
      return res.status(404).send("Project not found");
    }
    res.status(200).json(Project);
  });
});

// Route to find Project by name
// app.get("/getProject/:name", (req, res) => {
//   Project.findOne({ name: req.params.name }, (err, Project) => {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     if (!Project) {
//       return res.status(404).send("Project not found");
//     }
//     res.status(200).json(Project);
//   });
// });

// Route to edit a Project
app.put("/editProject/:id", (req, res) => {
  Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
    (err, Project) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!Project) {
        return res.status(404).send("Project not found");
      }
      res.status(200).json(Project);
    }
  );
});

// Route to delete a Project
app.delete("/deleteProject/:id", (req, res) => {
  Project.findByIdAndDelete(req.params.id, (err, Project) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!Project) {
      return res.status(404).send("Project not found");
    }
    res.status(200).send("Project deleted successfully");
  });
});

// From down Project add with last Project showing

// app.post("/addTask", (req, res) => {
//   const { ProjectName, taskName, dueDate, description, assignee } = req.body;

//   const newTask = new Project({
//     ProjectName,
//     taskName,
//     dueDate,
//     description,
//     assignee,
//   });

//   newTask.save((err, Task) => {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     res.status(201).send(Task);
//   });
// });

// 3. Add a task
app.post("/addTask", async (req, res) => {
  const { projectId, taskName, dueDate, description, assignee , priority} = req.body;

  console.log("Request Body:", req.body);

   
    const newTask = new Task({
      projectId,
      taskName,
      dueDate,
      description,
      assignee,
      priority,
    });

  //   const savedTask = await newTask.save();
  //   res.status(201).send(savedTask);
  // } catch (err) {
  //   console.error("Error Saving Task:", err);
  //   res.status(500).send({ error: err.message });
  // }


  newTask.save((err, Task) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(Task);
  });


});

// Route to get tasks by project ID
app.get("/getTasksByProject/:projectId", async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.status(200).send(tasks);
  } catch (err) {
    console.error("Error Fetching Tasks:", err);
    res.status(500).send({ error: err.message });
  }
});

app.get("/getTask", (req, res) => {
  Task.find({}, (err, task) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(task);
  });
});
// app.get("/getTask/:id", (req, res) => {
//   Task.findById(req.params.id, (err, Task) => {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     if (!Task) {
//       return res.status(404).send("Project not found");
//     }
//     res.status(200).json(Task);
//   });
// });
// 4. Delete a task
app.delete("/deleteTasks/:taskId", async (req, res) => {
  try {
    const taskId = mongoose.Types.ObjectId(req.params.taskId);
    console.log(taskId);
    await Task.findByIdAndDelete(taskId);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

// Routes for Chat Rooms (as before)
app.get("/message", async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find();
    const rooms = chatRooms.map((room) => ({
      id: room._id,
      name: room.name,
      messages: room.messages,
    }));
    res.json(rooms);
  } catch (err) {
    console.error("Error fetching chat rooms:", err);
    res.status(500).json({ error: "Error fetching chat rooms" });
  }
});

app.post("/message", async (req, res) => {
  try {
    const { name, messages } = req.body;

    // Check if the name already exists
    const existingRoom = await ChatRoom.findOne({ name });
    if (existingRoom) {
      return res
        .status(400)
        .json({ error: "Chat room with this name already exists" });
    }

    // Create a new ChatRoom
    const chatRoom = new ChatRoom({ name, messages });
    await chatRoom.save();

    res
      .status(201)
      .json({ message: "Chat room created successfully", chatRoom });
  } catch (err) {
    console.error("Error creating chat room:", err);
    res.status(500).json({ error: "Error creating chat room" });
  }
});

// Start the server with Socket.IO
server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
