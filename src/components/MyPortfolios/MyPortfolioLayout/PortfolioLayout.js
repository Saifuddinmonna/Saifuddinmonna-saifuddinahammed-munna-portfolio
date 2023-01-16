import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useLoaderData, useParams } from "react-router-dom";
import NavbarPage2 from "../../NavbarPage/NavbarPage2";
import MyPortfolios from "../MyPortfolios";

import portfoliosName from "../portfolios.json";

const PortfolioLayout = () => {
	const websiteName = useParams();
	const [datasName, setDatasName] = useState(portfoliosName);
	const [datas, setDatas] = useState([]);
	const [datas2, setDatas2] = useState();
	const [dataHome, setDataHome] = useState();
	const [data, setData] = useState();
	const [imagesState, setImagesState] = useState([]);
	const [showMore, setShowMore] = useState(false);
	const datas3 = useLoaderData([]);

	// const [1, 2, 3, 4, 5]=[datas];

	const Datafuction = () => {
		for (const p of datas) {
			setData(p);
		}
	};

	const dataFilter = (props) => {
		// const { name } = name;
		const newData = datas.filter((data) => data.name == props);
		setDatas2(newData);
		console.log(props);
		console.log(newData);
	};

	useEffect(() => {
		Datafuction();
	}, []);

	useEffect(() => {
		fetch("portfolios.json")
			.then((res) => res.json())
			.then((datas) => setDatas(datas));
		console.log(datas);
	}, []);
	console.log(datas);
	console.log(data);
	console.log(data?.name);
	console.log(imagesState);
	console.log(dataHome);
	console.log(datas3);
	console.log(datas2);
	useEffect(() => {
		setDatas2(!true);
	}, []);
	// useEffect(() => {
	// 	const dataFilter2 = (props) => {
	// 		// const { name } = name;
	// 		const newData = datas3?.filter(
	// 			(data) => data.name == websiteName.UsedPhone,
	// 		);
	// 		setDataHome(newData);
	// 		console.log(props);
	// 		console.log(newData);
	// 	};
	// 	dataFilter2(websiteName.UsedPhone);
	// 	console.log(websiteName.UsedPhone);
	// 	setDatas2(!true);
	// }, []);

	if (!datas2) {
		return (
			<div>
				<div className="rounded-2xl border p-2  text-gray-600 body-font">
					<NavbarPage2></NavbarPage2>
					<div className="grid grid-cols-1 xl:grid-cols-7  lg:grid-cols-7  md:grid-cols-7">
						<div className="col-span-1 mr-2 ">
							<div className="lg:fixed xl:fixed md:fixed p-2 mr-2 ">
								{datasName?.map((nameall, ind) => (
									<div key={ind}>
										<button
											onClick={() =>
												dataFilter(nameall.name)
											}
											className="btn btn-warning d-block  w-full m-2 p-2">
											{nameall.name}
										</button>
									</div>
								))}
								<button
									onClick={() => setDatas2(false)}
									className="btn btn-warning d-block  w-full m-2 p-2">
									All
								</button>
							</div>
						</div>
						<div className="col-span-6">
							{datas &&
								datas?.map((p, ind) => (
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
													<div className="p-4 md:w-1/2 lg:w-1/3 flex">
														<div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0"></div>
														<div className="flex-grow pl-6">
															<h2 className="text-gray-900  text-left text-2xl text-strong title-font font-medium mb-2">
																Website Link
															</h2>
															<p className="text-left btn btn-warning mt-1 btn-sm d-block  text-white text-xl capitalize  ">
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
															<p className="text-left btn btn-warning mt-1 btn-sm d-block text-white text-xl ">
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
																<p className="text-left btn btn-warning mt-1 btn-sm d-block text-white text-xl ">
																	<a
																		className="text-decoration-none"
																		target="_blank"
																		href={
																			p.liveServersite
																		}
																		rel="noreferrer">
																		&& (
																		Live
																		Serversite)
																	</a>
																</p>
															)}
															{p.liveServersiteRepo && (
																<p className="text-left btn btn-warning mt-1 btn-sm d-block text-white text-xl ">
																	<a
																		className="text-decoration-none"
																		target="_blank"
																		href={
																			p.liveServersiteRepo
																		}
																		rel="noreferrer">
																		LiveServer
																		Site
																		Repo
																	</a>
																</p>
															)}
														</div>
													</div>
													<div className="p-4 md:w-1/3 flex">
														<div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0"></div>
														<div className="flex-grow pl-6">
															<h2 className="text-gray-900 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 p-2 rounded text-2xl  font-medium mb-2">
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
															<h2 className="text-gray-900 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 p-2 rounded text-2xl  font-medium mb-2">
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
																className="btn btn-danger d flex"
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
								))}
						</div>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<div className="rounded-2xl border p-2  text-gray-600 body-font">
					<NavbarPage2></NavbarPage2>
					<div className="grid grid-cols-7">
						<div className="col-span-1 mr-2 mt-2">
							<div className="mr-2">
								{datasName?.map((nameall, ind) => (
									<div key={ind}>
										<button
											onClick={() =>
												dataFilter(nameall.name)
											}
											className="btn btn-warning d-block  w-full m-2 p-2">
											{nameall.name}
										</button>
									</div>
								))}
								<button
									onClick={() => setDatas2(false)}
									className="btn btn-warning d-block  w-full m-2 p-2">
									All
								</button>
							</div>
						</div>
						<div className="col-span-6">
							{datas2 ||
								(datas3 &&
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
																		Live
																		Website
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
																		Live
																		Website
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
																		Site
																		Repo
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
																	{
																		p.technology
																	}
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
									)))}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default PortfolioLayout;
