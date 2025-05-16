import React from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import Typewriter from "typewriter-effect";



const HeaderPage = () => {
	return (
		<div className="transition ease-in-out delay-150 mt-8 hover:-translate-y-1 hover:scale-104 hover:opacity-95 duration-300">
			<div className="bg-gradient-to-r from-cyan-500 to-blue-500 border rounded-2xl mx-2 md:mx-4 p-6 shadow-xl">
				<div className="">
					<div className="flex items-center justify-around flex-col lg:flex-row-reverse gap-8 lg:gap-12">
						<img
							src="images/profile1.png"
							className="mask mask-hexagon max-h-96 rounded-lg shadow-2xl"
							alt="pic of saifuddin ahammed munna"
						/>
						<div className="p-4 lg:p-6">
							<h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
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
			<div className="container-fluid nav-section mt-6">
				<div className="flex flex-wrap gap-3 justify-center px-2">
					<a
						href="https://github.com/Saifuddinmonna"
						target="_blank"
						rel="noreferrer"
						className="social-link flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg transform hover:scale-105 hover:bg-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
						<svg className="w-5 h-5 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path fillRule="evenodd" d="M16 8a6 6 0 01-6 6v-2a4 4 0 00-4-4H2v-4a6 6 0 016-6h2a4 4 0 014 4v2a6 6 0 016 6h2z" clipRule="evenodd" />
						</svg>
						<span className="font-medium group-hover:text-blue-200">GitHub</span>
					</a>
					<a
						href="https://www.linkedin.com/in/saifuddin-ahammed-monna-67ba1849/"
						target="_blank"
						rel="noreferrer"
						className="social-link flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg transform hover:scale-105 hover:bg-blue-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
						<svg className="w-5 h-5 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path fillRule="evenodd" d="M16 8a6 6 0 01-6 6v-2a4 4 0 00-4-4H2v-4a6 6 0 016-6h2a4 4 0 014 4v2a6 6 0 016 6h2z" clipRule="evenodd" />
						</svg>
						<span className="font-medium group-hover:text-blue-200">LinkedIn</span>
					</a>
					<a
						href="https://www.facebook.com/ahammed.rafayel"
						target="_blank"
						rel="noreferrer"
						className="social-link flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg transform hover:scale-105 hover:bg-blue-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
						<svg className="w-5 h-5 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
						</svg>
						<span className="font-medium group-hover:text-blue-200">Facebook</span>
					</a>
					<a
						href="https://saifuddinmonna.github.io./EnglishClub/"
						target="_blank"
						rel="noreferrer"
						className="social-link flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg transform hover:scale-105 hover:bg-green-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
						<svg className="w-5 h-5 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
						</svg>
						<span className="font-medium group-hover:text-green-200">Website</span>
					</a>
					<a
						href="tel:+8801623361191"
						target="_blank"
						rel="noreferrer"
						className="social-link flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg transform hover:scale-105 hover:bg-green-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
						<svg className="w-5 h-5 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
						</svg>
						<span className="font-medium group-hover:text-green-200">Phone</span>
					</a>
					<a
						href="mailto:saifuddinmonna@gmail.com"
						target="_blank"
						rel="noreferrer"
						className="social-link flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg transform hover:scale-105 hover:bg-red-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
						<svg className="w-5 h-5 group-hover:animate-ping" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
						<span className="font-medium group-hover:text-red-200">Email</span>
					</a>
					<a
						href={"_resume of Saifuddin Ahammed Monna.pdf"}
						download=""
						className="social-link flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg transform hover:scale-105 hover:bg-purple-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
						<svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<span className="font-medium group-hover:text-purple-200">Download Resume</span>
					</a>
					<a
						href={"cv for Saifuddin Ahammed Monna.pdf"}
						download=""
						className="social-link flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg transform hover:scale-105 hover:bg-purple-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
						<svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<span className="font-medium group-hover:text-purple-200">Download CV</span>
					</a>
				</div>
			</div>

			<section class=" container location-container my-5"></section>
		</div>
	);
};

export default HeaderPage;
