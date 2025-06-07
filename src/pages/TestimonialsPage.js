import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../App";
import {
  FaQuoteLeft,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaCode,
  FaLaptop,
  FaMobile,
  FaServer,
  FaTools,
  FaUserPlus,
} from "react-icons/fa";

const testimonials = [
  // Original 4 for context (can be removed if not needed in final output)
  {
    id: 1,
    name: "John Doe",
    role: "Senior Developer",
    company: "Tech Solutions Inc.",
    image: "/images/testimonials/person1.jpg",
    rating: 5,
    text: "Working with Saifuddin was an absolute pleasure. His attention to detail and problem-solving skills are exceptional. He delivered the project on time and exceeded our expectations.",
    date: "March 2024",
    services: "Custom Web Application Development", // Added service for original
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Project Manager",
    company: "Digital Innovations",
    image: "/images/testimonials/person2.jpg",
    rating: 5,
    text: "Saifuddin's technical expertise and communication skills made our collaboration smooth and efficient. He consistently delivered high-quality work and was always available to help.",
    date: "February 2024",
    services: "E-commerce Platform Integration", // Added service for original
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "CEO",
    company: "StartupX",
    image: "/images/testimonials/person3.jpg",
    rating: 5,
    text: "We hired Saifuddin for our web development project, and he did an outstanding job. His ability to understand requirements and implement them perfectly is remarkable.",
    date: "January 2024",
    services: "MVP Development for Startup", // Added service for original
  },
  {
    id: 4,
    name: "Emily Brown",
    role: "Marketing Director",
    company: "Growth Marketing",
    image: "/images/testimonials/person4.jpg",
    rating: 5,
    text: "Saifuddin's work on our website redesign was exceptional. He not only met all our requirements but also provided valuable suggestions that improved the overall user experience.",
    date: "December 2023",
    services: "Corporate Website Redesign", // Added service for original
  },

  // --- 20 Testimonials from Bangladesh ---
  {
    id: 5,
    name: "Fatima Ahmed",
    role: "Founder",
    company: "Sheba Digital Services",
    image: "/images/testimonials/bd-person1.jpg",
    rating: 5,
    text: "Saifuddin built our entire service booking platform from scratch. His dedication and problem-solving skills are top-notch. Our customers love the new site!",
    date: "April 2024",
    services: "Service Booking Platform Development",
  },
  {
    id: 6,
    name: "Rahman Khan",
    role: "Managing Director",
    company: "BD Exports Ltd.",
    image: "/images/testimonials/bd-person2.jpg",
    rating: 4,
    text: "The e-commerce solution Saifuddin developed has significantly boosted our online sales. Very professional and delivered on time.",
    date: "March 2024",
    services: "B2B E-commerce Portal",
  },
  {
    id: 7,
    name: "Aisha Islam",
    role: "Project Coordinator",
    company: "Educate Bangladesh Foundation",
    image: "/images/testimonials/bd-person3.jpg",
    rating: 5,
    text: "Saifuddin developed an outstanding educational portal for us. He was patient with our changing requirements and delivered a fantastic product.",
    date: "May 2024",
    services: "Educational Web Portal",
  },
  {
    id: 8,
    name: "Kamal Hossain",
    role: "Owner",
    company: "Dhaka Fresh Produce",
    image: "/images/testimonials/bd-person4.jpg",
    rating: 5,
    text: "Our online grocery delivery website, built by Saifuddin, is intuitive and fast. He understood our local market needs perfectly.",
    date: "February 2024",
    services: "Online Grocery Store Development",
  },
  {
    id: 9,
    name: "Nadia Chowdhury",
    role: "Marketing Head",
    company: "Chittagong Crafts",
    image: "/images/testimonials/bd-person5.jpg",
    rating: 5,
    text: "Saifuddin's design for our artisan marketplace website is beautiful and user-friendly. He brought our vision to life!",
    date: "January 2024",
    services: "Artisan E-commerce Marketplace",
  },
  {
    id: 10,
    name: "Salim Reza",
    role: "CEO",
    company: "BD Tech Innovators",
    image: "/images/testimonials/bd-person6.jpg",
    rating: 5,
    text: "For our custom software solution, Saifuddin's technical skills were invaluable. He developed a robust and scalable internal tool for us.",
    date: "April 2024",
    services: "Custom Internal Software Development",
  },
  {
    id: 11,
    name: "Sumaiya Akter",
    role: "Operations Manager",
    company: "Sylhet Tours & Travels",
    image: "/images/testimonials/bd-person7.jpg",
    rating: 4,
    text: "The tour booking website Saifuddin created has streamlined our operations significantly. Good communication throughout the project.",
    date: "December 2023",
    services: "Tour Booking Website",
  },
  {
    id: 12,
    name: "Tariqul Islam",
    role: "Freelance Consultant",
    company: "Self-Employed",
    image: "/images/testimonials/bd-person8.jpg",
    rating: 5,
    text: "Saifuddin designed and developed my professional portfolio website. It looks amazing and has helped me attract more clients.",
    date: "November 2023",
    services: "Personal Portfolio Website",
  },
  {
    id: 13,
    name: "Farhana Yasmin",
    role: "Director",
    company: "Agrani Mohila Somobay Samity",
    image: "/images/testimonials/bd-person9.jpg",
    rating: 5,
    text: "He developed a micro-finance management system for our cooperative. It's very user-friendly and has improved our efficiency.",
    date: "March 2024",
    services: "Micro-finance Management System",
  },
  {
    id: 14,
    name: "Abdullah Al Mamun",
    role: "IT Head",
    company: "National Garments Ltd.",
    image: "/images/testimonials/bd-person10.jpg",
    rating: 5,
    text: "Saifuddin helped us develop an internal inventory management system. His solutions are always well-thought-out and effective.",
    date: "May 2024",
    services: "Inventory Management System",
  },
  {
    id: 15,
    name: "Jannatul Ferdous",
    role: "Blogger & Influencer",
    company: "Deshi Food Tales",
    image: "/images/testimonials/bd-person11.jpg",
    rating: 5,
    text: "My food blog, designed by Saifuddin, is stunning! He perfectly captured the aesthetic I wanted and made it very easy to manage.",
    date: "February 2024",
    services: "Food Blog Design and Development",
  },
  {
    id: 16,
    name: "Mustafa Kamal",
    role: "Pharmacist & Owner",
    company: "Arogga Pharmacy Online",
    image: "/images/testimonials/bd-person12.jpg",
    rating: 5,
    text: "Saifuddin developed our online pharmacy platform. It's secure, compliant, and user-friendly. A true professional.",
    date: "January 2024",
    services: "Online Pharmacy Platform",
  },
  {
    id: 17,
    name: "Roksana Begum",
    role: "Social Entrepreneur",
    company: "Gram Unnayan Kendra",
    image: "/images/testimonials/bd-person13.jpg",
    rating: 5,
    text: "The website Saifuddin built for our NGO has helped us reach more donors and volunteers. His work is impactful.",
    date: "April 2024",
    services: "NGO Information and Donation Website",
  },
  {
    id: 18,
    name: "Anwar Parvez",
    role: "Real Estate Agent",
    company: "Dhaka Properties",
    image: "/images/testimonials/bd-person14.jpg",
    rating: 4,
    text: "Our property listing website developed by Saifuddin is quite comprehensive. It has all the features we asked for.",
    date: "December 2023",
    services: "Real Estate Listing Website",
  },
  {
    id: 19,
    name: "Ishrat Jahan",
    role: "Event Manager",
    company: "Celebrations BD",
    image: "/images/testimonials/bd-person15.jpg",
    rating: 5,
    text: "Saifuddin created a fantastic event management and ticketing website for us. It's made organizing events much smoother.",
    date: "November 2023",
    services: "Event Management & Ticketing Website",
  },
  {
    id: 20,
    name: "Zakir Hossain",
    role: "Academic Researcher",
    company: "University Research Group",
    image: "/images/testimonials/bd-person16.jpg",
    rating: 5,
    text: "He developed a custom data visualization tool for our research project. His ability to translate complex requirements into a working solution is commendable.",
    date: "March 2024",
    services: "Custom Data Visualization Tool",
  },
  {
    id: 21,
    name: "Tanvir Ahmed",
    role: "Owner",
    company: "BD Auto Parts",
    image: "/images/testimonials/bd-person17.jpg",
    rating: 5,
    text: "Saifuddin built an e-commerce site for our auto parts business. It's easy to navigate and manage inventory. Sales have increased!",
    date: "May 2024",
    services: "Auto Parts E-commerce Website",
  },
  {
    id: 22,
    name: "Sabina Yesmin",
    role: "Fashion Designer",
    company: "Deshi Trends Boutique",
    image: "/images/testimonials/bd-person18.jpg",
    rating: 5,
    text: "My online boutique website, created by Saifuddin, is elegant and perfectly showcases my designs. I'm thrilled with the result!",
    date: "February 2024",
    services: "Fashion Boutique E-commerce Site",
  },
  {
    id: 23,
    name: "Mahmudul Hasan",
    role: "Restaurant Owner",
    company: "Kacchi Bhai Restaurant",
    image: "/images/testimonials/bd-person19.jpg",
    rating: 4,
    text: "Saifuddin developed our restaurant's website with an online ordering system. It's helped us manage takeaways more efficiently.",
    date: "January 2024",
    services: "Restaurant Website with Online Ordering",
  },
  {
    id: 24,
    name: "Afroza Khatun",
    role: "Principal",
    company: "Sunshine Model School",
    image: "/images/testimonials/bd-person20.jpg",
    rating: 5,
    text: "The new school website Saifuddin developed is informative and easy for parents and students to use. Excellent work!",
    date: "April 2024",
    services: "School Information Website",
  },

  // --- 20 Testimonials from Other Countries ---
  {
    id: 25,
    name: "Alex Müller",
    role: "Product Manager",
    company: "Innovatech GmbH (Germany)",
    image: "/images/testimonials/intl-person1.jpg",
    rating: 5,
    text: "Saifuddin's contribution to our SaaS platform's UI overhaul was significant. His eye for detail and modern design sense are impressive.",
    date: "May 2024",
    services: "SaaS Platform UI/UX Redesign",
  },
  {
    id: 26,
    name: "Priya Sharma",
    role: "Founder",
    company: "YogiWellness App (India)",
    image: "/images/testimonials/intl-person2.jpg",
    rating: 5,
    text: "He developed the backend for our wellness mobile application. Robust, scalable, and delivered within the agreed timeline. Highly skilled.",
    date: "March 2024",
    services: "Mobile App Backend Development",
  },
  {
    id: 27,
    name: "Kenji Tanaka",
    role: "E-commerce Manager",
    company: "Tokyo Gadgets Online (Japan)",
    image: "/images/testimonials/intl-person3.jpg",
    rating: 5,
    text: "Saifuddin helped us optimize our e-commerce checkout process, leading to a noticeable increase in conversion rates. Excellent work!",
    date: "April 2024",
    services: "E-commerce Checkout Optimization",
  },
  {
    id: 28,
    name: "Maria Rodriguez",
    role: "Artist & Gallery Owner",
    company: "Arte Creativo Gallery (Spain)",
    image: "/images/testimonials/intl-person4.jpg",
    rating: 5,
    text: "The online gallery website Saifuddin created for me is simply beautiful. It showcases my art perfectly and is easy for me to update.",
    date: "February 2024",
    services: "Online Art Gallery Website",
  },
  {
    id: 29,
    name: "David Lee",
    role: "Consultant",
    company: "Strategic Solutions Co. (USA)",
    image: "/images/testimonials/intl-person5.jpg",
    rating: 4,
    text: "Saifuddin developed a custom client portal for our consultancy. It's functional and meets our needs, good communication.",
    date: "January 2024",
    services: "Custom Client Portal Development",
  },
  {
    id: 30,
    name: "Aisha Ibrahim",
    role: "Non-Profit Director",
    company: "Global Aid Foundation (Kenya)",
    image: "/images/testimonials/intl-person6.jpg",
    rating: 5,
    text: "The donation platform Saifuddin built for our foundation is secure and user-friendly. We've seen an increase in online contributions.",
    date: "May 2024",
    services: "Non-Profit Donation Platform",
  },
  {
    id: 31,
    name: "Liam Wilson",
    role: "Travel Blogger",
    company: "Wanderlust Adventures (Australia)",
    image: "/images/testimonials/intl-person7.jpg",
    rating: 5,
    text: "Saifuddin revamped my travel blog with a fresh design and improved performance. My readers love it, and so do I!",
    date: "December 2023",
    services: "Travel Blog Redesign & Optimization",
  },
  {
    id: 32,
    name: "Sofia Petrova",
    role: "Small Business Owner",
    company: "EcoFriendly Goods (Canada)",
    image: "/images/testimonials/intl-person8.jpg",
    rating: 5,
    text: "Our new e-commerce store for sustainable products, built by Saifuddin, is fantastic. He really understood our brand ethos.",
    date: "November 2023",
    services: "Sustainable Products E-commerce Site",
  },
  {
    id: 33,
    name: "Omar Hassan",
    role: "Tech Lead",
    company: "Innovate ME Solutions (UAE)",
    image: "/images/testimonials/intl-person9.jpg",
    rating: 5,
    text: "Saifuddin's expertise in developing a complex API for our project was crucial. He is a reliable and skilled developer.",
    date: "March 2024",
    services: "Custom API Development",
  },
  {
    id: 34,
    name: "Isabelle Dubois",
    role: "Chef & Restaurateur",
    company: "Le Petit Bistro (France)",
    image: "/images/testimonials/intl-person10.jpg",
    rating: 5,
    text: "He created a charming website for my bistro, complete with online reservations. It perfectly captures the ambiance of my restaurant.",
    date: "April 2024",
    services: "Restaurant Website with Online Reservations",
  },
  {
    id: 35,
    name: "Ricardo Silva",
    role: "Educational Coordinator",
    company: "Learn Online Institute (Brazil)",
    image: "/images/testimonials/intl-person11.jpg",
    rating: 5,
    text: "The learning management system (LMS) module Saifuddin developed for us is intuitive for both students and instructors.",
    date: "February 2024",
    services: "Learning Management System Module",
  },
  {
    id: 36,
    name: "Chloe Williams",
    role: "Marketing Manager",
    company: "UK Property Finders (UK)",
    image: "/images/testimonials/intl-person12.jpg",
    rating: 4,
    text: "Saifuddin built a comprehensive property search portal for us. It's feature-rich and generally performs well.",
    date: "January 2024",
    services: "Property Search Portal Development",
  },
  {
    id: 37,
    name: "Chen Wei",
    role: "Startup Founder",
    company: "ConnectAsia Tech (Singapore)",
    image: "/images/testimonials/intl-person13.jpg",
    rating: 5,
    text: "For our networking platform MVP, Saifuddin delivered quality code quickly. His ability to adapt to new requirements was impressive.",
    date: "May 2024",
    services: "Social Networking Platform MVP",
  },
  {
    id: 38,
    name: "Fatima Al-Sayed",
    role: "Community Organizer",
    company: "Local Events Hub (Egypt)",
    image: "/images/testimonials/intl-person14.jpg",
    rating: 5,
    text: "The community event listing website Saifuddin developed has become a central resource for our town. Great work!",
    date: "December 2023",
    services: "Community Event Listing Website",
  },
  {
    id: 39,
    name: "Marcus Johnson",
    role: "Fitness Coach",
    company: "FitLife Coaching (USA)",
    image: "/images/testimonials/intl-person15.jpg",
    rating: 5,
    text: "Saifuddin built my coaching website with a booking system for sessions. It's professional and makes managing clients easy.",
    date: "November 2023",
    services: "Coaching Website with Booking System",
  },
  {
    id: 40,
    name: "Olga Ivanova",
    role: "Scientific Researcher",
    company: "BioData Research Group (Russia)",
    image: "/images/testimonials/intl-person16.jpg",
    rating: 5,
    text: "He developed a specialized data entry and analysis tool for our research. Saifuddin's attention to detail was crucial for this project.",
    date: "March 2024",
    services: "Scientific Data Entry & Analysis Tool",
  },
  {
    id: 41,
    name: "Juan Pérez",
    role: "Musician",
    company: "Self-Employed (Mexico)",
    image: "/images/testimonials/intl-person17.jpg",
    rating: 5,
    text: "Saifuddin created a fantastic website for my band, including music streaming and tour dates. It really captures our vibe!",
    date: "April 2024",
    services: "Musician/Band Website with Streaming",
  },
  {
    id: 42,
    name: "Grace O'Connell",
    role: "Book Author",
    company: "Self-Published (Ireland)",
    image: "/images/testimonials/intl-person18.jpg",
    rating: 5,
    text: "My author website, designed by Saifuddin, is elegant and effectively promotes my books. He was a pleasure to work with.",
    date: "February 2024",
    services: "Author Website and Blog",
  },
  {
    id: 43,
    name: "Khaled Al-Fahim",
    role: "CEO",
    company: "Desert Logistics Solutions (Saudi Arabia)",
    image: "/images/testimonials/intl-person19.jpg",
    rating: 4,
    text: "Saifuddin developed a logistics tracking portal for us. It's a complex system, and he managed to deliver a working solution.",
    date: "January 2024",
    services: "Logistics Tracking Portal",
  },
  {
    id: 44,
    name: "Sun Hee Park",
    role: "Online Language Tutor",
    company: "Global Lingua (South Korea)",
    image: "/images/testimonials/intl-person20.jpg",
    rating: 5,
    text: "The platform Saifuddin built for my online tutoring services, with video call integration, is excellent. My students find it very easy to use.",
    date: "May 2024",
    services: "Online Tutoring Platform with Video",
  },
];

const TestimonialsPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
    rating: 5,
    image: null,
    service: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [imagePreview, setImagePreview] = useState(null);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: direction => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: direction => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setNewComment({ ...newComment, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCommentSubmit = async e => {
    e.preventDefault();

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", newComment.name);
    formData.append("comment", newComment.comment);
    formData.append("rating", newComment.rating);
    formData.append("service", newComment.service);
    formData.append("date", newComment.date);

    // Optional fields
    if (newComment.email) formData.append("email", newComment.email);
    if (newComment.phone) formData.append("phone", newComment.phone);
    if (newComment.image) formData.append("image", newComment.image);

    try {
      // Here you would send the formData to your backend
      // const response = await fetch('/api/testimonials', {
      //   method: 'POST',
      //   body: formData
      // });

      console.log("Form data to be sent:", Object.fromEntries(formData));

      // Reset form
      setShowCommentForm(false);
      setNewComment({
        name: "",
        email: "",
        phone: "",
        comment: "",
        rating: 5,
        image: null,
        service: "",
        date: new Date().toISOString().split("T")[0],
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
    }
  };

  const serviceIcons = {
    "Web Development": <FaCode className="w-6 h-6" />,
    "UI/UX Design": <FaLaptop className="w-6 h-6" />,
    "Mobile Development": <FaMobile className="w-6 h-6" />,
    "Backend Development": <FaServer className="w-6 h-6" />,
    "Custom Solutions": <FaTools className="w-6 h-6" />,
    Consulting: <FaUserPlus className="w-6 h-6" />,
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      } transition-colors duration-300`}
    >
      <Helmet>
        <title>Testimonials | Saifuddin Ahammed Monna</title>
        <meta
          name="description"
          content="Read what clients and colleagues say about working with Saifuddin Ahammed Monna."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Client Testimonials
          </h1>
          <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            What people say about working with me
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Testimonial Carousel */}
          <div className="relative">
            <div className="relative max-w-4xl mx-auto">
              {/* Navigation Buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaChevronLeft className="text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaChevronRight className="text-gray-600 dark:text-gray-300" />
              </button>

              {/* Testimonial Carousel */}
              <div className="relative h-[500px] overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute w-full"
                  >
                    <div
                      className={`p-8 rounded-2xl ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } shadow-xl`}
                    >
                      <div className="flex flex-col md:flex-row gap-8">
                        {/* Image Section */}
                        <div className="w-full md:w-1/3">
                          <div className="relative">
                            <div className="aspect-square rounded-xl overflow-hidden">
                              <img
                                src={testimonials[currentIndex].image}
                                alt={testimonials[currentIndex].name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                              <FaQuoteLeft className="text-white text-2xl" />
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-2/3">
                          <div className="flex items-center gap-2 mb-4">
                            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                              <FaStar key={i} className="text-yellow-400" />
                            ))}
                          </div>
                          <p
                            className={`text-lg mb-6 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {testimonials[currentIndex].text}
                          </p>
                          <div className="mb-4">
                            <h3
                              className={`text-xl font-semibold ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {testimonials[currentIndex].name}
                            </h3>
                            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {testimonials[currentIndex].role} at{" "}
                              {testimonials[currentIndex].company}
                            </p>
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              {testimonials[currentIndex].date}
                            </p>
                          </div>
                          <div className="mt-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm ${
                                isDarkMode
                                  ? "bg-blue-900 text-blue-200"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {testimonials[currentIndex].services}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dots Navigation */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex
                        ? "bg-blue-500"
                        : isDarkMode
                        ? "bg-gray-600"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Customer Comments Section */}
          <div className="space-y-6">
            <h2
              className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              Recent Customer Comments
            </h2>

            <div className="space-y-4">
              {testimonials.slice(0, 4).map(testimonial => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 w-4 h-4" />
                        ))}
                      </div>
                      <p
                        className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {testimonial.text}
                      </p>
                      <div>
                        <h4
                          className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                        >
                          {testimonial.name}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {testimonial.role} at {testimonial.company}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 mt-2 rounded-full text-xs ${
                            isDarkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {testimonial.services}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All Comments Button */}
            <div className="text-center mt-6">
              <button
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                } text-sm font-medium transition-colors`}
              >
                View All Comments
              </button>
            </div>
          </div>
        </div>

        {/* Add Comment Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setShowCommentForm(true)}
            className={`px-6 py-3 rounded-full ${
              isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            } text-white font-medium transition-colors`}
          >
            Share Your Experience
          </button>
        </div>

        {/* Comment Form Modal */}
        {showCommentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`w-full max-w-md p-6 rounded-xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                Share Your Experience
              </h2>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                {/* Required Fields */}
                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newComment.name}
                    onChange={e => setNewComment({ ...newComment, name: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Service <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newComment.service}
                    onChange={e => setNewComment({ ...newComment, service: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewComment({ ...newComment, rating })}
                        className={`p-2 rounded-lg ${
                          newComment.rating === rating
                            ? "bg-yellow-400 text-white"
                            : isDarkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Your Comment <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newComment.comment}
                    onChange={e => setNewComment({ ...newComment, comment: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    rows="4"
                    required
                  />
                </div>

                {/* Optional Fields */}
                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={newComment.email}
                    onChange={e => setNewComment({ ...newComment, email: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={newComment.phone}
                    onChange={e => setNewComment({ ...newComment, phone: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Profile Picture (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCommentForm(false)}
                    className={`px-4 py-2 rounded-lg ${
                      isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPage;
