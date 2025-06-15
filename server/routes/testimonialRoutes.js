const express = require('express');
const { 
  getPublicTestimonials,
  getUserTestimonials,
  submitTestimonial,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
  updateTestimonial
} = require('../controllers/testimonialController');
const upload = require('../middlewares/multer');
const { verifyToken, isAdmin } = require("../middlewares/auth");
const Testimonial = require("../models/Testimonial");

const router = express.Router();

// Public routes (no auth required)
router.get('/public', getPublicTestimonials);
router.post('/', upload.single('clientImageFile'), submitTestimonial);

// User routes (requires auth)
router.get('/user', verifyToken, getUserTestimonials);
router.patch('/:id', verifyToken, updateTestimonial);
router.delete('/:id', verifyToken, deleteTestimonial);

// Admin routes (requires admin auth)
router.get('/admin/all', verifyToken, isAdmin, getAllTestimonials);
router.patch('/admin/:id/status', verifyToken, isAdmin, updateTestimonialStatus);
router.delete('/admin/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ 
        success: false,
        message: "Testimonial not found" 
      });
    }
    await testimonial.deleteOne();
    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully by admin"
    });
  } catch (error) {
    console.error('Error in admin delete testimonial:', error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting testimonial",
      error: error.message 
    });
  }
});

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Error handling middleware for this router
router.use((err, req, res, next) => {
  console.error('Testimonial route error:', err);
    res.status(500).json({ 
      success: false,
    message: 'Error in testimonial route',
    error: err.message
    });
});

module.exports = router;
