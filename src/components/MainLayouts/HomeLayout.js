import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactConfetti from "react-confetti";
import { Outlet } from "react-router-dom";
import About from "../About/About";

import HeaderPage from "../BodyDiv/HeaderPage";


import SkillProgressbar from "../BodyDiv/SkillProgressbar";
import ContractMe from "../ContractMe/ContractMe";
import MyPortfolios from "../MyPortfolios/MyPortfolios";
import MyServices from "../Myservices/MyServices";
import NavbarPage2 from "../NavbarPage/NavbarPage2";
import MyServicesv2 from "../Myservices/MyServicesv2";

const HomeLayout = () => {
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
		<div >
			{/* <h1>this is main page</h1> */}
			
			{/* <NavbarPage></NavbarPage> */}
			{confettiStart && <ReactConfetti />}
			<HeaderPage></HeaderPage>
			<MyPortfolios></MyPortfolios>
			<MyServices></MyServices>
			<SkillProgressbar></SkillProgressbar>
			<MyServicesv2></MyServicesv2>
			<ContractMe></ContractMe>
			
		</div>
	);
};

export default HomeLayout;
