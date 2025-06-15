const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middlewares/auth");
const User = require('../models/User');

// Register new user (no token required)
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone, photoURL, bio, firebaseUid } = req.body;

    // Log the request body
    console.log('Registration Request Body:', {
      email,
      password: password ? '******' : undefined,
      name,
      phone,
      photoURL,
      bio,
      firebaseUid
    });

    // Detailed input validation
    const validationErrors = [];
    
    if (!email) {
      validationErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push('Invalid email format');
    }

    if (!name) {
      validationErrors.push('Name is required');
    } else if (name.length < 2) {
      validationErrors.push('Name must be at least 2 characters');
    }

    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    // Check if user exists in database first
    const existingDbUser = await User.findOne({ email });
    if (existingDbUser) {
      console.log('User already exists in database:', email);
      return res.status(400).json({
        success: false,
        message: "This email is already registered in database"
      });
    }

    try {
      let userRecord;
      
      // If firebaseUid is provided, use it (user already created in Firebase)
      if (firebaseUid) {
        try {
          userRecord = await admin.auth().getUser(firebaseUid);
          console.log('Using existing Firebase user:', userRecord.uid);
        } catch (error) {
          console.error('Error getting Firebase user:', error);
          return res.status(400).json({
            success: false,
            message: "Invalid Firebase user ID",
            error: error.message
          });
        }
      } else {
        // Create new user in Firebase if no firebaseUid provided
        try {
          userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
            photoURL
          });
          console.log('Firebase user created successfully:', userRecord.uid);
        } catch (error) {
          console.error('Error creating Firebase user:', error);
          if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({
              success: false,
              message: "This email is already registered in Firebase"
            });
          }
          throw error;
        }
      }

      // Create user in database
      try {
        const user = await User.create({
          firebaseUid: userRecord.uid,
          name,
          email,
          phone,
          photoURL,
          bio,
          role: 'user'
        });
        console.log('Database user created successfully:', user._id);

        res.status(201).json({
          success: true,
          data: {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL,
            phone: user.phone,
            bio: user.bio,
            role: user.role
          }
        });
      } catch (dbError) {
        console.error('Error creating database user:', dbError);
        // If database creation fails, try to clean up Firebase user
        if (!firebaseUid) {
          try {
            await admin.auth().deleteUser(userRecord.uid);
            console.log('Cleaned up Firebase user after database error');
          } catch (cleanupError) {
            console.error('Error cleaning up Firebase user:', cleanupError);
          }
        }
        throw dbError;
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/invalid-email') {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      } else if (error.code === 'auth/weak-password') {
        return res.status(400).json({
          success: false,
          message: "Password should be at least 6 characters"
        });
      } else if (error.code === 'auth/user-not-found') {
        return res.status(404).json({
          success: false,
          message: "Firebase user not found"
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "Error creating user account",
        error: error.message
      });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ 
      success: false,
      message: "Error registering user",
      error: error.message 
    });
  }
});

// Get current user (requires token)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.user.uid);
    const dbUser = await User.findOne({ firebaseUid: user.uid });
    
    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found in database"
      });
    }

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

// Delete user account (requires token)
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