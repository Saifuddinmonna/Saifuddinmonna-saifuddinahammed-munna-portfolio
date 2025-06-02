const Testimonial = require("../models/Testimonial");

// Get all approved testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: "approved" })
      .sort({ date: -1 })
      .select("-__v");

    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ message: "Error fetching testimonials" });
  }
};

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, company, image, rating, text, services } = req.body;

    // Validate required fields
    if (!name || !role || !company || !rating || !text || !services) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const testimonial = new Testimonial({
      name,
      role,
      company,
      image,
      rating,
      text,
      services,
      status: "pending", // New testimonials are pending by default
    });

    await testimonial.save();
    res.status(201).json({ message: "Testimonial submitted successfully", testimonial });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ message: "Error creating testimonial" });
  }
};

// Get pending testimonials (admin only)
exports.getPendingTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Error fetching pending testimonials:", error);
    res.status(500).json({ message: "Error fetching pending testimonials" });
  }
};

// Update testimonial status (admin only)
exports.updateTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(id, { status }, { new: true }).select(
      "-__v"
    );

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({ message: "Testimonial status updated", testimonial });
  } catch (error) {
    console.error("Error updating testimonial status:", error);
    res.status(500).json({ message: "Error updating testimonial status" });
  }
};

// Delete testimonial (admin only)
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ message: "Error deleting testimonial" });
  }
};
