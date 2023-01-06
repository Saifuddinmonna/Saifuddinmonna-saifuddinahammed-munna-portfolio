import React, { useEffect, useState } from "react";
import MyportfolioImage from "./MyportfolioImage";


const MyPortfolios = () => {
	
	return (
		<div className="border m-2 p-4 rounded-xl ">
			<h1 class="text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl dark:text-white">
				My Portfolios
			</h1>

			<p class="mt-4 text-center text-gray-500 dark:text-gray-300">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit.
				Nostrum quam voluptatibus
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-3">
				<div className="">
					<div className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 p-2 border rounded-lg m-2 shadow-xl image-full">
						<figure className="hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300">
							<img
								className=" hover:bg-violet-600   image-fluid object-scale-down"
								src="images\Capture.JPG"
								alt="Shoes"
							/>
						</figure>
						<div className=" p-2 flex justify-around border rounded-lg m-2 shadow-xl image-full">
							<h2 className="card-title object-scale-down">
								E-Commerce
							</h2>

							<div className=" justify-end">
								<button className="btn btn-sm btn-primary object-scale-down">
									Show Details
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300">
					<div className=" transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 p-2 border rounded-lg m-2 shadow-xl image-full">
						<figure>
							<img
								className="image-fluid object-scale-down"
								src="images/r1.JPG"
								alt="Shoes"
							/>
						</figure>
						<div className=" p-2 flex justify-around border rounded-lg m-2 shadow-xl image-full">
							<h2 className="card-title object-scale-down">
								E-Learning
							</h2>

							<div className=" justify-end">
								<button className="btn btn-sm btn-primary object-scale-down">
									Show Details
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300">
					<div className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 p-2 border rounded-lg m-2 shadow-xl image-full">
						<figure>
							<img
								className="image-fluid object-scale-down"
								src="images/EnglishLearning.JPG"
								alt="Shoes"
							/>
						</figure>
						<div className=" p-2 flex justify-around border rounded-lg m-2 shadow-xl image-full">
							<h2 className="card-title object-scale-down">
								E-Learning
							</h2>

							<div className=" justify-end">
								<button className="btn btn-sm btn-primary object-scale-down">
									Show Details
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<MyportfolioImage></MyportfolioImage>
		</div>
	);
};

export default MyPortfolios;
