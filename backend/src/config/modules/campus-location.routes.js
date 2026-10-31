
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const COLLECTION_NAME = 'campus_locations';

// GET /api/campus-locations
// GET /api/campus-locations?search=library
// GET /api/campus-locations?type=block
router.get('/', async (req, res) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected',
      });
    }

    const search = String(req.query.search || '')
      .trim()
      .toLowerCase();

    const type = String(req.query.type || '')
      .trim()
      .toLowerCase();

    const query = {};

    if (type) {
      query.locationType = {
        $regex: type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        $options: 'i',
      };
    }

    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

      query.$or = [
        { locationName: { $regex: escapedSearch, $options: 'i' } },
        { locationCode: { $regex: escapedSearch, $options: 'i' } },
        { blockName: { $regex: escapedSearch, $options: 'i' } },
        { blockCode: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
        { relativeLocation: { $regex: escapedSearch, $options: 'i' } },
        { knownFacilities: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const data = await db
      .collection(COLLECTION_NAME)
      .find(query)
      .sort({ locationName: 1 })
      .limit(200)
      .toArray();

    return res.status(200).json({
      success: true,
      count: data.length,
      data: data.map((location) => ({
        ...location,
        _id: String(location._id),
      })),
    });
  } catch (error) {
    console.error('Campus locations API error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch campus locations',
    });
  }
});

// GET /api/campus-locations/:locationId
router.get('/:locationId', async (req, res) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected',
      });
    }

    const location = await db
      .collection(COLLECTION_NAME)
      .findOne({ locationId: req.params.locationId });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Campus location not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...location,
        _id: String(location._id),
      },
    });
  } catch (error) {
    console.error('Campus location details API error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch campus location details',
    });
  }
});

module.exports = router;
