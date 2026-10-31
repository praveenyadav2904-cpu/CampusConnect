
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// GET /api/library
router.get("/", async (req, res, next) => {
  try {
    const books = await mongoose.connection.db
      .collection("library")
      .find({})
      .sort({ title: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
