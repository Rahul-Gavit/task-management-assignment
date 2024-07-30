const express = require("express");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser()); // Add cookie-parser middleware

// CORS Middleware
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  credentials: true,
};
app.use(cors(corsOptions));

// Define routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
