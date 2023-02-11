import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./NavbarPage.css";

function NavbarFooter() {
	return (
		<div className="fixed  bottom-0  mx-auto   w-full  rounded-xl border">
			<div className="  rounded-xl  bg-gradient-to-r  w-full from-cyan-500 to-blue-500 border flex justify-evenly pb-2 text-decoration-none ">
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
