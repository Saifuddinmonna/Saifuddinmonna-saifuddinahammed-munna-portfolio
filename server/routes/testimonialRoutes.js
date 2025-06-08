const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const { verifyToken } = require("../middleware/auth");

// Get all testimonials
router.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching testimonials",
      error: error.message 
    });
  }
});

// Get single testimonial
router.get("/testimonials/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: "Testimonial not found" 
      });
    }
    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching testimonial",
      error: error.message 
    });
  }
});

// Create testimonial (protected route)
router.post("/testimonials", verifyToken, async (req, res) => {
  try {
    const { name, position, company, content, rating, image } = req.body;
    const testimonial = new Testimonial({
      name,
      position,
      company,
      content,
      rating,
      image,
      createdBy: req.user.uid
    });
    await testimonial.save();
    res.status(201).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ 
      success: false,
      message: "Error creating testimonial",
      error: error.message 
    });
  }
});

// Update testimonial (protected route)
router.put("/testimonials/:id", verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: "Testimonial not found" 
      });
    }

    // Check if user is authorized to update
    if (testimonial.createdBy !== req.user.uid) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized to update this testimonial" 
      });
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({
      success: true,
      data: updatedTestimonial
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({ 
      success: false,
      message: "Error updating testimonial",
      error: error.message 
    });
  }
});

// Delete testimonial (protected route)
router.delete("/testimonials/:id", verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: "Testimonial not found" 
      });
    }

    // Check if user is authorized to delete
    if (testimonial.createdBy !== req.user.uid) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized to delete this testimonial" 
      });
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true,
      message: "Testimonial deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting testimonial",
      error: error.message 
    });
  }
});

module.exports = router;
