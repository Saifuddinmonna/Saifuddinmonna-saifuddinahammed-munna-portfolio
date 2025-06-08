const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// Get user profile
router.get('/users/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/users/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, phone, photoURL, bio } = req.body;
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { name, email, phone, photoURL, bio },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

// Create or update user
router.post('/users', verifyToken, async (req, res) => {
  try {
    const { name, email, phone, photoURL, bio } = req.body;
    
    let user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (user) {
      // Update existing user
      user = await User.findOneAndUpdate(
        { firebaseUid: req.user.uid },
        { name, email, phone, photoURL, bio },
        { new: true }
      );
    } else {
      // Create new user
      user = new User({
        firebaseUid: req.user.uid,
        name,
        email,
        phone,
        photoURL,
        bio
      });
      await user.save();
    }
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ message: 'Error creating/updating user' });
  }
});

// Delete user
router.delete('/users', verifyToken, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router; 