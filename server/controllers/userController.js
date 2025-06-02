const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create guest user
exports.createGuestUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    // Create guest user
    const user = new User({
      name: name || 'Guest User',
      avatar,
      role: 'guest',
      isGuest: true
    });

    await user.save();

    // Create temporary token
    const token = jwt.sign(
      { userId: user._id, isGuest: true },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isGuest: true
      }
    });
  } catch (error) {
    console.error('Create guest user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register new user (optional)
exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Check if user already exists
    if (email) {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      avatar,
      role: 'user',
      isGuest: false
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, isGuest: false },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isGuest: false
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user (optional)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, isGuest: false },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Update user status
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isGuest: false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user status
exports.updateUserStatus = async (userId, isOnline) => {
  try {
    await User.findByIdAndUpdate(userId, {
      isOnline,
      lastSeen: new Date()
    });
  } catch (error) {
    console.error('Update user status error:', error);
  }
}; 