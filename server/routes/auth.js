const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require("../middleware/auth");
const User = require('../models/User');

// Register new user (no token required)
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone, photoURL, bio } = req.body;

    // Log the request body
    console.log('Registration Request Body:', {
      email,
      password: password ? '******' : undefined,
      name,
      phone,
      photoURL,
      bio
    });

    // Detailed input validation
    const validationErrors = [];
    
    if (!email) {
      validationErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push('Invalid email format');
    }

    if (!password) {
      validationErrors.push('Password is required');
    } else if (password.length < 6) {
      validationErrors.push('Password must be at least 6 characters');
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
      // Create user in Firebase
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name,
        photoURL
      });
      console.log('Firebase user created successfully:', userRecord.uid);

      // Create user in database
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
    } catch (firebaseError) {
      console.error('Firebase/Database creation error:', firebaseError);
      
      // If Firebase user creation fails, try to clean up
      if (firebaseError.code === 'auth/email-already-exists') {
        // Try to get the existing user
        try {
          const existingUser = await admin.auth().getUserByEmail(email);
          console.log('Found existing Firebase user:', existingUser.uid);
          
          // Check if this user exists in our database
          const dbUser = await User.findOne({ firebaseUid: existingUser.uid });
          if (!dbUser) {
            // User exists in Firebase but not in our database
            // Create the database entry
            const newUser = await User.create({
              firebaseUid: existingUser.uid,
              name,
              email,
              phone,
              photoURL,
              bio,
              role: 'user'
            });
            console.log('Created database entry for existing Firebase user:', newUser._id);
            
            return res.status(201).json({
              success: true,
              data: {
                uid: existingUser.uid,
                email: existingUser.email,
                displayName: existingUser.displayName,
                photoURL: existingUser.photoURL,
                phone: newUser.phone,
                bio: newUser.bio,
                role: newUser.role
              }
            });
          }
        } catch (error) {
          console.error('Error handling existing Firebase user:', error);
        }
      }
      
      // Handle other Firebase errors
      if (firebaseError.code === 'auth/invalid-email') {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      } else if (firebaseError.code === 'auth/weak-password') {
        return res.status(400).json({
          success: false,
          message: "Password should be at least 6 characters"
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "Error creating user account",
        error: firebaseError.message
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