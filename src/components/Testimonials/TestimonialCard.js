import React from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const TestimonialCard = ({ testimonial }) => {
  const {
    clientName,
    testimonialText,
    clientImageURL,
    companyName,
    position,
    rating,
    projectLink,
    formattedDate,
  } = testimonial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--background-paper)] rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <img
            src={clientImageURL || "/images/default-avatar.png"}
            alt={clientName}
            className="w-16 h-16 rounded-full object-cover border-2 border-[var(--primary-main)]"
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">{clientName}</h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < rating ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            {position} at {companyName}
          </p>
          {projectLink && (
            <a
              href={projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary-main)] text-sm hover:underline"
            >
              View Project
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 relative">
        <FaQuoteLeft className="text-[var(--primary-main)] opacity-20 text-4xl absolute -top-2 -left-2" />
        <p className="text-[var(--text-primary)] relative z-10 pl-6">{testimonialText}</p>
      </div>

      <div className="mt-4 text-sm text-[var(--text-secondary)]">{formattedDate}</div>
    </motion.div>
  );
};

export default TestimonialCard;
