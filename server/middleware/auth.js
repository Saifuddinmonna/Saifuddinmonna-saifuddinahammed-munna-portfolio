const jwt = require("jsonwebtoken");
const User = require("../models/User");
const admin = require("firebase-admin");
require("dotenv").config();
const path = require('path');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccount = {
    "type": process.env.FIREBASE_TYPE || "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
    "token_uri": process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL,
    "universe_domain": "googleapis.com"
  };

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    process.exit(1);
  }
}

// Middleware to verify token (both Firebase and regular JWT)
const verifyToken = async (req, res, next) => {
  try {
    console.log('=== Auth Middleware ===');
    console.log('Headers:', req.headers);

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No authorization header found');
      return res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log('No token found in authorization header');
      return res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
    }

    try {
      // Try Firebase token first
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('Firebase token verified:', decodedToken);
      
      // Find or create user in MongoDB
      let user = await User.findOne({ firebaseUid: decodedToken.uid });
      
      if (!user) {
        // Create new user if doesn't exist
        user = new User({
          firebaseUid: decodedToken.uid,
          name: decodedToken.name || decodedToken.email.split('@')[0],
          email: decodedToken.email,
          role: 'user'
        });
        await user.save();
        console.log('New user created:', user);
      }

      // Attach user info to request
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: user.name,
        role: user.role
      };
      
      next();
    } catch (firebaseError) {
      console.log('Firebase token verification failed, trying JWT');
      
      // If Firebase token fails, try JWT
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
          console.log('User not found for JWT token');
          return res.status(401).json({ 
            success: false,
            message: "User not found" 
          });
        }

        req.user = {
          uid: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        };
        
        next();
      } catch (jwtError) {
        console.error('JWT verification failed:', jwtError);
        return res.status(401).json({ 
          success: false,
          message: "Invalid token",
          error: jwtError.message 
        });
      }
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ 
      success: false,
      message: "Authentication failed",
      error: error.message 
    });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Not authenticated" 
      });
    }

    if (req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized as admin" 
      });
    }
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};
