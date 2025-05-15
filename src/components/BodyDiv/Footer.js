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
        { name: "Blog", path: "/blog" },         // Assuming you have a blog page
        { name: "Contact", path: "/contact" },   // Assuming you have a contact page
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
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.footer
            className="bg-gray-900 text-gray-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative"
            variants={footerVariants}
            initial="hidden"
            animate="visible" // Or use whileInView for scroll-triggered animation
            // whileInView="visible"
            // viewport={{ once: true, amount: 0.3 }}
        >
            {/* Back to Top Button */}
            <motion.button
                onClick={scrollToTop}
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-sky-500 hover:bg-sky-600 text-white rounded-full p-3 shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 focus:outline-none"
                aria-label="Scroll to top"
                variants={itemVariants}
                whileHover={{ scale: 1.15, rotate: 360 }}
                transition={{ type: "spring", stiffness: 300, duration: 0.5 }}

            >
                <FaArrowUp size={20} />
            </motion.button>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {/* Column 1: Brand/Name & Brief */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">
                        <NavLink to="/" onClick={scrollToTop}>Saifuddin A. Monna</NavLink>
                    </h3>
                    <p className="text-sm text-gray-400">
                        Passionate web developer creating modern and responsive web applications.
                    </p>
                    <a
                        href="mailto:youremail@example.com" // UPDATE YOUR EMAIL
                        className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors"
                    >
                        <MdEmail className="mr-2" /> Saifuddinmonna@gmail.com
                    </a>
                </motion.div>

                {/* Column 2: Quick Links */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                    <ul className="space-y-2">
                        {quickLinks.map((link) => (
                            <li key={link.name}>
                                <NavLink
                                    to={link.path}
                                    onClick={scrollToTop}
                                    className="hover:text-sky-400 transition-colors duration-200"
                                    activeClassName="text-sky-400 font-medium" // For react-router-dom v5
                                    // For v6, you'd use a function in className:
                                    // className={({ isActive }) => isActive ? "text-sky-400 font-medium" : "hover:text-sky-400 transition-colors duration-200"}
                                >
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Column 3: Social Links */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Connect With Me</h4>
                    <div className="flex space-x-4">
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.name}
                                className="text-gray-400 hover:text-sky-400 transition-colors duration-200"
                                whileHover={{ scale: 1.2, y: -2 }}
                            >
                                {React.cloneElement(social.icon, { size: 22 })}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Column 4: Newsletter or Small Info (Optional) */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Stay Updated</h4>
                    <p className="text-sm text-gray-400">
                        Follow my work and journey on my blog and social media.
                    </p>
                    {/* You could add a mini newsletter signup here if desired */}
                </motion.div>
            </div>

            {/* Bottom Bar: Copyright */}
            <motion.div
                className="border-t border-gray-700 pt-8 text-center"
                variants={itemVariants}
            >
                <p className="text-sm text-gray-400">
                    Crafted with <span className="text-red-500">♥</span> by Saifuddin Ahammed Monna.
                </p>
                <p className="text-sm text-gray-400">
                    © {currentYear} All rights reserved.
                </p>
            </motion.div>
        </motion.footer>
    );
};

export default Footer;