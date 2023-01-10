import React from 'react';
import { Link } from "react-router-dom";

const Blog = () => {
	return (
		<div>
			<div className="hero min-h-screen bg-base-200">
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