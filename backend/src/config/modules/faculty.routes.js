
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// GET /api/faculty
router.get("/", async (req, res, next) => {
  try {
    const faculty = await mongoose.connection.db
      .collection("faculty")
      .find({})
      .toArray();

    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
