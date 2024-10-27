const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Task = require("./model");
const User = require("./userModel");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use(express.json());

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

// Protected Task Route
app.post("/addtask", protect, (req, res) => {
  const { name, dueDate, description, status, assignee } = req.body;

  const newTask = new Task({ name, dueDate, description, status, assignee });

  newTask.save((err, task) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(task);
  });
});

// app.post("/addtask", protect,(req, res) => {
//   if (!req.body) {
//     return res.status(400).send({ error: "Request body cannot be empty." });
//   }

//   const newTask = new Task({
//     name: req.body.name,
//     dueDate: req.body.dueDate,
//     description: req.body.description,
//     status: req.body.status,
//     assignee: req.body.assignee,
//   });

//   newTask.save((err, task) => {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     res.status(201).send(task);
//   });
// });

app.get("/gettask", (req, res) => {
  Task.find({}, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
});

// Route to find task by ID
app.get("/gettask/:id", (req, res) => {
  Task.findById(req.params.id, (err, task) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.status(200).json(task);
  });
});

// Route to find task by name
// app.get("/gettask/:name", (req, res) => {
//   Task.findOne({ name: req.params.name }, (err, task) => {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     if (!task) {
//       return res.status(404).send("Task not found");
//     }
//     res.status(200).json(task);
//   });
// });

// Route to edit a task
app.put("/edittask/:id", protect, (req, res) => {
  Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
    (err, task) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!task) {
        return res.status(404).send("Task not found");
      }
      res.status(200).json(task);
    }
  );
});

// Route to delete a task
app.delete("/deletetask/:id", protect, (req, res) => {
  Task.findByIdAndDelete(req.params.id, (err, task) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.status(200).send("Task deleted successfully");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
