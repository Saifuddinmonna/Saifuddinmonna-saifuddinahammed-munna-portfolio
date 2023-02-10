import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./NavbarPage.css";

function NavbarFooter() {
	return (
		<div className=" my-5 rounded-2x border">
			<div className=" mx-28 bg-gradient-to-r  from-cyan-500 to-blue-500 border fixed w-full bottom-0   mx-auto flex justify-evenly pb-2 text-decoration-none ">
				<NavLink
					className=" text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl black:text-white white:text-dark text-decoration-none  "
					to="/#">
					Home
				</NavLink>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl black:text-white white:text-dark text-decoration-none  "
					to="/portfoliolayout">
					My work
				</NavLink>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl black:text-white white:text-dark text-decoration-none  "
					to="/blog">
					Blog
				</NavLink>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl black:text-white white:text-dark text-decoration-none  "
					to="/about">
					About me
				</NavLink>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-2xl black:text-white white:text-dark text-decoration-none  "
					to="/contractme">
					Contract me
				</NavLink>
			</div>
		</div>
	);
}

export default NavbarFooter;
