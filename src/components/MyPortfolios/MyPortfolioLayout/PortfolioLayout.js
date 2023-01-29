import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Outlet, useLoaderData, useParams } from "react-router-dom";
import NavbarPage2 from "../../NavbarPage/NavbarPage2";
import MyPortfolios from "../MyPortfolios";

import portfoliosName from "../portfolios.json";

const PortfolioLayout = () => {
	const websiteName = useParams();
	const nameFilter = websiteName?.UsedPhone;
	const [datasName, setDatasName] = useState(portfoliosName);
	const [datas, setDatas] = useState(portfoliosName);
	const [datas2, setDatas2] = useState();
	const [data, setData] = useState();
	const [paramData, setPatamData] = useState();
	const [showMore, setShowMore] = useState(false);

	const dataFilter2 = async (props) => {
		await setDatas(portfoliosName);
		setPatamData(false);
		console.log("data filter 2 clicked");
		console.log(portfoliosName);
	};

	useEffect(() => {
		fetch("portfolios.json")
			.then((res) => res.json())
			.then((datas) => setDatas(datas));
		console.log(datas);
		console.log("useEffect is work");
	}, []);

	console.log(datas);
	console.log(data);
	console.log(data?.name);

	console.log(datas2);

	const dataFilter = async (props) => {
		// const { name } = name;
		const newData = await datasName.filter(
			(data) => data.name == (props || nameFilter),
		);
		setDatas(newData);
		console.log(props);
		console.log(newData);
		// setPatamData(false);
	};

	useEffect(() => {
		dataFilter();
		console.log("data filter from home is clicked");
	}, [nameFilter]);

	return (
		<div>
			<div className="rounded-2xl border p-2  text-gray-600 body-font">
				<NavbarPage2></NavbarPage2>
				<div className="grid grid-cols-1 md:grid-cols-10  lg:grid-cols-10  xl:grid-cols-10 ">
					<div className="col-span-2  ">
						<div className="lg:fixed xl:fixed md:fixed ">
							{datasName?.map((nameall, ind) => (
								<div key={ind}>
									<button
										onClick={() => dataFilter(nameall.name)}
										className="btn btn-warning d-block  w-full m-2 p-2">
										{nameall.category}
									</button>
								</div>
							))}
							<button
								onClick={dataFilter2}
								className="btn btn-warning d-block  w-full m-2 p-2">
								All
							</button>
						</div>
					</div>
					<div className="col-span-8 ">
						{/* {paramData && <Outlet></Outlet>} */}
						{
							// !paramData &&
							datas?.map((p, ind) => (
								<div
									key={ind}
									className="container p-3 m-5 shadow-xl border rounded-xl mx-auto">
									<section className="text-gray-600 body-font">
										<div className="container p-3 m-3 mx-auto">
											<h1 class="text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl black:text-white white:text-dark">
												{p.category} :{" "}
												<span class="text-blue-500">
													{p.name}
												</span>
											</h1>
											<div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
												<div className="p-4 md:w-1/2 lg:w-1/3 flex">
													<div className="flex-grow pl-6">
														<h2 className="text-gray-900  text-left text-2xl text-strong title-font font-medium mb-2">
															Website Link
														</h2>
														<p className="text-left mt-1 btn btn-warning  btn-sm d-block  text-white text-xl capitalize  ">
															<a
																className="text-decoration-none"
																target="_blank"
																href={
																	p.liveWebsite
																}
																rel="noreferrer">
																Live Website
															</a>
														</p>
														<p className="text-left mt-1 btn btn-warning  btn-sm d-block text-white text-xl ">
															<a
																className="text-decoration-none"
																target="_blank"
																href={
																	p.liveWebsiteRepo
																}
																rel="noreferrer">
																Live Website
																Repo
															</a>
														</p>
														{p.liveServersite && (
															<p className="text-left mt-1 btn btn-warning  btn-sm d-block text-white text-xl ">
																<a
																	className="text-decoration-none"
																	target="_blank"
																	href={
																		p.liveServersite
																	}
																	rel="noreferrer">
																	&& ( Live
																	Serversite)
																</a>
															</p>
														)}
														{p.liveServersiteRepo && (
															<p className="text-left mt-1 btn btn-warning  btn-sm d-block text-white text-xl ">
																<a
																	className="text-decoration-none"
																	target="_blank"
																	href={
																		p.liveServersiteRepo
																	}
																	rel="noreferrer">
																	LiveServer
																	Site Repo
																</a>
															</p>
														)}
													</div>
												</div>
												<div className="p-4 md:w-1/3 flex">
													<div className="flex-grow pl-6">
														<h2 className="text-gray-900 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 p-2 rounded text-2xl  font-medium mb-2">
															Used Technologies
														</h2>
														<p className="leading-relaxed text-base">
															{p.technology}
														</p>
													</div>
												</div>
												<div className="p-4 md:w-1/3 flex">
													<div className="flex-grow pl-6">
														<h2 className="text-gray-900 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 p-2 rounded text-2xl  font-medium mb-2">
															Overview
														</h2>
														{showMore ? (
															<>
																{p.overview
																	.slice(0, 5)
																	.map(
																		(
																			over,
																			ind,
																		) => (
																			<p
																				key={
																					ind
																				}
																				className="text-left ">
																				{
																					over
																				}
																			</p>
																		),
																	)}
															</>
														) : (
															<>
																{p.overview
																	.slice(0, 2)
																	.map(
																		(
																			over,
																			ind,
																		) => (
																			<p
																				key={
																					ind
																				}
																				className="text-left ">
																				{
																					over
																				}
																			</p>
																		),
																	)}
															</>
														)}

														{p.overview.length >
															2 && (
															<button
																className="btn btn-danger btn-xs d flex"
																onClick={() =>
																	setShowMore(
																		!showMore,
																	)
																}>
																{showMore
																	? "Show less"
																	: "Show more"}
																<svg
																	fill="none"
																	stroke="currentColor"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={
																		2
																	}
																	className="w-4 h-4 ml-2 d-inline-block"
																	viewBox="0 0 24 24">
																	<path d="M5 12h14M12 5l7 7-7 7" />
																</svg>
															</button>
														)}
													</div>
												</div>
											</div>
										</div>
									</section>

									<div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-3">
										{p?.image?.map((imgs, ind) => (
											<div key={ind} className="">
												<div className=" border m-2 p-2 rounded transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-150 hover:bg-indigo-500 duration-300">
													<PhotoProvider>
														<PhotoView
															src={`images/${imgs}`}>
															<img
																src={`images/${imgs}`}
																alt="Pic of portfolios"
															/>
														</PhotoView>
													</PhotoProvider>
												</div>
											</div>
										))}
									</div>
								</div>
							))
						}
						{/* {datas2 &&
								datas2?.map((p, ind) => (
									<div
										key={ind}
										className="container p-3 m-5 shadow-xl border rounded-xl mx-auto">
										<section className="text-gray-600 body-font">
											<div className="container p-3 m-3 mx-auto">
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
															<p className="text-left btn btn-warning  btn-sm d-block  text-white text-xl capitalize  ">
																<a
																	className="text-decoration-none"
																	target="_blank"
																	href={
																		p.liveWebsite
																	}
																	rel="noreferrer">
																	Live Website
																</a>
															</p>
															<p className="text-left btn btn-warning  btn-sm d-block text-white text-xl ">
																<a
																	className="text-decoration-none"
																	target="_blank"
																	href={
																		p.liveWebsiteRepo
																	}
																	rel="noreferrer">
																	Live Website
																	Repo
																</a>
															</p>
															<p className="text-left btn btn-warning  btn-sm d-block text-white text-xl ">
																<a
																	className="text-decoration-none"
																	target="_blank"
																	href={
																		p.liveServersite
																	}
																	rel="noreferrer">
																	Live
																	Serversite
																</a>
															</p>
															<p className="text-left btn btn-warning  btn-sm d-block text-white text-xl ">
																<a
																	className="text-decoration-none"
																	target="_blank"
																	href={
																		p.liveServersiteRepo
																	}
																	rel="noreferrer">
																	LiveServer
																	Site Repo
																</a>
															</p>
														</div>
													</div>
													<div className="p-4 md:w-1/3 flex">
														<div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0"></div>
														<div className="flex-grow pl-6">
															<h2 className="text-gray-900  bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 p-2 rounded text-lg title-font font-medium mb-2">
																Used
																Technologies
															</h2>
															<p className="leading-relaxed text-base">
																{p.technology}
															</p>
														</div>
													</div>
													<div className="p-4 md:w-1/3 flex">
														<div className="flex-grow pl-6">
															<h2 className="text-gray-900 text-lg  bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 p-2 rounded title-font font-medium mb-2">
																Overview
															</h2>
															{showMore ? (
																<>
																	{p.overview
																		.slice(
																			0,
																			5,
																		)
																		.map(
																			(
																				over,
																				ind,
																			) => (
																				<p
																					key={
																						ind
																					}
																					className="text-left ">
																					{
																						over
																					}
																				</p>
																			),
																		)}
																</>
															) : (
																<>
																	{p.overview
																		.slice(
																			0,
																			2,
																		)
																		.map(
																			(
																				over,
																				ind,
																			) => (
																				<p
																					key={
																						ind
																					}
																					className="text-left ">
																					{
																						over
																					}
																				</p>
																			),
																		)}
																</>
															)}

															<button
																className="btn btn-danger"
																onClick={() =>
																	setShowMore(
																		!showMore,
																	)
																}>
																{showMore
																	? "Show less"
																	: "Show more"}
																<svg
																	fill="none"
																	stroke="currentColor"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={
																		2
																	}
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
													<div className=" border m-2 p-2 rounded transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-150 hover:bg-indigo-500 duration-300">
														<PhotoProvider>
															<PhotoView
																src={`images/${imgs}`}>
																<img
																	src={`images/${imgs}`}
																	alt="Pic of portfolios"
																/>
															</PhotoView>
														</PhotoProvider>
													</div>
												</div>
											))}
										</div>
									</div>
								))} */}
					</div>
				</div>
			</div>
		</div>
	);
}; 
		
			
						

							
							
						
					
				
			
		
	


export default PortfolioLayout;
