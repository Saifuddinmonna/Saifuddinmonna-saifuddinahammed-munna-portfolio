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
		<header className="sticky w-full  ">
			<h3>LOGO</h3>
			<nav className="" ref={navRef}>
				<NavLink to="/#">Home</NavLink>
				<NavLink to="/portfoliolayout">My work</NavLink>
				<NavLink to="/blog">Blog</NavLink>
				<NavLink to="/about">About me</NavLink>
				<NavLink to="/contractme">Contract me</NavLink>
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
