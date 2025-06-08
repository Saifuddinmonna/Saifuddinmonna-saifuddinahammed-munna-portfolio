const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const admin = require('firebase-admin');

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const [firebaseUser, dbUser] = await Promise.all([
      admin.auth().getUser(req.user.uid),
      User.findOne({ firebaseUid: req.user.uid })
    ]);

    if (!dbUser) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: {
        ...dbUser.toJSON(),
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user profile',
      error: error.message 
    });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, phone, photoURL, bio } = req.body;

    // Update Firebase user
    await admin.auth().updateUser(req.user.uid, {
      displayName: name,
      photoURL
    });

    // Update database user
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { name, email, phone, photoURL, bio },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating user profile',
      error: error.message 
    });
  }
});

// Create or update user
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, email, phone, photoURL, bio } = req.body;
    
    // Update Firebase user
    await admin.auth().updateUser(req.user.uid, {
      displayName: name,
      photoURL
    });
    
    // Update or create database user
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { 
        name,
        email,
        phone,
        photoURL,
        bio
      },
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    );
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating/updating user',
      error: error.message 
    });
  }
});

// Delete user
router.delete('/', verifyToken, async (req, res) => {
  try {
    // Delete from Firebase
    await admin.auth().deleteUser(req.user.uid);
    
    // Delete from database
    const user = await User.findOneAndDelete({ firebaseUid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting user',
      error: error.message 
    });
  }
});

module.exports = router; 