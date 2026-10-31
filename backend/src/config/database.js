
const mongoose = require("mongoose");

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MONGODB_URI is missing in backend/.env");
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully!");
    console.log("Connected database:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB error name:", error.name);
    console.error("MongoDB error message:", error.message);
    throw error;
  }
}

module.exports = connectDB;
