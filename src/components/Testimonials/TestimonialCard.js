import React from "react";
import {
  FaStar,
  FaQuoteLeft,
  FaBuilding,
  FaUserTie,
  FaCalendarAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const TestimonialCard = ({ testimonial, index }) => {
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

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1, // Staggered animation based on index
        ease: "easeOut",
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
      },
    },
  };

  const quoteVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.4,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.6,
      },
    },
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.8,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-[var(--background-paper)] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[var(--border-main)]"
    >
      {/* Header with Image and Rating */}
      <div className="flex items-start gap-4 mb-6">
        <motion.div className="flex-shrink-0 relative" variants={imageVariants}>
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[var(--primary-main)] shadow-lg">
            <motion.img
              src={clientImageURL || "/images/default-avatar.png"}
              alt={clientName}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <motion.div
            className="absolute -bottom-2 -right-2 bg-[var(--primary-main)] text-white rounded-full p-2 shadow-lg"
            variants={quoteVariants}
          >
            <FaQuoteLeft className="text-sm" />
          </motion.div>
        </motion.div>
        <motion.div className="flex-grow" variants={textVariants}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{clientName}</h3>
            <motion.div
              className="flex items-center gap-1 bg-[var(--background-default)] px-2 py-1 rounded-full"
              whileHover={{ scale: 1.1 }}
            >
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FaStar
                    className={`text-sm ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
          <div className="space-y-1">
            <motion.div
              className="flex items-center gap-2 text-[var(--text-secondary)]"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <FaUserTie className="text-[var(--primary-main)]" />
              <span className="text-sm">{position}</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-[var(--text-secondary)]"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <FaBuilding className="text-[var(--primary-main)]" />
              <span className="text-sm">{companyName}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Testimonial Text */}
      <motion.div className="relative mb-6" variants={textVariants}>
        <motion.div
          className="absolute -top-4 -left-4 text-[var(--primary-main)] opacity-10"
          animate={{
            rotate: [0, 5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <FaQuoteLeft className="text-6xl" />
        </motion.div>
        <p className="text-[var(--text-primary)] relative z-10 pl-6 italic leading-relaxed">
          {testimonialText}
        </p>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="flex items-center justify-between pt-4 border-t border-[var(--border-main)]"
        variants={footerVariants}
      >
        <motion.div
          className="flex items-center gap-2 text-[var(--text-secondary)]"
          whileHover={{ scale: 1.05 }}
        >
          <FaCalendarAlt className="text-[var(--primary-main)]" />
          <span className="text-sm">{formattedDate}</span>
        </motion.div>
        {projectLink && (
          <motion.a
            href={projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[var(--primary-main)] hover:text-[var(--primary-dark)] transition-colors duration-300 text-sm font-medium"
            whileHover={{
              scale: 1.1,
              x: 5,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View Project</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <FaExternalLinkAlt className="text-xs" />
            </motion.span>
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TestimonialCard;
