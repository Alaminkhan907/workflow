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
    required: true,
  },
  description: String,
  assignee: String,
});

module.exports = mongoose.model("task", TaskSchema);
