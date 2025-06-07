import React, { useState, useEffect, useRef, useContext } from "react";
import { Helmet } from "react-helmet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaGithub, FaComments } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { ThemeContext } from "../App";
import { useChat } from "../context/ChatContext";

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
  const { isDarkMode } = useContext(ThemeContext);
  const { openChat } = useChat();
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
      className="min-h-screen bg-[var(--background-default)] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
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
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] transition-colors duration-300">
              Get in Touch
            </h1>
            <button
              onClick={openChat}
              className="inline-flex items-center bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] text-white py-2 px-4 rounded-lg font-medium hover:from-[var(--primary-dark)] hover:to-[var(--secondary-dark)] transition-all duration-300 text-sm"
            >
              <FaComments className="mr-2" /> Live Chat
            </button>
          </div>
          <p className="text-lg text-[var(--text-secondary)] transition-colors duration-300">
            Have a question or want to work together?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-[var(--background-paper)] dark:bg-[var(--background-elevated)] p-6 rounded-lg shadow-lg transition-colors duration-300">
            <div className="space-y-6">
              <InfoItem icon={<MapPinIcon />} label="Address" value="Dhaka, Bangladesh" />
              <InfoItem
                icon={<PhoneIcon />}
                label="Phone"
                value="+8801623361191"
                href="tel:+8801623361191"
              />
              <InfoItem
                icon={<EnvelopeIcon />}
                label="Email"
                value="Saifuddinmonna@gmail.com"
                href="mailto:Saifuddinmonna@gmail.com"
              />
              <InfoItem
                icon={<ClockIcon />}
                label="Working Hours"
                value="Sat - Thu, 10:00 AM - 7:00 PM (Flexible for projects)"
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)] transition-colors duration-300">
                Follow Me
              </h3>
              <div className="flex space-x-4">
                <SocialIcon
                  href="https://www.facebook.com/ahammed.rafayel/"
                  icon={<FaFacebookF />}
                />
                <SocialIcon
                  href="https://www.linkedin.com/in/saifuddin-ahammed-monna/"
                  icon={<FaLinkedinIn />}
                />
                <SocialIcon href="https://twitter.com/yourprofile" icon={<FaTwitter />} />
                <SocialIcon href="https://github.com/saifuddinmonna" icon={<FaGithub />} />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[var(--background-paper)] dark:bg-[var(--background-elevated)] p-6 rounded-lg shadow-lg transition-colors duration-300">
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
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-2 transition-colors duration-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[var(--border-main)] rounded-lg focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent bg-[var(--background-default)] text-[var(--text-primary)] transition-colors duration-300"
                  placeholder="Your message..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] text-white py-3 px-6 rounded-lg font-medium hover:from-[var(--primary-dark)] hover:to-[var(--secondary-dark)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </motion.div>
  );
};

const InfoItem = ({ icon, label, value, href }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary-main)] to-[var(--secondary-main)] text-white">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300">
        {label}
      </h3>
      {href ? (
        <a
          href={href}
          className="text-[var(--text-primary)] hover:text-[var(--primary-main)] transition-colors duration-300"
        >
          {value}
        </a>
      ) : (
        <p className="text-[var(--text-primary)] transition-colors duration-300">{value}</p>
      )}
    </div>
  </div>
);

const SocialIcon = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--background-default)] text-[var(--text-primary)] hover:bg-[var(--primary-main)] hover:text-white transition-all duration-300"
  >
    {icon}
  </a>
);

const FormInput = ({ label, type, name, value, onChange, placeholder, required }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-[var(--text-primary)] mb-2 transition-colors duration-300"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-[var(--border-main)] rounded-lg focus:ring-2 focus:ring-[var(--primary-main)] focus:border-transparent bg-[var(--background-default)] text-[var(--text-primary)] transition-colors duration-300"
    />
  </div>
);

export default ContactPage;
