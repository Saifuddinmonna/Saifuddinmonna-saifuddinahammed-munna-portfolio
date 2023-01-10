import React from 'react';

const About = () => {
        return (
			<div>
				<div className="hero min-h-screen bg-base-200">
					<div className="hero-content flex-col lg:flex-row">
						<img
							src="profile.jpg"
							className="max-w-sm rounded-lg shadow-2xl"
						/>
						<div>
							<h1 className="text-5xl font-bold">About Myself</h1>
							<p className="py-6 text-2xl italic text-justify p-5">
								I was born in Mymensinngh Sadar Mymensingh
								district,Bangladesh. I have three brothers and
								my parents. I have completed post graduation in
								Public Administration in 2017.Now I am teaching
								and coding. I’ve been working on web design and
								development for helping people to build their
								website, manage and develop functionality. I’m
								Passionate at web design and development. I work
								a minimum of 13-14 hours every day, I love to do
								this, it’s my life- everything. I learn new
								things every day. Actually I want to be a good
								web developer and and bud a optimize npm package
								for for react that is my vision. <br />
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