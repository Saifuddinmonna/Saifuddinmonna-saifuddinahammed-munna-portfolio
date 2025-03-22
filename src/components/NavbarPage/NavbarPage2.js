import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./NavbarPage.css";

function NavbarPage2({ className }) {
	const navRef = useRef();

	const showNavbar = () => {
		navRef.current.classList.toggle("responsive_nav");
	};

	return (
		<div className={`${className} border-b-2 border-gray-300 pb-1 bg-white`}>
			<header className="mx-1 max-w-[1440px] mx-auto">
				<h3 className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl black:text-white white:text-dark">
					LOGO
				</h3>
				<nav className="" ref={navRef}>
					<NavLink
						className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl black:text-white white:text-dark"
						to="/#">
						Home
					</NavLink>
					<NavLink
						className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl black:text-white white:text-dark"
						to="/portfoliolayout">
						My work
					</NavLink>
					<NavLink
						className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl black:text-white white:text-dark"
						to="/blog">
						Blog
					</NavLink>
					<NavLink
						className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl black:text-white white:text-dark"
						to="/about">
						About me
					</NavLink>
					<NavLink
						className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl black:text-white white:text-dark"
						to="/contractme">
						Contract me
					</NavLink>
					{/* <NavLink to="/#/ContractMe">Contract me</NavLink> */}
					<button
						className="nav-btn nav-close-btn"
						onClick={showNavbar}>
						<FaTimes />
					</button>
				</nav>
				<button className="nav-btn" onClick={showNavbar}>
					<FaBars />
				</button>
			</header>
		</div>
	);
}

export default NavbarPage2;
