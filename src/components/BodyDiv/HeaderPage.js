import React from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import Typewriter from "typewriter-effect";



const HeaderPage = () => {
	return (
		<div className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-104 hover:opacity-95 duration-300">
			<div className="bg-gradient-to-r  from-cyan-500 to-blue-500 border rounded-2xl m-3 p-3">
				<div className="  ">
					<div className="flex items-center justify-around flex-col lg:flex-row-reverse">
						<img
							src="images/profile1.png"
							className="mask mask-hexagon max-h-96  rounded-lg shadow-2xl"
							alt="pic of saifuddin ahammed munna"
						/>
						<div className="p-3 m-3">
							<h3 className="text-5xl font-bold">
								Saifuddin Ahammed Munna
							</h3>
							<h3 className="text-3xl font-bold">
								<Typewriter
									options={{
										strings: [
											"I am a full stack web developer ",
										],
										autoStart: true,
										loop: true,
										delay: 150,
									}}
								/>
							</h3>
							<h3 className="py-6  font-bold">
								<Typewriter
									options={{
										strings: ["Proficiency in MERN Stack"],
										autoStart: true,
										loop: true,
									}}
								/>
							</h3>
							<div className="mb-8">
								<p className=" font-bold ">
									I can develop both client-side and
									server-side
								</p>
								<p className=" font-bold"></p>
							</div>
							<div>
								<a
									target="_blank"
									href="https://drive.google.com/open?id=154ZAjEGKPwBAw_wZe0Ij102ZSx_GR4UL&authuser=0&usp=drive_link"
									rel="noreferrer">
									<button className="btn btn-primary m-2">
										View My CV
									</button>
								</a>
								<a
									target="_blank"
									href="https://drive.google.com/open?id=1GbxWekJ71boptGWrsCinZWxOPRHeOvSO&authuser=0&usp=drive_link"
									rel="noreferrer">
									<button className="btn btn-primary m-2">
										View My Resume
									</button>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="container-fluid nav-section m-1">
				<div className="nav-container m-auto">
					<a
						href="https://saifuddinmonna.github.io./EnglishClub/"
						target="_blank"
						rel="noreferrer">
						Website
					</a>
					<a
						href="https://www.linkedin.com/in/saifuddin-ahammed-monna-67ba1849/"
						target="_blank"
						rel="noreferrer">
						LinkedIn
					</a>
					<a
						href="https://github.com/Saifuddinmonna"
						target="_blank"
						rel="noreferrer">
						GitHub
					</a>
					<a
						href="https://www.facebook.com/ahammed.rafayel"
						target="_blank"
						rel="noreferrer">
						Facebook Page
					</a>
					<a
						href="tel:+8801623361191"
						target="_blank"
						rel="noreferrer">
						Phone
					</a>
					<a
						href="mailto:saifuddinmonna@gmail.com"
						target="_blank"
						rel="noreferrer">
						Email
					</a>

					<a
						href={"_resume of Saifuddin Ahammed Monna.pdf"}
						download="">
						Download Resume
					</a>
					<a href={"cv for Saifuddin Ahammed Monna.pdf"} download="">
						Download CV
					</a>
				</div>
			</div>

			<section class=" container location-container my-5"></section>
		</div>
	);
};

export default HeaderPage;
