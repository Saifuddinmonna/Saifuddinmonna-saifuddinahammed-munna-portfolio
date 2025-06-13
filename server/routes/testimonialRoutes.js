const express = require('express');
const { 
  getTestimonials,
  submitTestimonial,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial
} = require('../controllers/testimonialController');
const upload = require('../middlewares/multer');
const { verifyToken, isAdmin } = require("../middlewares/auth");
const Testimonial = require("../models/Testimonial");
const { uploadToImageBB } = require('../utils/imageUploader');

const router = express.Router();

// Public routes
router.get('/', getTestimonials);
router.post('/', upload.single('clientImageFile'), submitTestimonial);

// Admin routes
router.get('/admin/all', verifyToken, isAdmin, getAllTestimonials);
router.patch('/admin/:id/status', verifyToken, isAdmin, updateTestimonialStatus);
router.delete('/admin/:id', verifyToken, isAdmin, deleteTestimonial);

// Get all approved testimonials (Public)
router.get('/', async (req, res) => {
  console.log('=== GET /testimonials - Fetching all approved testimonials ===');
  try {
    // First check if Testimonial model is properly imported
    if (!Testimonial) {
      console.error('Testimonial model is not properly imported');
      throw new Error('Database model error');
    }

    // Log the query parameters
    console.log('Query parameters:', { status: "approved" });

    // Execute the query
    const testimonials = await Testimonial.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    // Log the result
    console.log('Query result:', testimonials);
    console.log(`Found ${testimonials ? testimonials.length : 0} approved testimonials`);

    // Send response
    res.json({
      success: true,
      data: testimonials || []
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching testimonials'
    });
  }
});

// Get single testimonial
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update testimonial
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    Object.assign(testimonial, req.body);
    await testimonial.save();
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete testimonial
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    await testimonial.deleteOne();
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit new testimonial (Public)
router.post('/', upload.single('clientImageFile'), async (req, res) => {
  console.log('=== POST /testimonials - Submitting new testimonial ===');
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file ? 'File received' : 'No file uploaded');
  
  try {
    let finalImageUrl = req.body.clientImageUrlInput || null;
    if (req.file) {
      console.log('Processing uploaded image...');
      finalImageUrl = await uploadToImageBB(req.file.buffer);
      console.log('Image uploaded successfully:', finalImageUrl);
    }

    const testimonial = await Testimonial.create({
      ...req.body,
      clientImageURL: finalImageUrl,
    });
    console.log('Testimonial created successfully:', testimonial._id);
    
    res.status(201).json({
      success: true,
      message: "Testimonial submitted successfully. It will be visible after approval.",
      data: testimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get all testimonials (Admin)
router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
  console.log('=== GET /testimonials/admin/all - Fetching all testimonials (Admin) ===');
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    console.log(`Found ${testimonials.length} total testimonials`);
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Update testimonial status (Admin)
router.patch('/admin/:id/status', verifyToken, isAdmin, async (req, res) => {
  console.log('=== PATCH /testimonials/admin/:id/status - Updating testimonial status ===');
  console.log('Testimonial ID:', req.params.id);
  console.log('New status:', req.body.status);
  
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      console.log('Testimonial not found');
      return res.status(404).json({ 
        success: false,
        message: "Testimonial not found" 
      });
    }

    console.log('Testimonial status updated successfully');
    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Error updating testimonial status:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Delete testimonial (Admin)
router.delete('/admin/:id', verifyToken, isAdmin, async (req, res) => {
  console.log('=== DELETE /testimonials/admin/:id - Deleting testimonial ===');
  console.log('Testimonial ID:', req.params.id);
  
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      console.log('Testimonial not found');
      return res.status(404).json({ 
        success: false,
        message: "Testimonial not found" 
      });
    }

    console.log('Testimonial deleted successfully');
    res.json({ 
      success: true,
      message: "Testimonial deleted successfully" 
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router;
