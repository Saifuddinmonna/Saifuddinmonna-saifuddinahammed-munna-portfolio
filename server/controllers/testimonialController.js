const Testimonial = require("../models/Testimonial");

// Get all approved testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: "approved" }).sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit a new testimonial
exports.submitTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json({
      message: "Testimonial submitted successfully. It will be visible after approval.",
      testimonial,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Get all testimonials (including pending)
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update testimonial status
exports.updateTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(id, { status }, { new: true });

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
