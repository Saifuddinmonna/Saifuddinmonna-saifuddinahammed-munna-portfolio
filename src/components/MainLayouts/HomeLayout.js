import React, { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";
import { motion } from "framer-motion"; // Import motion
import HeaderPage from "../BodyDiv/HeaderPage";
import About from "../About/About";
import SkillProgressbar from "../BodyDiv/SkillProgressbar";
import ContractMe from "../ContractMe/ContractMe";
import MyPortfolios from "../MyPortfolios/MyPortfolios";
import MyServicesv2 from "../Myservices/MyServicesv2";

// Animation variants for sections
const sectionVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

const HomeLayout = () => {
	const [confettiStart, setConfettiStart] = useState(true);
	const [showBackToTop, setShowBackToTop] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
		
		// Add smooth scroll behavior
		document.documentElement.style.scrollBehavior = "smooth";

		// Handle scroll for back to top button
		const handleScroll = () => {
			setShowBackToTop(window.scrollY > 400);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setConfettiStart(false);
		}, 5000); // Reduced from 8000 to 5000ms
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			{confettiStart && <ReactConfetti />}
			{/* We can wrap each section for individual animation */}
			<div className="space-y-24">
				{/* 1. Header/Hero Section */}
				<motion.div
					variants={sectionVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}>
					<HeaderPage />
				</motion.div>				
				{/* 2. About Section */}
				<motion.div
					variants={sectionVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}>
					<About />
				</motion.div>				
				{/* 3. Portfolio/Work Teaser Section */}
				<motion.div
					variants={sectionVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}>
					<MyPortfolios />
				</motion.div>				
				{/* 4. Services Section */}
				<motion.div
					variants={sectionVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}>
					<MyServicesv2 />
				</motion.div>				
				{/* 5. Skills Section */}
				<motion.div
					variants={sectionVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}>
					<SkillProgressbar />
				</motion.div>
				{/* 6. Contact Section */}
				<motion.div
					variants={sectionVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}>
					<ContractMe />
				</motion.div>
			</div>
			
			{/* Back to Top Button */}
			{showBackToTop && (
				<motion.button
					onClick={scrollToTop}
					className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
					aria-label="Back to top"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					whileHover={{ scale: 1.1, rotate: -5 }}
					whileTap={{ scale: 0.9 }}
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 10l7-7m0 0l7 7m-7-7v18"
						/>
					</svg>
				</motion.button>
			)}
		</div>
	);
};

export default HomeLayout;
