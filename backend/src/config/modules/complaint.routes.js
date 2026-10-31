
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const allowedCategories = [
  "Infrastructure",
  "Library",
  "Hostel",
  "Transport",
  "Academic",
  "Other",
];

 // GET /api/complaints
router.get("/", async (req, res, next) => {
  try {
    const complaints = await mongoose.connection.db
      .collection("complaints")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
});


// POST /api/complaints
router.post("/", async (req, res, next) => {
  try {
    const { subject, category, description } = req.body;

    if (
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject and description are required.",
      });
    }

    if (
      subject.trim().length > 100 ||
      description.trim().length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject or description exceeds the allowed length.",
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint category.",
      });
    }

    const complaint = {
      subject: subject.trim(),
      category,
      description: description.trim(),
      status: "Submitted",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await mongoose.connection.db
      .collection("complaints")
      .insertOne(complaint);

    res.status(201).json({
      success: true,
      message: "Complaint saved successfully.",
      data: {
        _id: result.insertedId,
        ...complaint,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
