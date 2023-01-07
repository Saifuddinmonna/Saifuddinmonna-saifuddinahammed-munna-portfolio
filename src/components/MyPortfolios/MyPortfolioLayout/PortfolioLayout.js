import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import MyPortfolios from "../MyPortfolios";

// import portfolios from "../portfolios.json";

const PortfolioLayout = () => {
	const [datas, setDatas] = useState([]);
	const [data, setData] = useState();
	const [imagesState, setImagesState] = useState([]);
	const [showMore, setShowMore] = useState(false);
	// const [1, 2, 3, 4, 5]=[datas];

	const Datafuction = () => {
		for (const p of datas) {
			setData(p);
		}
	};

	useEffect(() => {
		Datafuction();
	}, []);

	useState(() => {
		fetch("portfolios.json")
			.then((res) => res.json())
			.then((datas) => setDatas(datas));
		console.log(datas);
	}, []);
	console.log(datas);
	console.log(data);
	console.log(data?.name);
	console.log(imagesState);
	return (
		<div>
			<div className="rounded-2xl border p-2 m-2 text-gray-600 body-font">
				{datas &&
					datas?.map((p) => (
						<div className="container px-5 py-24 mx-auto">
							<section className="text-gray-600 body-font">
								<div className="container px-5 py-24 mx-auto">
									<h1 className="sm:text-3xl text-2xl font-medium title-font text-center text-gray-900 mb-20">
										{p.category}
										<br className="hidden sm:block" />
										{p.name}
									</h1>
									<div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
										<div className="p-4 md:w-1/3 flex">
											<div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0"></div>
											<div className="flex-grow pl-6">
												<h2 className="text-gray-900 text-left text-2xl text-strong title-font font-medium mb-2">
													Website Link
												</h2>
												<p className="text-left text-xl capitalize ">
													<a
														target="_blank"
														href={p.liveWebsite}
														rel="noreferrer">
														liveWebsite
													</a>
												</p>
												<p className="text-left text-xl ">
													<a
														target="_blank"
														href={p.liveWebsiteRepo}
														rel="noreferrer">
														liveWebsiteRepo
													</a>
												</p>
												<p className="text-left text-xl ">
													<a
														target="_blank"
														href={p.liveServersite}
														rel="noreferrer">
														iveServersite
													</a>
												</p>
												<p className="text-left text-xl ">
													<a
														target="_blank"
														href={
															p.liveServersiteRepo
														}
														rel="noreferrer">
														liveServersiteRepo
													</a>
												</p>
											</div>
										</div>
										<div className="p-4 md:w-1/3 flex">
											<div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0"></div>
											<div className="flex-grow pl-6">
												<h2 className="text-gray-900 text-lg title-font font-medium mb-2">
													Used Technologies
												</h2>
												<p className="leading-relaxed text-base">
													{p.technology}
												</p>
											</div>
										</div>
										<div className="p-4 md:w-1/3 flex">
											<div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0">
												<svg
													fill="none"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													className="w-6 h-6"
													viewBox="0 0 24 24">
													<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
													<circle
														cx={12}
														cy={7}
														r={4}
													/>
												</svg>
											</div>
											<div className="flex-grow pl-6">
												<h2 className="text-gray-900 text-lg title-font font-medium mb-2">
													Overview
												</h2>
												{showMore ? (
													<>
														{p.overview
															.slice(0, 5)
															.map((over) => (
																<p className="text-left ">
																	{over}
																</p>
															))}
													</>
												) : (
													<>
														{p.overview
															.slice(0, 2)
															.map((over) => (
																<p className="text-left ">
																	{over}
																</p>
															))}
													</>
												)}

												<button
													className="btn"
													onClick={() =>
														setShowMore(!showMore)
													}>
													{showMore
														? "Show less"
														: "Show more"}
													<svg
														fill="none"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														className="w-4 h-4 ml-2"
														viewBox="0 0 24 24">
														<path d="M5 12h14M12 5l7 7-7 7" />
													</svg>
												</button>
											</div>
										</div>
									</div>
								</div>
							</section>

							<div className="grid grid-cols-3">
								{p?.image?.map((imgs, ind) => (
									<div key={ind} className="">
										<div className=" border m-2 p-2 rounded">
											<img
												alt="gallery"
												className=""
												src={`images/${imgs}`}
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
			</div>
			<img src="images/1.JPG" alt="test2" />
		</div>
	);
};

export default PortfolioLayout;
