import React from "react";
import { NavLink } from "react-router-dom";

const FotterPage = () => {
	return (
		<div className=" text ">
			<footer class="m-4 py-4 text-center  rounded-xl mt-5 bg-gradient-to-r from-cyan-500 to-blue-500">
				<div class="social-icon-container text-decoration-none text-center ">
					<a
						
						onClick={ () => window.scrollTo(0, 0) }
						// target="_blank"
						// href="https://saifuddinmonna.github.io./EnglishClub/index.html"
						targer="_blank"
						className=" cursor-pointer fs-6 text-strong text-gray-300 text-bold text-decoration-none d-block footer-text"
						rel="noreferrer">
						Go Home
					</a>
					<div className="text-gray-300">
						<a
							className="px-2 text-2xl text-gray-300"
							target="_blank"
							href="https://www.facebook.com/ahammed.rafayel/"
							rel="noreferrer">
							<i class="fa-brands fa-facebook"></i>
						</a>

						<a
							className="px-2 text-2xl text-gray-300"
							target="_blank"
							href="https://www.linkedin.com/feed/?trk=homepage-basic_google-one-tap-submit"
							rel="noreferrer">
							<i class="fa-brands fa-linkedin"></i>
						</a>

						<a
							className="px-2 text-2xl text-gray-300"
							target="_blank"
							href="https://twitter.com/?lang=en"
							rel="noreferrer">
							<i class="fa-brands fa-twitter"></i>
						</a>
					</div>
				</div>
				<div>
					<p class="footer-text text-gray-300">
						Edited with &hearts; by Sifuddin Ahammed Monna
					</p>
					<p class="footer-copywrite text-gray-300">
						Copyright &copy;2022
					</p>
				</div>
			</footer>
		</div>
	);
};

export default FotterPage;
