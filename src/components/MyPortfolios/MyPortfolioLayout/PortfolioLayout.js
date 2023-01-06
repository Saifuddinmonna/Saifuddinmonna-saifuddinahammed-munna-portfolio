import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import MyPortfolios from "../MyPortfolios";

import portfolios from "../portfolios.json";

const PortfolioLayout = () => {
	const [datas, setDatas] = useState(portfolios);
	const [data, setData] = useState(0);
	const [imagesState, setImagesState] = useState();

	const Datafuction = () => {
		
			datas && datas?.map((p) => {
				p?.image.map((images) => {
					setImagesState(images);
					console.log(images)
		})
	} )
	};

	useEffect(() => {
		Datafuction();
	}, [data]);
	console.log(data);
	console.log(data?.name);
	console.log(imagesState);
	return (
		<div>
			<div className="rounded-2xl border p-2 m-2">
				{datas && datas?.map((p) => <div>{p.name}</div>)}
			</div>
			<img
				src="images/r1.JPG"
				// { `"${imagesState}"` }
				alt="another name "
			/>
			{/* <div className="rounded-2xl border p-2 m-2">
				<section className="text-red body-font">
					<div className="container px-5 py-24 mx-auto">
						<div className="flex flex-col text-center w-full mb-20">
							<h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-red">
								Master Cleanse Reliac Heirloom
							</h1>
							<p className="lg:w-2/3 mx-auto leading-relaxed text-base">
								Whatever cardigan tote bag tumblr hexagon
								brooklyn asymmetrical gentrify, subway tile poke
								farm-to-table. Franzen you probably haven't
								heard of them man bun deep jianbing selfies
								heirloom.
							</p>
						</div>
						<div className="flex flex-wrap -m-4">
							<div className="lg:w-1/3 sm:w-1/2 p-4">
								<div className="flex relative">
									<img
										alt="gallery"
										className="absolute inset-0 w-full h-full object-cover object-center"
										src={"imagesState"}
									/>
									<div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
										<h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">
											THE SUBTITLE
										</h2>
										<h1 className="title-font text-lg font-medium text-gray-900 mb-3">
											Shooting Stars
										</h1>
										<p className="leading-relaxed">
											Photo booth fam kinfolk cold-pressed
											sriracha leggings jianbing
											microdosing tousled waistcoat.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div> */}
		</div>
	);
};

export default PortfolioLayout;
