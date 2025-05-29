import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaGithub } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

// Icons (replace with your preferred icon library like react-icons)
const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z"
    />
  </svg>
);
const EnvelopeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ContactPage = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    phone_number: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateForm = () => {
    if (!formData.user_name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.user_email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return false;
    }
    return true;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await emailjs.sendForm(
        "YOUR_EMAILJS_SERVICE_ID", // Replace with your actual EmailJS Service ID
        "YOUR_EMAILJS_TEMPLATE_ID", // Replace with your actual EmailJS Template ID
        form.current,
        "YOUR_EMAILJS_PUBLIC_KEY" // Replace with your actual EmailJS Public Key
      );

      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({
        user_name: "",
        user_email: "",
        phone_number: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <Helmet>
        <title>Contact Me | Your Portfolio</title>
        <meta
          name="description"
          content="Get in touch with me for any inquiries or collaboration opportunities."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600">Have a question or want to work together?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="space-y-6">
              <InfoItem
                icon={<MapPinIcon />}
                label="Address"
                value="Dhaka, Bangladesh" // Example, update if needed
              />
              <InfoItem
                icon={<PhoneIcon />}
                label="Phone"
                value="+8801623361191" // Example, update if needed
                href="tel:+8801623361191"
              />
              <InfoItem
                icon={<EnvelopeIcon />}
                label="Email"
                value="Saifuddinmonna@gmail.com" // From Footer.js
                href="mailto:Saifuddinmonna@gmail.com"
              />
              <InfoItem
                icon={<ClockIcon />}
                label="Working Hours"
                value="Sat - Thu, 10:00 AM - 7:00 PM (Flexible for projects)" // Example, update if needed
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Follow Me</h3>
              <div className="flex space-x-4">
                <SocialIcon
                  href="https://www.facebook.com/ahammed.rafayel/"
                  icon={<FaFacebookF />}
                />
                <SocialIcon
                  href="https://www.linkedin.com/in/saifuddin-ahammed-monna/"
                  icon={<FaLinkedinIn />}
                />
                <SocialIcon href="https://twitter.com/yourprofile" icon={<FaTwitter />} />{" "}
                {/* Update Twitter if different from footer */}
                <SocialIcon href="https://github.com/saifuddinmonna" icon={<FaGithub />} />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <form ref={form} onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Name"
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
              <FormInput
                label="Email"
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
              <FormInput
                label="Phone"
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Your Phone Number (Optional)"
              />
              <FormInput
                label="Subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 px-4 rounded-md font-medium hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </motion.div>
  );
};

// Helper component for Info Items
const InfoItem = ({ icon, label, value, href }) => (
  <motion.div
    className="flex items-start space-x-4 group"
    whileHover={{ x: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex-shrink-0 text-cyan-500 dark:text-cyan-400 text-2xl mt-1 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{label}</h3>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {value}
        </a>
      ) : (
        <p className="text-gray-800 dark:text-white text-base">{value}</p>
      )}
    </div>
  </motion.div>
);

// Helper component for Social Icons
const SocialIcon = ({ href, icon }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-2xl p-2 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition-all duration-300"
    whileHover={{ scale: 1.2, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
  >
    {icon}
  </motion.a>
);

// Helper component for Form Inputs
const FormInput = ({ label, type, name, value, onChange, placeholder, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required={required}
      placeholder={placeholder}
    />
  </div>
);

export default ContactPage;
