const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const verifyToken = require("../middleware/auth");

// Get all testimonials
router.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ message: "Error fetching testimonials" });
  }
});

// Get single testimonial
router.get("/testimonials/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    res.status(500).json({ message: "Error fetching testimonial" });
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
    res.status(201).json(testimonial);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ message: "Error creating testimonial" });
  }
});

// Update testimonial (protected route)
router.put("/testimonials/:id", verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Check if user is authorized to update
    if (testimonial.createdBy !== req.user.uid) {
      return res.status(403).json({ message: "Not authorized to update this testimonial" });
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTestimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({ message: "Error updating testimonial" });
  }
});

// Delete testimonial (protected route)
router.delete("/testimonials/:id", verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Check if user is authorized to delete
    if (testimonial.createdBy !== req.user.uid) {
      return res.status(403).json({ message: "Not authorized to delete this testimonial" });
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ message: "Error deleting testimonial" });
  }
});

module.exports = router;
