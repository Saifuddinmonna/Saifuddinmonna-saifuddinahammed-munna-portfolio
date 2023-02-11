import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactConfetti from "react-confetti";
import { Outlet } from "react-router-dom";
import About from "../About/About";
import Footer from "../BodyDiv/Footer";

import HeaderPage from "../BodyDiv/HeaderPage";


import SkillProgressbar from "../BodyDiv/SkillProgressbar";
import ContractMe from "../ContractMe/ContractMe";
import MyPortfolios from "../MyPortfolios/MyPortfolios";
import MyServices from "../Myservices/MyServices";
import NavbarFooter from "../NavbarPage/NabvarFooter";
import NavbarPage2 from "../NavbarPage/NavbarPage2";

const Main = () => {
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
			{/* <h1>this is main page</h1> */}
			<NavbarPage2 className=""></NavbarPage2>
			{/* <NavbarPage></NavbarPage> */}
			{confettiStart && <ReactConfetti />}
			<Outlet></Outlet>
			<NavbarFooter className="relative fixed start-0 end-0 "></NavbarFooter>
			<Footer></Footer>
		</div>
	);
};

export default Main;
