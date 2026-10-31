
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// GET /api/events
// MongoDB se events fetch karega.
router.get("/", async (req, res, next) => {
  try {
    const events = await mongoose.connection.db
      .collection("events")
      .find({})
      .toArray();

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
