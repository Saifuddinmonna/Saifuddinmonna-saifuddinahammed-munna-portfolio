import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./NavbarPage.css";

function NavbarFooter() {
	return (
		<div className="sticky App max-w-[1440px] mx-auto  bottom-1 mx-3 w-full   rounded-lg ">
			<div className=" mx-4 rounded-lg  flex  bg-gradient-to-r  from-cyan-500 to-blue-500 border flex justify-evenly pb-1 text-decoration-none ">
				<NavLink
					className=" text-xl font-semibold text-center text-gray-800 capitalize lg:text-xl black:text-white white:text-dark text-decoration-none text-sm "
					to="/#">
					Home
				</NavLink>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-xl black:text-white white:text-dark text-decoration-none text-sm  "
					to="/portfoliolayout">
					My work
				</NavLink>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-xl black:text-white white:text-dark text-decoration-none text-sm "
					to="/blog">
					Blog
				</NavLink>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-xl black:text-white white:text-dark text-decoration-none text-sm "
					to="/about">
					About me
				</NavLink>
				<NavLink
					className="text-xl font-semibold text-center text-gray-800 capitalize lg:text-xl black:text-white white:text-dark text-decoration-none text-sm "
					to="/contractme">
					Contract me
				</NavLink>
			</div>
		</div>
	);
}

export default NavbarFooter;
