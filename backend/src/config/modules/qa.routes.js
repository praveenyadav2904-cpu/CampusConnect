
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/qa
// Fetch QA records from the existing MongoDB collection
router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected",
      });
    }

    console.log("QA route database:", db.databaseName);

    const search = String(req.query.search || "").trim();
    const category = String(req.query.category || "").trim();

    const filter = {};

    if (category) {
      filter.category = {
        $regex: escapeRegex(category),
        $options: "i",
      };
    }

    if (search) {
      const escapedSearch = escapeRegex(search);

      filter.$or = [
        { question: { $regex: escapedSearch, $options: "i" } },
        { answer: { $regex: escapedSearch, $options: "i" } },
        { keywords: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const collection = db.collection("qa");
    const total = await collection.countDocuments();

    console.log("QA collection total documents:", total);

    const data = await collection
      .find(filter)
      .limit(50)
      .toArray();

    return res.status(200).json({
      success: true,
      count: data.length,
      total,
      data,
    });
  } catch (error) {
    console.error("QA API error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch QA records",
    });
  }
});

module.exports = router;
