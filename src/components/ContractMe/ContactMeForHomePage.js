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
      content: "+880 1303-123456",
      link: "tel:+8801303123456",
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
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-16 lg:mb-20 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 capitalize mb-6">
            Get In{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">
              Touch
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Let's discuss your project and see how I can help bring your ideas to life
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {contactInfo.map((info, index) => (
            <motion.a
              key={index}
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 backdrop-blur-sm hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] text-center group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl mb-6 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/5 group-hover:scale-110 transition-transform duration-300">
                <info.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100 capitalize">
                {info.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-200 leading-relaxed">
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
