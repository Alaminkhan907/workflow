const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const Task = require("./model");

const app = express();
const port = process.env.PORT || 3000;

// Middleware configuration
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection using mongoose
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/workflow", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Successfully connected to MongoDB");
});

// Test route
app.get("/", (req, res) => {
  res.send("Hello World from Node.js & MongoDB!");
});

app.post("/addtask", (req, res) => {
  if (!req.body) {
    return res.status(400).send({ error: "Request body cannot be empty." });
  }

  const newTask = new Task({
    name: req.body.name,
    dueDate: req.body.dueDate,
    description: req.body.description,
    status: req.body.status,
    assignee: req.body.assignee,
  });

  newTask.save((err, task) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(task);
  });
});

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
app.put("/edittask/:id", (req, res) => {
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
app.delete("/deletetask/:id", (req, res) => {
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
