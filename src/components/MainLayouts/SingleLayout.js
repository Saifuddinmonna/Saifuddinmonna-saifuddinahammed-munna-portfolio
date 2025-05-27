import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactConfetti from "react-confetti";
import { Outlet } from "react-router-dom";
import NavbarPage2 from "../BodyDiv/NavbarPage";
import SkillProgressbar from "../BodyDiv/SkillProgressbar";

import NavbarPage2 from "../NavbarPage/NavbarPage2";

const SingleLayout = () => {
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

		
			{confettiStart && <ReactConfetti />}
			<Outlet></Outlet>
		</div>
	);
};

export default SingleLayout;
