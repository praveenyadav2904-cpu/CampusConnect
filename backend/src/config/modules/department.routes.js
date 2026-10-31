
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const departments = await mongoose.connection.db
      .collection("departments")
      .find({})
      .toArray();

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
