import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./NavbarPage.css";

function NavbarPage2() {
	const navRef = useRef();

	const showNavbar = () => {
		navRef.current.classList.toggle("responsive_nav");
	};

	return (
		<header className="sticky w-full  top-0 left-0 right-0 ">
			<h3 className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl dark:text-white">
				LOGO
			</h3>
			<nav className="" ref={navRef}>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl dark:text-white"
					to="/#">
					Home
				</NavLink>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl dark:text-white"
					to="/portfoliolayout">
					My work
				</NavLink>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl dark:text-white"
					to="/blog">
					Blog
				</NavLink>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl dark:text-white"
					to="/about">
					About me
				</NavLink>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl dark:text-white"
					to="/contractme">
					Contract me
				</NavLink>
				{/* <NavLink to="/#/ContractMe">Contract me</NavLink> */}
				<button className="nav-btn nav-close-btn" onClick={showNavbar}>
					<FaTimes />
				</button>
			</nav>
			<button className="nav-btn" onClick={showNavbar}>
				<FaBars />
			</button>
		</header>
	);
}

export default NavbarPage2;
