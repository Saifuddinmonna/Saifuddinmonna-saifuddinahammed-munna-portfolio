const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const PrivateMessage = require('../PrivateMessage');

// Get private message history between two users
router.get("/history/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.uid;
    const { page = 1, limit = 50 } = req.query;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Find messages between the two users
    const messages = await PrivateMessage.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ],
      deleted: false
    })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

    // Get total count for pagination
    const total = await PrivateMessage.countDocuments({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ],
      deleted: false
    });

    // Mark unread messages as read
    await PrivateMessage.updateMany(
      {
        senderId: userId,
        receiverId: currentUserId,
        read: false
      },
      {
        $set: { read: true, readAt: new Date() }
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse to get chronological order
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error("Error fetching message history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching message history",
      error: error.message
    });
  }
});

// Get unread message count
router.get("/unread/count", verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.uid;

    const unreadCount = await PrivateMessage.countDocuments({
      receiverId: currentUserId,
      read: false,
      deleted: false
    });

    res.json({
      success: true,
      data: {
        unreadCount
      }
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching unread count",
      error: error.message
    });
  }
});

module.exports = router;