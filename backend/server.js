const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const testimonialsRouter = require("./routes/testimonials");
const blogRouter = require("./routes/blogs");

// Use routes
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/blogs", blogRouter);

// Basic health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Get document counts for all collections
app.get("/api/stats", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const stats = {};

    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      stats[collection.name] = count;
    }

    res.json({
      success: true,
      message: "Collection statistics retrieved successfully",
      data: {
        totalCollections: collections.length,
        collections: stats,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error getting collection stats:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving collection statistics",
      error: error.message,
    });
  }
});

// Get all collections document counts (same as /api/stats but with different endpoint)
app.get("/api/stats/counts", async (req, res) => {
  try {
    console.log("📊 Getting all collection counts...");
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const stats = {};

    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      stats[collection.name] = count;
    }

    console.log("✅ Stats retrieved successfully:", stats);

    // Fix: Ensure consistent response structure
    const responseData = {
      success: true,
      message: "Statistics retrieved successfully",
      data: {
        totalCollections: collections.length,
        collections: stats,
        timestamp: new Date().toISOString(),
      },
    };

    console.log("📤 Sending response to frontend:", JSON.stringify(responseData, null, 2));

    // Set proper headers
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    res.json(responseData);
  } catch (error) {
    console.error("Error getting collection stats:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving collection statistics",
      error: error.message,
    });
  }
});

// Get simple counts (main collections only)
app.get("/api/stats/simple", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const mainCollections = ["blogs", "testimonials", "categories", "resumes", "users"];
    const stats = {};

    for (const collectionName of mainCollections) {
      try {
        const count = await db.collection(collectionName).countDocuments();
        stats[collectionName] = count;
      } catch (error) {
        // Collection doesn't exist, set to 0
        stats[collectionName] = 0;
      }
    }

    res.json({
      success: true,
      message: "Simple statistics retrieved successfully",
      data: {
        collections: stats,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error getting simple stats:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving simple statistics",
      error: error.message,
    });
  }
});

// Get detailed statistics with additional info
app.get("/api/stats/detailed", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const stats = {};
    let totalDocuments = 0;

    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      stats[collection.name] = count;
      totalDocuments += count;
    }

    res.json({
      success: true,
      message: "Detailed statistics retrieved successfully",
      data: {
        totalCollections: collections.length,
        totalDocuments,
        collections: stats,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error getting detailed stats:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving detailed statistics",
      error: error.message,
    });
  }
});

// Get real-time statistics
app.get("/api/stats/realtime", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const stats = {};
    let totalDocuments = 0;

    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      stats[collection.name] = count;
      totalDocuments += count;
    }

    res.json({
      success: true,
      message: "Real-time statistics retrieved successfully",
      data: {
        totalCollections: collections.length,
        totalDocuments,
        collections: stats,
        timestamp: new Date().toISOString(),
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error getting real-time stats:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving real-time statistics",
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
