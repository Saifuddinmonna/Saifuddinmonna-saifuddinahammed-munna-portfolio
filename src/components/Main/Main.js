import React from "react";
import { Outlet } from "react-router-dom";
import About from "../About/About";
import FotterPage from "../BodyDiv/FotterPage";
import HeaderPage from "../BodyDiv/HeaderPage";
import NavbarPage from "../BodyDiv/NavbarPage";

import StripedExample from "../BodyDiv/SkillProgressbar";
import ContractMe from "../ContractMe/ContractMe";
import MyPortfolios from "../MyPortfolios/MyPortfolios";
import MyServices from "../Myservices/MyServices";
import NavbarPage2 from "../NavbarPage/NavbarPage2";

const Main = () => {
	return (
		<div>
			{/* <h1>this is main page</h1> */}
			<NavbarPage2></NavbarPage2>
			{/* <NavbarPage></NavbarPage> */ }
			<Outlet></Outlet>
			<HeaderPage></HeaderPage>
			<MyPortfolios></MyPortfolios>
			<MyServices></MyServices>
			<StripedExample></StripedExample>
			<ContractMe></ContractMe>
			<FotterPage></FotterPage>
			
		</div>
	);
};

export default Main;
