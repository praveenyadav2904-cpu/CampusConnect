
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const noticesCollection = () => {
  if (!mongoose.connection.db) {
    throw new Error('MongoDB is not connected.');
  }

  return mongoose.connection.db.collection('notices');
};

// GET /api/notices
// Students and other users can fetch published notices.
// Admin can use ?includePending=true to review pending notices.
router.get('/', async (req, res, next) => {
  try {
    const role = req.headers['x-demo-role'];
    const includePending =
      role === 'admin' &&
      req.query.includePending === 'true';

    const filter = includePending
      ? {}
      : { status: { $nin: ['Pending Approval'] } };

    const notices = await noticesCollection()
      .find(filter)
      .sort({ isPinned: -1, publishDate: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/notices
// Create a notice in MongoDB.
router.post('/', async (req, res, next) => {
  try {
    const role = req.headers['x-demo-role'];
    const userId = req.headers['x-demo-user'];

    if (!['faculty', 'admin'].includes(role) || !userId) {
      return res.status(403).json({
        success: false,
        message: 'Only faculty and admin can create notices.',
      });
    }

    const {
      title,
      description,
      category = 'General',
      priority = 'Normal',
      scope = 'academic',
    } = req.body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof description !== 'string' ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required.',
      });
    }

    if (!['Normal', 'High', 'Urgent'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notice priority.',
      });
    }

    if (!['academic', 'official'].includes(scope)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notice type.',
      });
    }

    const needsApproval = scope === 'official' && role !== 'admin';

    const notice = {
      title: title.trim(),
      description: description.trim(),
      category:
        typeof category === 'string' && category.trim()
          ? category.trim()
          : 'General',
      priority,
      scope,
      status: needsApproval ? 'Pending Approval' : 'Published',
      authorId: userId,
      publishDate: new Date(),
      isPinned: false,
    };

    const result = await noticesCollection().insertOne(notice);

    res.status(201).json({
      success: true,
      message: needsApproval
        ? 'Notice submitted for admin approval.'
        : 'Notice saved successfully.',
      data: {
        ...notice,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/notices/:id/approve
// Admin approves an official notice.
router.patch('/:id/approve', async (req, res, next) => {
  try {
    const role = req.headers['x-demo-role'];

    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can approve official notices.',
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notice ID.',
      });
    }

    const result = await noticesCollection().updateOne(
      {
        _id: new mongoose.Types.ObjectId(req.params.id),
        status: 'Pending Approval',
      },
      {
        $set: {
          status: 'Published',
          approvedAt: new Date(),
          approvedBy: req.headers['x-demo-user'] || 'admin',
        },
      }
    );

    if (!result.matchedCount) {
      return res.status(404).json({
        success: false,
        message: 'Pending notice not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice approved and published.',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
