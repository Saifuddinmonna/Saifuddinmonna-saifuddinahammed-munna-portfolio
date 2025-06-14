import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import testimonialService from "../services/testimonialService";
import TestimonialForm from "../components/Testimonials/TestimonialForm";
import TestimonialCard from "../components/Testimonials/TestimonialCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-hot-toast";

const TestimonialsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 6;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["testimonials"],
    queryFn: testimonialService.getAllTestimonials,
  });

  const testimonials = response?.data || [];

  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
  const startIndex = (currentPage - 1) * testimonialsPerPage;
  const endIndex = startIndex + testimonialsPerPage;
  const currentTestimonials = testimonials.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[var(--primary-main)]"></div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load testimonials");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading testimonials: {error.message}</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Testimonials | Saifuddin's Portfolio</title>
        <meta
          name="description"
          content="Read what our clients say about their experience working with Saifuddin. Real testimonials from satisfied clients."
        />
      </Helmet>

      <div className="min-h-screen bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              Client Testimonials
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Discover what our clients have to say about their experience working with us. Real
              feedback from real projects.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentTestimonials.map(testimonial => (
              <TestimonialCard key={testimonial._id} testimonial={testimonial} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--primary-main)] hover:text-white transition-colors duration-300 disabled:opacity-50"
              >
                <FaChevronLeft />
              </button>
              <span className="text-[var(--text-primary)]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-[var(--background-paper)] text-[var(--text-primary)] hover:bg-[var(--primary-main)] hover:text-white transition-colors duration-300 disabled:opacity-50"
              >
                <FaChevronRight />
              </button>
            </div>
          )}

          {/* Testimonial Form Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                Share Your Experience
              </h2>
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                Have you worked with us? We'd love to hear about your experience! Share your
                feedback and help others make informed decisions.
              </p>
            </div>
            <TestimonialForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialsPage;
