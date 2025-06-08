const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  position: {
    type: String,
    required: [true, "Position is required"],
    trim: true,
    maxlength: [100, "Position cannot exceed 100 characters"]
  },
  company: {
    type: String,
    required: [true, "Company is required"],
    trim: true,
    maxlength: [100, "Company name cannot exceed 100 characters"]
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
    minlength: [10, "Content must be at least 10 characters long"],
    maxlength: [1000, "Content cannot exceed 1000 characters"]
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"]
  },
  image: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, "Please enter a valid URL"]
  },
  createdBy: {
    type: String,
    required: [true, "Creator ID is required"]
  },
  services: {
    type: String,
    required: [true, "Services are required"],
    trim: true,
    maxlength: [200, "Services description cannot exceed 200 characters"]
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "approved", "rejected"],
      message: "Status must be either pending, approved, or rejected"
    },
    default: "pending"
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for formatted date
testimonialSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Add index for better query performance
testimonialSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Testimonial", testimonialSchema);
