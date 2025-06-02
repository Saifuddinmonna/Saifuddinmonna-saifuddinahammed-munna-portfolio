import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

const TestimonialList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get("/api/testimonials");
      setTestimonials(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to load testimonials");
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
        <button
          onClick={fetchTestimonials}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No testimonials available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center mb-4">
            {testimonial.image ? (
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <span className="text-blue-500 text-2xl font-semibold">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{testimonial.name}</h3>
              <p className="text-gray-600 text-sm">{testimonial.role}</p>
              <p className="text-gray-500 text-sm">{testimonial.company}</p>
            </div>
          </div>

          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">{formatDate(testimonial.date)}</span>
          </div>

          <div className="relative mb-4">
            <FaQuoteLeft className="text-blue-100 text-4xl absolute -top-2 -left-2" />
            <p className="text-gray-700 relative z-10 pl-4">{testimonial.text}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Services:</span> {testimonial.services}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TestimonialList;
