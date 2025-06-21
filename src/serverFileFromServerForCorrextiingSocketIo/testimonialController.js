const Testimonial = require("./Testimonial");
const { uploadToImageBB } = require("./imageUploader");

// Get public testimonials (no auth required)
exports.getPublicTestimonials = async (req, res) => {
  try {
    console.log("Fetching public testimonials...");

    const testimonials = await Testimonial.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    console.log("Found public testimonials:", testimonials.length);

    res.status(200).json({
      success: true,
      data: testimonials,
      message: "Public testimonials fetched successfully",
    });
  } catch (error) {
    console.error("Error in getPublicTestimonials:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching public testimonials",
      error: error.message,
    });
  }
};

// Get user testimonials (requires auth)
exports.getUserTestimonials = async (req, res) => {
  try {
    console.log("Fetching user testimonials...");
    console.log("User:", req.user.email);

    const testimonials = await Testimonial.find({
      $or: [{ status: "approved" }, { email: req.user.email }],
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log("Found user testimonials:", testimonials.length);

    res.status(200).json({
      success: true,
      data: testimonials,
      message: "User testimonials fetched successfully",
    });
  } catch (error) {
    console.error("Error in getUserTestimonials:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user testimonials",
      error: error.message,
    });
  }
};

// Submit a new testimonial (no auth required)
exports.submitTestimonial = async (req, res) => {
  try {
    console.log("Submitting new testimonial...");
    console.log("Request body:", req.body);
    console.log("File:", req.file);

    let finalImageUrl = req.body.clientImageUrlInput || null;

    if (req.file) {
      finalImageUrl = await uploadToImageBB(req.file.buffer);
    }

    const testimonial = await Testimonial.create({
      ...req.body,
      clientImageURL: finalImageUrl,
      status: "pending",
    });

    console.log("Created testimonial:", testimonial);

    res.status(201).json({
      success: true,
      message: "Testimonial submitted successfully. It will be visible after approval.",
      data: testimonial,
    });
  } catch (error) {
    console.error("Error in submitTestimonial:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting testimonial",
      error: error.message,
    });
  }
};

// Update testimonial (requires auth)
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating testimonial ${id}`);

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Check if user owns the testimonial
    if (testimonial.email !== req.user.email && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this testimonial",
      });
    }

    // Handle image upload if present
    if (req.file) {
      req.body.clientImageURL = await uploadToImageBB(req.file.buffer);
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedTestimonial,
      message: "Testimonial updated successfully",
    });
  } catch (error) {
    console.error("Error in updateTestimonial:", error);
    res.status(400).json({
      success: false,
      message: "Error updating testimonial",
      error: error.message,
    });
  }
};

// Delete testimonial (requires auth)
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting testimonial ${id}`);

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Check if user owns the testimonial
    if (testimonial.email !== req.user.email && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this testimonial",
      });
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteTestimonial:", error);
    res.status(400).json({
      success: false,
      message: "Error deleting testimonial",
      error: error.message,
    });
  }
};

// Admin: Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    console.log("Fetching all testimonials...");

    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();

    console.log("Found testimonials:", testimonials.length);

    res.status(200).json({
      success: true,
      data: testimonials,
      message: "All testimonials fetched successfully",
    });
  } catch (error) {
    console.error("Error in getAllTestimonials:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all testimonials",
      error: error.message,
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
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
      message: "Testimonial status updated successfully",
    });
  } catch (error) {
    console.error("Error in updateTestimonialStatus:", error);
    res.status(400).json({
      success: false,
      message: "Error updating testimonial status",
      error: error.message,
    });
  }
};
