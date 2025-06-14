import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import testimonialService from "../../services/testimonialService";
import { useAuth } from "../../auth/context/AuthContext";
import TestimonialCard from "./TestimonialCard";
import TestimonialForm from "./TestimonialForm";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-hot-toast";

const TestimonialsPage = () => {
  console.log("testimonial page load hoyese");
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  // Use React Query to fetch testimonials based on user authentication
  const {
    data: testimonialsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["testimonials", user?.email],
    queryFn: () => testimonialService.getPublicTestimonials(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  console.log("testimonial test ", testimonialsData);

  const handleSuccess = () => {
    setShowForm(false);
    refetch(); // Refetch testimonials after successful submission
    toast.success("Testimonial submitted successfully!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error.message || "Error loading testimonials. Please try again later."}
      </div>
    );
  }

  // Ensure testimonials is an array
  const testimonials = Array.isArray(testimonialsData)
    ? testimonialsData
    : testimonialsData?.data
    ? testimonialsData.data
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Testimonials</h1>
          <p className="text-[var(--text-secondary)] mt-2">
            {user ? "Your testimonials" : "Public testimonials"}
          </p>
        </div>
        {user && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[var(--primary-main)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
          >
            {showForm ? (
              <>
                <FaMinus />
                Hide Form
              </>
            ) : (
              <>
                <FaPlus />
                Share Your Experience
              </>
            )}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showForm && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 overflow-hidden"
          >
            <TestimonialForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(testimonial => (
          <TestimonialCard
            key={testimonial._id}
            testimonial={testimonial}
            onDelete={() => refetch()}
            onEdit={() => setShowForm(true)}
          />
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center text-[var(--text-secondary)] py-8">
          {user
            ? "You haven't submitted any testimonials yet. Share your experience!"
            : "No public testimonials available at the moment."}
        </div>
      )}

      {!user && (
        <div className="text-center mt-8 p-4 bg-[var(--background-paper)] rounded-lg">
          <p className="text-[var(--text-secondary)] mb-4">
            Want to share your experience? Login to submit a testimonial!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/login")}
            className="bg-[var(--primary-main)] text-white px-6 py-2 rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
          >
            Login to Submit
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;
