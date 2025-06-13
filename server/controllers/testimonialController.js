const Testimonial = require("../models/Testimonial");
const { uploadToImageBB } = require("../utils/imageUploader");

// Get all approved testimonials
exports.getTestimonials = async (req, res) => {
  try {
    console.log('Fetching approved testimonials...');
    
    const testimonials = await Testimonial.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    console.log('Found testimonials:', testimonials.length);

    if (!testimonials || testimonials.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No approved testimonials found"
      });
    }

    res.status(200).json({
      success: true,
      data: testimonials,
      message: "Testimonials fetched successfully"
    });
  } catch (error) {
    console.error('Error in getTestimonials:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching testimonials",
      error: error.message 
    });
  }
};

// Submit a new testimonial
exports.submitTestimonial = async (req, res) => {
  try {
    console.log('Submitting new testimonial...');
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    let finalImageUrl = req.body.clientImageUrlInput || null;

    if (req.file) {
      finalImageUrl = await uploadToImageBB(req.file.buffer);
    }

    const testimonial = await Testimonial.create({
      ...req.body,
      clientImageURL: finalImageUrl,
      status: "pending" // Set initial status as pending
    });

    console.log('Created testimonial:', testimonial);

    res.status(201).json({
      success: true,
      message: "Testimonial submitted successfully. It will be visible after approval.",
      data: testimonial
    });
  } catch (error) {
    console.error('Error in submitTestimonial:', error);
    res.status(500).json({ 
      success: false,
      message: "Error submitting testimonial",
      error: error.message 
    });
  }
};

// Admin: Get all testimonials (including pending)
exports.getAllTestimonials = async (req, res) => {
  try {
    console.log('Fetching all testimonials...');
    
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .lean();

    console.log('Found testimonials:', testimonials.length);

    res.status(200).json({
      success: true,
      data: testimonials,
      message: "All testimonials fetched successfully"
    });
  } catch (error) {
    console.error('Error in getAllTestimonials:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching all testimonials",
      error: error.message 
    });
  }
};

// Admin: Update testimonial status
exports.updateTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Updating testimonial ${id} status to ${status}`);

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
      data: testimonial,
      message: "Testimonial status updated successfully"
    });
  } catch (error) {
    console.error('Error in updateTestimonialStatus:', error);
    res.status(400).json({ 
      success: false,
      message: "Error updating testimonial status",
      error: error.message 
    });
  }
};

// Admin: Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting testimonial ${id}`);

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
    console.error('Error in deleteTestimonial:', error);
    res.status(400).json({ 
      success: false,
      message: "Error deleting testimonial",
      error: error.message 
    });
  }
};
