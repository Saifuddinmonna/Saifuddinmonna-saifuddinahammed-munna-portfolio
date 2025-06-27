import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Intersection Loader Component
 * Loads components only when they come into viewport
 */
const IntersectionLoader = ({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = "50px",
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Add delay if specified
          setTimeout(() => {
            setIsLoaded(true);
          }, delay);

          // Disconnect observer after loading
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, delay]);

  return (
    <div ref={ref}>
      {isLoaded ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      ) : isVisible ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {fallback}
        </motion.div>
      ) : (
        fallback
      )}
    </div>
  );
};

export default IntersectionLoader;
