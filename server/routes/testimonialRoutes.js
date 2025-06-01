const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Public routes
router.get("/testimonials", testimonialController.getTestimonials);
router.post("/testimonials", testimonialController.submitTestimonial);

// Admin routes
router.get(
  "/admin/testimonials",
  isAuthenticated,
  isAdmin,
  testimonialController.getAllTestimonials
);
router.patch(
  "/admin/testimonials/:id",
  isAuthenticated,
  isAdmin,
  testimonialController.updateTestimonialStatus
);
router.delete(
  "/admin/testimonials/:id",
  isAuthenticated,
  isAdmin,
  testimonialController.deleteTestimonial
);

module.exports = router;
