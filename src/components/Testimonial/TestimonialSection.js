import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import TestimonialModal from "./TestimonialModal";
import TestimonialList from "./TestimonialList";

const TestimonialSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Client Testimonials
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Read what our clients have to say about their experience working with us. Your feedback
            helps us improve and serve you better.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <FaPlus className="mr-2" />
            Share Your Experience
          </button>
        </motion.div>

        <TestimonialList />

        <TestimonialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </section>
  );
};

export default TestimonialSection;
