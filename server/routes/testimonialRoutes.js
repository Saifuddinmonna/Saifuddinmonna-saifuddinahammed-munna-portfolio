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

const router = express.Router();

// Public routes
router.get('/', getTestimonials);
router.post('/', upload.single('clientImageFile'), submitTestimonial);

// Admin routes
router.get('/admin/all', verifyToken, isAdmin, getAllTestimonials);
router.patch('/admin/:id/status', verifyToken, isAdmin, updateTestimonialStatus);
router.delete('/admin/:id', verifyToken, isAdmin, deleteTestimonial);

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
