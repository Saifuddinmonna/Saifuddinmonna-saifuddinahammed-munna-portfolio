import React, { useState } from "react";
import { useDataFetching } from "../../hooks/useDataFetching";
import testimonialService from "../../services/testimonialService";
import { useAuth } from "../../auth/context/AuthContext";
import TestimonialCard from "./TestimonialCard";
import TestimonialForm from "./TestimonialForm";
import TestimonialAdminDashboard from "./TestimonialAdminDashboard";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-hot-toast";

const TestimonialsPage = () => {
  const { user, dbUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 9;

  // Determine which testimonial fetching function to use based on user role
  const getTestimonials = async () => {
    console.log("🔍 [Testimonials] User role:", dbUser?.data?.role);
    console.log("🔍 [Testimonials] User:", user);

    if (dbUser?.data?.role === "admin") {
      console.log("🔍 [Testimonials] Fetching admin testimonials");
      return await testimonialService.getAllTestimonials();
    } else if (user) {
      console.log("🔍 [Testimonials] Fetching user testimonials");
      return await testimonialService.getUserTestimonials();
    } else {
      console.log("🔍 [Testimonials] Fetching public testimonials");
      return await testimonialService.getPublicTestimonials();
    }
  };

  // Use the new custom hook for better data handling
  const {
    data: testimonialsData,
    isLoading,
    error,
    refetch,
  } = useDataFetching(["testimonials", dbUser?.data?.email, dbUser?.data?.role], getTestimonials, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true, // Always enable the query
    retry: 2,
  });

  console.log("📊 [Testimonials] Raw data received:", testimonialsData);
  console.log("📊 [Testimonials] Data type:", typeof testimonialsData);
  console.log("📊 [Testimonials] Is array:", Array.isArray(testimonialsData));

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
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Error Loading Testimonials</h3>
          <p className="text-sm">{error.message || "Please try again later."}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-[var(--primary-main)] text-white rounded-lg hover:bg-[var(--primary-dark)]"
        >
          Retry
        </button>
      </div>
    );
  }

  // Ensure testimonials is an array with proper data extraction
  let testimonials = [];

  if (testimonialsData) {
    if (Array.isArray(testimonialsData)) {
      testimonials = testimonialsData;
    } else if (testimonialsData.data && Array.isArray(testimonialsData.data)) {
      testimonials = testimonialsData.data;
    } else if (testimonialsData.works && Array.isArray(testimonialsData.works)) {
      testimonials = testimonialsData.works;
    } else if (typeof testimonialsData === "object") {
      // If it's an object, try to find array properties
      const possibleArrays = Object.values(testimonialsData).filter(val => Array.isArray(val));
      if (possibleArrays.length > 0) {
        testimonials = possibleArrays[0];
      }
    }
  }

  console.log("📊 [Testimonials] Final processed testimonials:", testimonials);
  console.log("📊 [Testimonials] Testimonials count:", testimonials.length);

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
      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Debug Info:</h4>
          <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <div>User Role: {dbUser?.data?.role || "None"}</div>
            <div>User Email: {dbUser?.data?.email || "None"}</div>
            <div>Raw Data Type: {typeof testimonialsData}</div>
            <div>Raw Data: {JSON.stringify(testimonialsData, null, 2).substring(0, 200)}...</div>
            <div>Processed Testimonials Count: {testimonials.length}</div>
          </div>
        </div>
      )}

      {/* Show Admin Dashboard for admin users */}
      {dbUser?.data?.role === "admin" && (
        <div className="mb-8">
          <TestimonialAdminDashboard onUpdate={refetch} />
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Testimonials</h1>
          <p className="text-[var(--text-secondary)] mt-2">
            {dbUser?.data?.role === "admin"
              ? "All Testimonials"
              : user
              ? "Your Testimonials"
              : "Public Testimonials"}
            {testimonials.length > 0 && ` (${testimonials.length} total)`}
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

      {/* Testimonials Grid */}
      {testimonials.length > 0 ? (
        <>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[var(--border-main)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--background-elevated)]"
              >
                <FaChevronLeft />
              </button>

              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 rounded-lg border ${
                    pageNumber === currentPage
                      ? "bg-[var(--primary-main)] text-white border-[var(--primary-main)]"
                      : "border-[var(--border-main)] hover:bg-[var(--background-elevated)]"
                  } ${pageNumber === "..." ? "cursor-default" : ""}`}
                  disabled={pageNumber === "..."}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[var(--border-main)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--background-elevated)]"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-[var(--text-secondary)] py-8">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            {dbUser?.data?.role === "admin"
              ? "No testimonials found"
              : user
              ? "You haven't submitted any testimonials yet"
              : "No testimonials available"}
          </h3>
          <p className="mb-4">
            {dbUser?.data?.role === "admin"
              ? "Testimonials will appear here once users submit them."
              : user
              ? "Share your experience to get started!"
              : "Check back later for testimonials."}
          </p>
          {user && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-main)] text-white rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors duration-200"
            >
              <FaPlus />
              Submit Your First Testimonial
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;
