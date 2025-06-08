const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create or update user
exports.createOrUpdateUser = async (req, res) => {
  try {
    const { uid, name, email, phoneNumber, whatsapp, photo } = req.body;

    // Check if user already exists
    let user = await User.findOne({ uid });

    // Handle photo upload if provided
    let photoData = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_photos',
        width: 300,
        crop: "scale"
      });
      photoData = {
        url: result.secure_url,
        publicId: result.public_id
      };
    } else if (photo && photo.url) {
      photoData = photo;
    }

    if (user) {
      // Update existing user
      const updateData = {
        name,
        email,
        phoneNumber: phoneNumber || user.phoneNumber,
        whatsapp: whatsapp || user.whatsapp,
      };

      if (photoData) {
        // Delete old photo if exists
        if (user.photo && user.photo.publicId) {
          await cloudinary.uploader.destroy(user.photo.publicId);
        }
        updateData.photo = photoData;
      }

      user = await User.findOneAndUpdate(
        { uid },
        updateData,
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user
      });
    }

    // Create new user
    user = await User.create({
      uid,
      name,
      email,
      phoneNumber,
      whatsapp,
      photo: photoData
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating/updating user',
      error: error.message
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
}; 