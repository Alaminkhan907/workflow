const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
mongoose.set("strictQuery", true);

const Project = require("./projectModel");
const User = require("./userModel");
const Task = require("./taskModel");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use(express.json());

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

// Protected project Route
app.post("/addProject", (req, res) => {
  const { name, dueDate, description, status, assignee } = req.body;

  const newProject = new Project({ name, dueDate, description, status, assignee });

  newProject.save((err, project) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(project);
  });
});

app.get("/getProject", (req, res) => {
  Project.find({}, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
});

// Route to find project by ID
app.get("/getProject/:id", (req, res) => {
  Project.findById(req.params.id, (err, project) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!project) {
      return res.status(404).send("Project not found");
    }
    res.status(200).json(project);
  });
});

// Route to edit a project
app.put("/editProject/:id", (req, res) => {
  Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
    (err, project) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!project) {
        return res.status(404).send("Project not found");
      }
      res.status(200).json(project);
    }
  );
});

// Route to delete a project
app.delete("/deleteProject/:id", (req, res) => {
  Project.findByIdAndDelete(req.params.id, (err, project) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!project) {
      return res.status(404).send("Project not found");
    }
    res.status(200).send("Project deleted successfully");
  });
});

// Protected task Route
app.post("/addTask", (req, res) => {
  const { name, dueDate, description, status, assignee, urgent, project } = req.body;
  var project_id = mongoose.Types.ObjectId(project);
  const newTask = new Task({ name, dueDate, description, status, assignee, urgent, project_id });

  newTask.save((err, task) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(task);
  });
});

app.get("/getTask", (req, res) => {
  Task.find({}, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(result);
  });
});

// Route to find task by ID
app.get("/getTask/:id", (req, res) => {
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

app.get("/getTasksByProject/:id", (req, res) => {
  const propertyId = req.params.id;
  const id = mongoose.Types.ObjectId(propertyId);

  Task.find({ project: id }, (err, tasks) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!tasks) {
      return res.status(400).send("Project ID is required");
    }
    res.status(200).json(tasks);
  });
});

// Route to edit a task
app.put("/editTask/:id", (req, res) => {
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
app.delete("/deleteTask/:id", (req, res) => {
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

// Conditional MongoDB Connection and Server Initialization
// for testing
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB");
  });

  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

module.exports = app;
