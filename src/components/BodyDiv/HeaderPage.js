import React from "react";
import "./Main.css";
// import  {profiel} "../../../public/profile.jpg";
const HeaderPage = () => {
	return (
		<div className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:opacity-95 duration-300">
			<div className="bg-gradient-to-r  from-cyan-500 to-blue-500 border rounded-2xl m-4 p-4">
				<div className="  ">
					<div className="flex items-center justify-around flex-col lg:flex-row-reverse">
						<img
							src={"profile.jpg"}
							className="mask mask-hexagon max-h-96  rounded-lg shadow-2xl"
						/>
						<div className="p-3 m-3">
							<h1 className="text-5xl font-bold">
								Saifuddin Ahammed Munna
							</h1>
							<p className="py-6">
								I am a full stack web developer .
							</p>
							<p className="py-6">
								I can develop both client and server software.
							</p>

							<p>
								Full stack Javascript development. Proficiency
								in MERN Stack
							</p>
							<button className="btn btn-primary">
								View My CV
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="container-fluid nav-section">
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
						href={"resume-of-Saifuddin-Ahammed-Monna2.pdf"}
						download="">
						Download Resume
					</a>
				</div>
			</div>

			<section class=" container location-container my-5"></section>
		</div>
	);
};

export default HeaderPage;
