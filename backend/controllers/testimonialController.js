const Testimonial = require("../models/Testimonial");

// Get public testimonials (approved and active)
const getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      isApproved: true,
      isActive: true,
    }).sort({ approvedAt: -1 });

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Error fetching public testimonials:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching testimonials",
    });
  }
};

// Get user testimonials (for authenticated users)
const getUserTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      submittedBy: req.user.email,
    }).sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Error fetching user testimonials:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user testimonials",
    });
  }
};

// Submit new testimonial
const submitTestimonial = async (req, res) => {
  try {
    const { clientName, rating, testimonial, clientPosition, company } = req.body;

    const clientImage = req.file ? req.file.path : null;

    const newTestimonial = new Testimonial({
      clientName,
      clientImage,
      rating,
      testimonial,
      clientPosition,
      company,
      submittedBy: req.body.email || "anonymous",
    });

    await newTestimonial.save();

    res.status(201).json({
      success: true,
      message: "Testimonial submitted successfully",
      data: newTestimonial,
    });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting testimonial",
    });
  }
};

// Get all testimonials (admin only)
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Error fetching all testimonials:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching testimonials",
    });
  }
};

// Update testimonial status (admin only)
const updateTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, isActive } = req.body;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    if (isApproved !== undefined) {
      testimonial.isApproved = isApproved;
      if (isApproved) {
        testimonial.approvedAt = new Date();
        testimonial.approvedBy = req.user.email;
      }
    }

    if (isActive !== undefined) {
      testimonial.isActive = isActive;
    }

    await testimonial.save();

    res.json({
      success: true,
      message: "Testimonial status updated successfully",
      data: testimonial,
    });
  } catch (error) {
    console.error("Error updating testimonial status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating testimonial status",
    });
  }
};

// Update testimonial (user or admin)
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Check if user owns this testimonial or is admin
    if (testimonial.submittedBy !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this testimonial",
      });
    }

    Object.assign(testimonial, req.body);
    await testimonial.save();

    res.json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Error updating testimonial",
    });
  }
};

// Delete testimonial (user or admin)
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Check if user owns this testimonial or is admin
    if (testimonial.submittedBy !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this testimonial",
      });
    }

    await testimonial.deleteOne();

    res.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting testimonial",
    });
  }
};

module.exports = {
  getPublicTestimonials,
  getUserTestimonials,
  submitTestimonial,
  getAllTestimonials,
  updateTestimonialStatus,
  updateTestimonial,
  deleteTestimonial,
};
