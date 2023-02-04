import React from 'react';
import { useEffect } from "react";

const About = () => {
const componentDidMount = () => {
	window.scrollTo(0, 0);
};

	useEffect( () => {
		window.scrollTo(0, 0);
		componentDidMount();
	},[]);



	return (
		<div className="m-7  mx-auto">
			<div className="bg-base-200 m-3  rounded-xl">
				<div className="hero-content flex-col lg:flex-row">
					<img
						src="images/profile1.png"
						className="max-w-sm rounded-lg shadow-2xl m-3"
						alt="image of Saifuddin Ahammed Monna"
					/>
					<div>
						<h1 className="text-5xl font-bold">About Myself</h1>
						<p className="py-6 text-2xl italic text-justify pl-5">
							I was born in Mymensinngh Sadar Mymensingh
							district,Bangladesh. I have three brothers and my
							parents. I have completed post graduation in Public
							Administration in 2017.Now I am teaching and coding.
							I’ve been working on web design and development for
							helping people to build their website, manage and
							develop functionality. I’m Passionate at web design
							and development. I work a minimum of 13-14 hours
							every day, I love to do this, it’s my life-
							everything. I learn new things every day. Actually I
							want to be a good web developer and and bud a
							optimize npm package for for react that is my
							vision. <br />
							<div className="text-center text-4xl text-deep-orange-600 mt-4">
								--***--
							</div>
						</p>
						<button className="btn btn-primary px-4 bg-gradient-to-r from-sky-400 to-blue-500">
							Get Started with me
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;