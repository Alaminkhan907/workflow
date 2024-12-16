const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
mongoose.set("strictQuery", true);

const Project = require("./projectModel");
const Task = require("./taskModel");
const User = require("./userModel");

//new from here
const app = express();
const http = require("http").Server(app);
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:8081",
  },
});
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// app.use(
//   cors({
//     origin: "*",
//   })
// );
app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/workflow", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//new from here
const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("createRoom", (name) => {
    socket.join(name);
    chatRooms.unshift({ id: generateID(), name, messages: [] });
    socket.emit("roomsList", chatRooms);
  });

  socket.on("findRoom", (id) => {
    let result = chatRooms.filter((room) => room.id == id);
    // console.log(chatRooms);
    socket.emit("foundRoom", result[0].messages);
    // console.log("Messages Form", result[0].messages);
  });

  socket.on("newMessage", (data) => {
    const { room_id, message, user, timestamp } = data;
    let result = chatRooms.filter((room) => room.id == room_id);
    const newMessage = {
      id: generateID(),
      text: message,
      user,
      time: `${timestamp.hour}:${timestamp.mins}`,
    };
    console.log("New Message", newMessage);
    socket.to(result[0].name).emit("roomMessage", newMessage);
    result[0].messages.push(newMessage);

    socket.emit("roomsList", chatRooms);
    socket.emit("foundRoom", result[0].messages);
  });
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

app.get("/api", (req, res) => {
  res.json(chatRooms);
});

// Test route
app.get("/", (req, res) => {
  res.send("Hello World from Node.js & MongoDB!");
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
  const { projectId, taskName, dueDate, description, assignee, priority } = req.body;

  console.log("Request Body:", req.body);

  try {
    const newTask = new Task({
      projectId,
      taskName,
      dueDate,
      description,
      assignee,
      priority,
    });

    const savedTask = await newTask.save();
    res.status(201).send(savedTask);
  } catch (err) {
    console.error("Error Saving Task:", err);
    res.status(500).send({ error: err.message });
  }
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

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
