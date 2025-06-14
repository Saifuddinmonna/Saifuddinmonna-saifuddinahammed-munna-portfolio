import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import testimonialService from "../../services/testimonialService";
import { useAuth } from "../../auth/context/AuthContext";
import TestimonialCard from "./TestimonialCard";
import TestimonialForm from "./TestimonialForm";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-hot-toast";

const TestimonialsPage = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 9;

  // Determine which testimonial fetching function to use based on user role
  const getTestimonials = async () => {
    if (user?.role === "admin") {
      return await testimonialService.getAllTestimonials();
    } else if (user) {
      return await testimonialService.getUserTestimonials();
    } else {
      return await testimonialService.getPublicTestimonials();
    }
  };

  // Use React Query to fetch testimonials based on user role
  const {
    data: testimonialsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["testimonials", user?.email, user?.role],
    queryFn: getTestimonials,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

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

  // Calculate pagination
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = testimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the start
      if (currentPage <= 2) {
        endPage = 4;
      }
      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageChange = pageNumber => {
    if (pageNumber === "...") return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Testimonials</h1>
          <p className="text-[var(--text-secondary)] mt-2">
            {user?.role === "admin"
              ? "All Testimonials"
              : user
              ? "Your Testimonials"
              : "Public Testimonials"}
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
        {currentTestimonials.map(testimonial => (
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
          {user?.role === "admin"
            ? "No testimonials available in the system."
            : user
            ? "You haven't submitted any testimonials yet. Share your experience!"
            : "No public testimonials available at the moment."}
        </div>
      )}

      {/* Modern Pagination */}
      {testimonials.length > 0 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)]"
            }`}
          >
            <FaChevronLeft />
          </motion.button>

          {getPageNumbers().map((number, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePageChange(number)}
              className={`px-4 py-2 rounded-lg ${
                number === currentPage
                  ? "bg-[var(--primary-main)] text-white"
                  : number === "..."
                  ? "bg-transparent text-[var(--text-secondary)] cursor-default"
                  : "bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--primary-light)]"
              }`}
            >
              {number}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[var(--primary-main)] text-white hover:bg-[var(--primary-dark)]"
            }`}
          >
            <FaChevronRight />
          </motion.button>
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
