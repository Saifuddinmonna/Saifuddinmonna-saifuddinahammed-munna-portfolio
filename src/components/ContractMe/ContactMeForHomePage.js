import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { ThemeContext } from "../../App";

const ContactMeForHomePage = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email",
      content: "saifuddinahammedmunna@gmail.com",
      link: "mailto:saifuddinahammedmunna@gmail.com",
    },
    {
      icon: FaPhone,
      title: "Phone",
      content: "+880 1623361191",
      link: "tel:+8801623361191",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Location",
      content: "Dhaka, Bangladesh",
      link: "https://maps.google.com/?q=Dhaka,Bangladesh",
    },
  ];

  return (
    <section
      id="contact"
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[var(--background-default)] to-[var(--background-paper)] dark:from-[var(--background-default)] dark:to-[var(--background-elevated)] transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-16 lg:mb-20 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] capitalize mb-6 transition-colors duration-300">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] dark:from-[var(--primary-light)] dark:to-[var(--secondary-light)] transition-all duration-300">
              Touch
            </span>
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
            Feel free to reach out to me for any questions or opportunities
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {contactInfo.map((info, index) => (
            <motion.a
              key={index}
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-6 rounded-xl border transition-all duration-300 ease-in-out backdrop-blur-sm hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[var(--shadow-lg)] text-center group
                ${
                  isDarkMode
                    ? "border-[var(--border-main)] bg-[var(--background-elevated)] hover:border-[var(--primary-light)]/50"
                    : "border-[var(--border-light)] bg-[var(--background-paper)] hover:border-[var(--primary-main)]/50"
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`inline-flex items-center justify-center p-4 rounded-2xl mb-6 shadow-lg transition-all duration-300 group-hover:scale-110
                ${
                  isDarkMode
                    ? "bg-gradient-to-br from-[var(--background-elevated)] to-[var(--background-paper)] shadow-[var(--primary-light)]/5"
                    : "bg-gradient-to-br from-indigo-50 to-blue-50 shadow-[var(--primary-main)]/10"
                }`}
              >
                <info.icon
                  className={`w-8 h-8 transition-colors duration-300 group-hover:scale-110
                  ${isDarkMode ? "text-[var(--primary-light)]" : "text-[var(--primary-main)]"}`}
                />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-[var(--text-primary)] capitalize transition-colors duration-300">
                {info.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed transition-colors duration-300">
                {info.content}
              </p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactMeForHomePage;
