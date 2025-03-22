import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactConfetti from "react-confetti";
import { Outlet } from "react-router-dom";
import About from "../About/About";
import Footer from "../BodyDiv/Footer";
import { motion, useScroll, useSpring } from "framer-motion";

import HeaderPage from "../BodyDiv/HeaderPage";

import SkillProgressbar from "../BodyDiv/SkillProgressbar";
import ContractMe from "../ContractMe/ContractMe";
import MyPortfolios from "../MyPortfolios/MyPortfolios";
import MyServices from "../Myservices/MyServices";
import NavbarPage2 from "../NavbarPage/NavbarPage2";
import "./Main.css";

const Main = () => {
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress);
	const [confettiStart, setConfettiStart] = useState(true);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setConfettiStart(false);
		}, 8000);
	}, []);

	return (
		<div className="min-h-window">
			<NavbarPage2 className=" sticky top-0 z-50 w-full "></NavbarPage2>
			<motion.div
				className="progress-bar mx-3 rounded-xl"
				style={{ scaleX: scrollYProgress }}
			/>
			{confettiStart && <ReactConfetti />}
			<Outlet></Outlet>
			<Footer></Footer>
		</div>
	);
};

export default Main;
