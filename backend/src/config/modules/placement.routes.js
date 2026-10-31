
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// GET /api/placements
router.get("/", async (req, res, next) => {
  try {
    const placements = await mongoose.connection.db
      .collection("placements")
      .find({})
      .sort({ deadline: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: placements.length,
      data: placements,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
