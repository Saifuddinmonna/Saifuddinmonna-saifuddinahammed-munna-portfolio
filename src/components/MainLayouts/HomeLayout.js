import React, { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";
import HeaderPage from "../BodyDiv/HeaderPage";
import About from "../About/About";
import SkillProgressbar from "../BodyDiv/SkillProgressbar";
import ContractMe from "../ContractMe/ContractMe";
import MyPortfolios from "../MyPortfolios/MyPortfolios";
import MyServicesv2 from "../Myservices/MyServicesv2";

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
			<div className="space-y-24">
				<HeaderPage />
				<About />
				<MyServicesv2 />
				<SkillProgressbar />
				<MyPortfolios />
				<ContractMe />
			</div>
			
			{/* Back to Top Button */}
			{showBackToTop && (
				<button
					onClick={scrollToTop}
					className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300"
					aria-label="Back to top"
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
				</button>
			)}
		</div>
	);
};

export default HomeLayout;
