const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Public routes
router.get("/", testimonialController.getTestimonials);
router.post("/", testimonialController.createTestimonial);

// Admin routes
router.get("/pending", isAuthenticated, isAdmin, testimonialController.getPendingTestimonials);
router.patch(
  "/:id/status",
  isAuthenticated,
  isAdmin,
  testimonialController.updateTestimonialStatus
);
router.delete("/:id", isAuthenticated, isAdmin, testimonialController.deleteTestimonial);

module.exports = router;
