const express = require("express");
const router = express.Router();
const User = require("./User");
const { verifyToken } = require("./auth");
const admin = require("firebase-admin");

// Get single user by ID
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user from database
    const dbUser = await User.findOne({ firebaseUid: userId });
    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
      });
    }

    // Get user from Firebase
    const firebaseUser = await admin.auth().getUser(userId);

    res.json({
      success: true,
      data: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        phone: dbUser.phone,
        bio: dbUser.bio,
        role: dbUser.role,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
});

// Get user profile (requires token)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const [firebaseUser, dbUser] = await Promise.all([
      admin.auth().getUser(req.user.uid),
      User.findOne({ firebaseUid: req.user.uid }),
    ]);

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        phone: dbUser.phone,
        bio: dbUser.bio,
        role: dbUser.role,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
});

// Update user profile (requires token)
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, photoURL, bio } = req.body;

    // Update Firebase user
    await admin.auth().updateUser(req.user.uid, {
      displayName: name,
      photoURL,
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
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        uid: req.user.uid,
        email: user.email,
        displayName: user.name,
        photoURL: user.photoURL,
        phone: user.phone,
        bio: user.bio,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error.message,
    });
  }
});

module.exports = router;
