const express = require("express");
const {
  getPublicTestimonials,
  getUserTestimonials,
  submitTestimonial,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
  updateTestimonial,
} = require("../controllers/testimonialController");
const { uploadSingle } = require("../middlewares/multer");
const { verifyToken, isAdmin } = require("../middlewares/auth");
const Testimonial = require("../models/Testimonial");

const router = express.Router();

// Public routes (no auth required)
router.get("/public", getPublicTestimonials);
router.post("/", uploadSingle("clientImageFile"), submitTestimonial);

// Get all testimonials (public)
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get single testimonial (public)
router.get("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }
    res.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// User routes (requires auth)
router.get("/user", verifyToken, getUserTestimonials);

// Admin routes (requires admin auth)
router.get("/admin/all", verifyToken, isAdmin, getAllTestimonials);
router.patch("/admin/:id/status", verifyToken, isAdmin, updateTestimonialStatus);
router.delete("/admin/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }
    await testimonial.deleteOne();
    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully by admin",
    });
  } catch (error) {
    console.error("Error in admin delete testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting testimonial",
      error: error.message,
    });
  }
});

// Protected routes (requires auth)
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }
    Object.assign(testimonial, req.body);
    await testimonial.save();
    res.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }
    await testimonial.deleteOne();
    res.json({
      success: true,
      message: "Testimonial deleted",
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Error handling middleware for this router
router.use((err, req, res, next) => {
  console.error("Testimonial route error:", err);
  res.status(500).json({
    success: false,
    message: "Error in testimonial route",
    error: err.message,
  });
});

module.exports = router;
