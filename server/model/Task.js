const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["To-Do", "In Progress", "Under Review", "Completed"],
    required: true,
  },
  priority: { type: String, enum: ["Low", "Medium", "Urgent"] },
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
