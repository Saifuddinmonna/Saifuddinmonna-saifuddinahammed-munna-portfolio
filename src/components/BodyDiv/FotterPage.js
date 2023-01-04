import React from "react";
import { NavLink } from "react-router-dom";

const FotterPage = () => {
	return (
		<div className=" text-strong ">
			<footer class="m-4 py-4 text-center text-strong rounded-xl mt-5 bg-gradient-to-r from-cyan-500 to-blue-500">
				<div class="social-icon-container text-strong text-decoration-none text-center ">
					<a
						target="_blank"
						href="https://saifuddinmonna.github.io./EnglishClub/index.html"
						targer="_blank"
						className=" fs-6 text-strong text-darktext-decoration-none d-block footer-text"
						rel="noreferrer">
						Website: English Club
					</a>
					<a
						target="_blank"
						href="https://www.facebook.com/ahammed.rafayel/"
						rel="noreferrer">
						<i class="fa-brands fa-facebook"></i>
					</a>

					<a
						target="_blank"
						href="https://www.linkedin.com/feed/?trk=homepage-basic_google-one-tap-submit"
						rel="noreferrer">
						<i class="fa-brands fa-linkedin"></i>
					</a>

					<a
						target="_blank"
						href="https://twitter.com/?lang=en"
						rel="noreferrer">
						<i class="fa-brands fa-twitter"></i>
					</a>
				</div>
				<div>
					<p class="footer-text">
						Edited with &hearts; by Sifuddin Ahammed Monna
					</p>
					<p class="footer-copywrite">Copyright &copy;2022</p>
				</div>
			</footer>
		</div>
	);
};

export default FotterPage;
