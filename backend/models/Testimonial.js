const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientImage: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    testimonial: {
      type: String,
      required: true,
      trim: true,
    },
    clientPosition: {
      type: String,
      trim: true,
      default: "Client",
    },
    company: {
      type: String,
      trim: true,
      default: "Company",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    submittedBy: {
      type: String,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
testimonialSchema.index({ isApproved: 1, isActive: 1 });
testimonialSchema.index({ submittedAt: -1 });

module.exports = mongoose.model("Testimonial", testimonialSchema);
