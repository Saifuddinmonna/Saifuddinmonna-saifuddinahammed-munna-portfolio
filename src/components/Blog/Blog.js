import React from 'react';
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import ReactConfetti from "react-confetti";
import { useState } from 'react';

const Blog = () => {
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
		<div className="m-3 rounded-x min-h-screen">
			{confettiStart && <ReactConfetti />}
			<div className="hero min-h-screen bg-base-200 rounded-xl">
				<div className="hero-content text-center">
					<div className="max-w-md">
						<h1 className="text-5xl font-bold">Comming Soon...</h1>
						<p className="py-6"></p>
						<Link to="/#">
							<button className="btn px-5 btn-primary bg-gradient-to-r from-sky-400 to-blue-500">
								Home
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Blog;