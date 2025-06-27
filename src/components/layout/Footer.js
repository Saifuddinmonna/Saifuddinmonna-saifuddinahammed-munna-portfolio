import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaGithub, FaArrowUp } from "react-icons/fa";
import { MdEmail } from "react-icons/md"; // Example for email

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebookF />,
      url: "https://www.facebook.com/ahammed.rafayel/",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedinIn />,
      url: "https://www.linkedin.com/in/saifuddin-ahammed-monna/", // Update with your actual LinkedIn profile URL
    },
    {
      name: "Twitter",
      icon: <FaTwitter />,
      url: "https://twitter.com/yourprofile", // Update with your actual Twitter profile URL
    },
    {
      name: "GitHub",
      icon: <FaGithub />,
      url: "https://github.com/saifuddinmonna", // Update with your actual GitHub profile URL
    },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" }, // Assuming you have a projects page
    { name: "Blog", path: "/blog" }, // Assuming you have a blog page
    { name: "Contact", path: "/contact" }, // Assuming you have a contact page
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.footer
      className="bg-indigo-800 text-gray-300  dark:bg-gray-900 dark:text-gray-200  pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative rounded-t-[10px]"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-sky-500 hover:bg-sky-600 text-white rounded-full p-4 shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50"
        aria-label="Scroll to top"
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: 20 }}
        whileHover={{ scale: 1.1, rotate: 5, y: -3 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <FaArrowUp size={20} />
      </motion.button>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Column 1: Brand/Name & Brief */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-3xl font-extrabold text-white hover:text-sky-400 transition-colors duration-300">
            <NavLink to="/" onClick={scrollToTop}>
              Saifuddin A. Monna
            </NavLink>
          </h3>
          <p className="text-sm text-gray-300">
            {" "}
            {/* Increased contrast from gray-400 */}
            Passionate web developer creating modern and responsive web applications.
          </p>
          <a
            href="mailto:youremail@example.com" // UPDATE YOUR EMAIL
            className="inline-flex items-center text-sky-300 hover:text-sky-200 transition-colors group" // Adjusted sky colors for better contrast
          >
            <MdEmail className="mr-2 group-hover:animate-pulse" /> Saifuddinmonna@gmail.com
          </a>
        </motion.div>

        {/* Column 2: Quick Links */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="text-lg font-bold text-sky-100 tracking-wider uppercase">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map(link => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  onClick={scrollToTop}
                  className={({ isActive }) =>
                    `inline-block relative text-sky-300 hover:text-sky-200 transition-colors duration-200 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1.5px] after:bottom-0 after:left-0 after:bg-sky-300 after:origin-bottom-right after:transition-transform after:duration-250 after:ease-out hover:after:scale-x-100 hover:after:origin-bottom-left ${
                      isActive ? "text-sky-200 font-semibold" : "text-sky-300" // Adjusted sky colors
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Column 3: Social Links */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="text-lg font-bold text-sky-100 tracking-wider uppercase">
            Connect With Me
          </h4>
          <div className="flex space-x-4">
            {socialLinks.map(social => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-gray-300 hover:text-sky-300 p-2 rounded-full hover:bg-gray-700 transition-all duration-200" // Increased contrast for icons
                whileHover={{ scale: 1.25, y: -3, rotate: social.name === "Twitter" ? 5 : -5 }}
              >
                {React.cloneElement(social.icon, { size: 22 })}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Column 4: Newsletter or Small Info (Optional) */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h4 className="text-lg font-bold text-sky-100 tracking-wider uppercase">Stay Updated</h4>
          <p className="text-sm text-gray-300">
            {" "}
            {/* Increased contrast from gray-400 */}
            Follow my work and journey on my blog and social media.
          </p>
          {/* You could add a mini newsletter signup here if desired */}
        </motion.div>
      </div>

      {/* Bottom Bar: Copyright */}
      <motion.div className="border-t border-gray-700 pt-8 text-center" variants={itemVariants}>
        <p className="text-sm text-gray-300 hover:text-sky-300 transition-colors">
          {" "}
          {/* Increased contrast from gray-500 */}
          Crafted with{" "}
          <motion.span
            className="text-red-500 inline-block"
            whileHover={{
              scale: [1, 1.3, 1],
              transition: { duration: 0.5, repeat: Infinity, repeatType: "loop" },
            }}
          >
            ♥
          </motion.span>{" "}
          by Saifuddin Ahammed Monna.
        </p>
        <p className="text-sm text-gray-300">
          {" "}
          {/* Increased contrast from gray-500 */}© {currentYear} All rights reserved.
        </p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
