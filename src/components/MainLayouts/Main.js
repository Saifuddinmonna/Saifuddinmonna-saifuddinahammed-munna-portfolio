import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactConfetti from "react-confetti";
import { Outlet } from "react-router-dom";
import About from "../About/About";
import FotterPage from "../BodyDiv/FotterPage";
import HeaderPage from "../BodyDiv/HeaderPage";
import NavbarPage from "../BodyDiv/NavbarPage";

import SkillProgressbar from "../BodyDiv/SkillProgressbar";
import ContractMe from "../ContractMe/ContractMe";
import MyPortfolios from "../MyPortfolios/MyPortfolios";
import MyServices from "../Myservices/MyServices";
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
		<div>
			{/* <h1>this is main page</h1> */}
			<NavbarPage2 className="z-20"></NavbarPage2>
			{/* <NavbarPage></NavbarPage> */}
			{confettiStart && <ReactConfetti />}
			<Outlet></Outlet>
			<HeaderPage></HeaderPage>
			<MyPortfolios className="z-1"></MyPortfolios>
			<MyServices></MyServices>
			<SkillProgressbar></SkillProgressbar>
			<ContractMe></ContractMe>
			<FotterPage></FotterPage>
		</div>
	);
};

export default Main;