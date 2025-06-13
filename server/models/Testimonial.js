const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    testimonialText: {
      type: String,
      required: [true, "Testimonial text is required"],
      minlength: [10, "Testimonial must be at least 10 characters long"],
      maxlength: [1000, "Testimonial cannot exceed 1000 characters"]
    },
    clientImageURL: {
      type: String,
      required: false,
      match: [/^https?:\/\/.+/, "Please enter a valid URL"]
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"]
    },
    position: {
      type: String,
      trim: true,
      maxlength: [100, "Position cannot exceed 100 characters"]
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"]
    },
    projectLink: {
      type: String,
      match: [/^https?:\/\/.+/, "Please enter a valid URL"]
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "Status must be either pending, approved, or rejected"
      },
      default: "pending"
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

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
