const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middleware/auth");
const User = require('../models/User');

// Get current user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.user.uid);
    const dbUser = await User.findOne({ firebaseUid: user.uid });
    
    res.json({
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        ...(dbUser && { 
          phone: dbUser.phone,
          bio: dbUser.bio,
          role: dbUser.role
        })
      }
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ 
      success: false,
      message: "Error getting user information",
      error: error.message 
    });
  }
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { displayName, photoURL, phone, bio } = req.body;
    
    // Update Firebase user
    const user = await admin.auth().updateUser(req.user.uid, {
      displayName,
      photoURL,
    });

    // Update or create user in database
    const dbUser = await User.findOneAndUpdate(
      { firebaseUid: user.uid },
      { 
        name: displayName,
        email: user.email,
        photoURL,
        phone,
        bio
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phone: dbUser.phone,
        bio: dbUser.bio,
        role: dbUser.role
      }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ 
      success: false,
      message: "Error updating user profile",
      error: error.message 
    });
  }
});

// Delete user account
router.delete("/account", verifyToken, async (req, res) => {
  try {
    // Delete from Firebase
    await admin.auth().deleteUser(req.user.uid);
    
    // Delete from database
    await User.findOneAndDelete({ firebaseUid: req.user.uid });

    res.json({
      success: true,
      message: "User account deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting user account",
      error: error.message 
    });
  }
});

module.exports = router; 