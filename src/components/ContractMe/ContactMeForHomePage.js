import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ContactMeForHomePage = () => {
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
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[var(--background-default)] to-[var(--background-paper)] dark:from-[var(--background-default)] dark:to-[var(--background-elevated)]"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-16 lg:mb-20 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] capitalize mb-6">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] dark:from-[var(--primary-light)] dark:to-[var(--secondary-light)]">
              Touch
            </span>
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
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
              className="p-6 rounded-xl border border-[var(--border-light)] dark:border-[var(--border-main)] transition-all duration-300 ease-in-out bg-[var(--background-paper)] dark:bg-[var(--background-elevated)] backdrop-blur-sm hover:-translate-y-2 hover:scale-[1.02] hover:border-[var(--primary-main)]/50 dark:hover:border-[var(--primary-light)]/50 hover:shadow-[var(--shadow-lg)] dark:hover:shadow-[var(--shadow-lg)] text-center group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-[var(--background-elevated)] dark:to-[var(--background-paper)] rounded-2xl mb-6 shadow-lg shadow-[var(--primary-main)]/10 dark:shadow-[var(--primary-light)]/5 group-hover:scale-110 transition-transform duration-300">
                <info.icon className="w-8 h-8 text-[var(--primary-main)] dark:text-[var(--primary-light)] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)] capitalize">
                {info.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] leading-relaxed">
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
