const Testimonial = require("../models/Testimonial");
const { uploadToImageBB } = require("../utils/imageUploader");

// Get all approved testimonials
exports.getTestimonials = async (req, res) => {
  try {
    console.log('=== GET /testimonials - Fetching all approved testimonials ===');
    const testimonials = await testimonials.find({ status: "approved" })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: testimonials,
      // console.log(`Found ${testimonials.length} approved testimonials`)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
      
    });
  }
};

// Submit a new testimonial
exports.submitTestimonial = async (req, res) => {
  try {
    let finalImageUrl = req.body.clientImageUrlInput || null;

    if (req.file) {
      finalImageUrl = await uploadToImageBB(req.file.buffer);
    }

    const testimonial = await Testimonial.create({
      ...req.body,
      clientImageURL: finalImageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Testimonial submitted successfully. It will be visible after approval.",
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Admin: Get all testimonials (including pending)
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Admin: Update testimonial status
exports.updateTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: "Testimonial not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Admin: Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: "Testimonial not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Testimonial deleted successfully" 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};
