const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: false,
  },
  description: String,
  assignee: String,
  priority: {
    type: String,
    enum: ["p1", "p2", "p3", "p4"],
    default: "p4",
  },
});

module.exports = mongoose.model("task", TaskSchema);
