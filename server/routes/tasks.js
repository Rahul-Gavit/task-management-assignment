// routes/tasks.js
const express = require("express");
const Task = require("../model/Task");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();
const secretKey = process.env.JWT_SECRET; // Replace with a secure key

// Middleware to verify token
function authenticateToken(req, res, next) {
  console.log("Cookies:", req.cookies); // Debugging statement

  const token = req.cookies.authToken;

  if (!token) {
    console.error("Token is missing from cookies.");
    return res.sendStatus(401); // Token is missing
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.sendStatus(403); // Token is invalid
    }
    req.user = user;
    console.log("Token verified, user:", user);
    next();
  });
}

// Create a task
router.post("/", authenticateToken, async (req, res) => {
  const { title, description, status, priority, deadline } = req.body;
  try {
    const task = new Task({
      userId: req.user.userId,
      title,
      description,
      status,
      priority,
      deadline,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks for a user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, deadline } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { title, description, status, priority, deadline, updatedAt: Date.now() },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Task.deleteOne({ _id: id, userId: req.user.userId });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
