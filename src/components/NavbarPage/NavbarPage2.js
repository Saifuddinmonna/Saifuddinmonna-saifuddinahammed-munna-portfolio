import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NavbarPage2 = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 10;
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [scrolled]);

	const handleContactClick = () => {
		navigate("/contact");
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	return (
		<nav className={`fixed w-full z-50 transition-all duration-300 ${
			scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white"
		}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Link 
							to="/" 
							className="flex-shrink-0 flex items-center group"
						>
							<span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text group-hover:from-blue-700 group-hover:to-cyan-600 transition-all duration-300">
								Portfolio
							</span>
						</Link>
					</div>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-6">
						<Link
							to="/"
							className={`relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-all duration-300 group ${
								isActive("/") ? "text-blue-600" : ""
							}`}
						>
							Home
							<span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
								isActive("/") ? "scale-x-100" : ""
							}`}></span>
						</Link>
						<Link
							to="/PortfolioLayout"
							className={`relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-all duration-300 group ${
								isActive("/my-work") ? "text-blue-600" : ""
							}`}
						>
							My Work
							<span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
								isActive("/my-work") ? "scale-x-100" : ""
							}`}></span>
						</Link>
						<Link
							to="/about"
							className={`relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-all duration-300 group ${
								isActive("/about") ? "text-blue-600" : ""
							}`}
						>
							About
							<span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
								isActive("/about") ? "scale-x-100" : ""
							}`}></span>
						</Link>
						<Link
							to="/blog"
							className={`relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-all duration-300 group ${
								isActive("/blog") ? "text-blue-600" : ""
							}`}
						>
							Blog
							<span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
								isActive("/blog") ? "scale-x-100" : ""
							}`}></span>
						</Link>
						<button
							onClick={handleContactClick}
							className="relative px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold overflow-hidden group"
						>
							<span className="relative z-10">Contact Me</span>
							<div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
							<div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 transform scale-x-100 group-hover:scale-x-0 transition-transform duration-300 origin-right"></div>
						</button>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-300"
						>
							<svg
								className="h-6 w-6 transform transition-transform duration-300"
								style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
								stroke="currentColor"
								fill="none"
								viewBox="0 0 24 24"
							>
								{isOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<div className={`md:hidden transition-all duration-300 ease-in-out ${
				isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
			} overflow-hidden`}>
				<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
					<Link
						to="/"
						className={`block px-3 py-2 text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2 ${
							isActive("/") ? "text-blue-600" : ""
						}`}
						onClick={() => setIsOpen(false)}
					>
						Home
					</Link>
					<Link
						to="/my-work"
						className={`block px-3 py-2 text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2 ${
							isActive("/my-work") ? "text-blue-600" : ""
						}`}
						onClick={() => setIsOpen(false)}
					>
						My Work
					</Link>
					<Link
						to="/about"
						className={`block px-3 py-2 text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2 ${
							isActive("/about") ? "text-blue-600" : ""
						}`}
						onClick={() => setIsOpen(false)}
					>
						About
					</Link>
					<Link
						to="/blog"
						className={`block px-3 py-2 text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2 ${
							isActive("/blog") ? "text-blue-600" : ""
						}`}
						onClick={() => setIsOpen(false)}
					>
						Blog
					</Link>
					<button
						onClick={() => {
							handleContactClick();
							setIsOpen(false);
						}}
						className="w-full mt-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
					>
						Contact Me
					</button>
				</div>
			</div>
		</nav>
	);
};

export default NavbarPage2;
