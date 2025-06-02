import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaQuoteLeft,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaCode,
  FaLaptop,
  FaMobile,
  FaServer,
  FaTools,
  FaUserPlus,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../services/api";

const TestimonialsPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
    rating: 5,
    image: null,
    service: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.get("http://localhost:5000/api/testimonials");
      setTestimonials(response.data);
      console.log(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
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

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: direction => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: direction => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setNewComment({ ...newComment, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCommentSubmit = async e => {
    e.preventDefault();

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", newComment.name);
    formData.append("comment", newComment.comment);
    formData.append("rating", newComment.rating);
    formData.append("service", newComment.service);
    formData.append("date", newComment.date);

    // Optional fields
    if (newComment.email) formData.append("email", newComment.email);
    if (newComment.phone) formData.append("phone", newComment.phone);
    if (newComment.image) formData.append("image", newComment.image);

    try {
      // Here you would send the formData to your backend
      // const response = await fetch('/api/testimonials', {
      //   method: 'POST',
      //   body: formData
      // });

      console.log("Form data to be sent:", Object.fromEntries(formData));

      // Reset form
      setShowCommentForm(false);
      setNewComment({
        name: "",
        email: "",
        phone: "",
        comment: "",
        rating: 5,
        image: null,
        service: "",
        date: new Date().toISOString().split("T")[0],
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      } transition-colors duration-300`}
    >
      <Helmet>
        <title>Testimonials | Saifuddin Ahammed Monna</title>
        <meta
          name="description"
          content="Read what clients and colleagues say about working with Saifuddin Ahammed Monna."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Client Testimonials
          </h1>
          <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            What people say about working with me
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Testimonial Carousel */}
          <div className="relative">
            <div className="relative max-w-4xl mx-auto">
              {/* Navigation Buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaChevronLeft className="text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaChevronRight className="text-gray-600 dark:text-gray-300" />
              </button>

              {/* Testimonial Carousel */}
              <div className="relative h-[500px] overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute w-full"
                  >
                    <div
                      className={`p-8 rounded-2xl ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } shadow-xl`}
                    >
                      <div className="flex flex-col md:flex-row gap-8">
                        {/* Image Section */}
                        <div className="w-full md:w-1/3">
                          <div className="relative">
                            <div className="aspect-square rounded-xl overflow-hidden">
                              <img
                                src={testimonials[currentIndex].image}
                                alt={testimonials[currentIndex].name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                              <FaQuoteLeft className="text-white text-2xl" />
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-2/3">
                          <div className="flex items-center gap-2 mb-4">
                            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                              <FaStar key={i} className="text-yellow-400" />
                            ))}
                          </div>
                          <p
                            className={`text-lg mb-6 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {testimonials[currentIndex].text}
                          </p>
                          <div className="mb-4">
                            <h3
                              className={`text-xl font-semibold ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {testimonials[currentIndex].name}
                            </h3>
                            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {testimonials[currentIndex].role} at{" "}
                              {testimonials[currentIndex].company}
                            </p>
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              {formatDate(testimonials[currentIndex].date)}
                            </p>
                          </div>
                          <div className="mt-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm ${
                                isDarkMode
                                  ? "bg-blue-900 text-blue-200"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {testimonials[currentIndex].services}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dots Navigation */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex
                        ? "bg-blue-500"
                        : isDarkMode
                        ? "bg-gray-600"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Customer Comments Section */}
          <div className="space-y-6">
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              Recent Customer Comments
            </h2>

            <div className="space-y-4">
              {testimonials.slice(0, 4).map(testimonial => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 w-4 h-4" />
                        ))}
                      </div>
                      <p
                        className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {testimonial.text}
                      </p>
                      <div>
                        <h4
                          className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                        >
                          {testimonial.name}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {testimonial.role} at {testimonial.company}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 mt-2 rounded-full text-xs ${
                            isDarkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {testimonial.services}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All Comments Button */}
            <div className="text-center mt-6">
              <button
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                } text-sm font-medium transition-colors`}
              >
                View All Comments
              </button>
            </div>
          </div>
        </div>

        {/* Add Comment Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setShowCommentForm(true)}
            className={`px-6 py-3 rounded-full ${
              isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            } text-white font-medium transition-colors`}
          >
            Share Your Experience
          </button>
        </div>

        {/* Comment Form Modal */}
        {showCommentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`w-full max-w-md p-6 rounded-xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                Share Your Experience
              </h2>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                {/* Required Fields */}
                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newComment.name}
                    onChange={e => setNewComment({ ...newComment, name: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Service <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newComment.service}
                    onChange={e => setNewComment({ ...newComment, service: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewComment({ ...newComment, rating })}
                        className={`p-2 rounded-lg ${
                          newComment.rating === rating
                            ? "bg-yellow-400 text-white"
                            : isDarkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Your Comment <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newComment.comment}
                    onChange={e => setNewComment({ ...newComment, comment: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    rows="4"
                    required
                  />
                </div>

                {/* Optional Fields */}
                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={newComment.email}
                    onChange={e => setNewComment({ ...newComment, email: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={newComment.phone}
                    onChange={e => setNewComment({ ...newComment, phone: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Profile Picture (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCommentForm(false)}
                    className={`px-4 py-2 rounded-lg ${
                      isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPage;
