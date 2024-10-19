const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
  dueDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
  },
  assignee: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
