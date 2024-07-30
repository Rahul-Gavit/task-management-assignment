const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Mongo connection error:", error.message);
  }
};

module.exports = connectDB;
