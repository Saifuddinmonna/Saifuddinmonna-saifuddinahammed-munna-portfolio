import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Link, Outlet, useLoaderData, useParams } from "react-router-dom";
import NavbarPage2 from "../NavbarPage/NavbarPage2";
import portfoliosName from "./portfolios.json";

const MyPortfolios = () => {
	const websiteName = useParams();
	const nameFilter = websiteName?.UsedPhone;
	const [datasName, setDatasName] = useState(portfoliosName);
	const [datas, setDatas] = useState(portfoliosName);
	const [datas2, setDatas2] = useState();
	const [data, setData] = useState();
	const [paramData, setPatamData] = useState();
	const [showMore, setShowMore] = useState(false);
	const [showDetails, setShowDetails] = useState(false);

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
	const details = async (props) => {
		// const { name } = name;
		const newData = await datasName.filter((data) => data.name == props);
		setShowDetails(true);
		setDatas2(newData);
		console.log(props);
		console.log(newData);
		// setPatamData(false);
	};
	const details2 = async (props) => {
		// const { name } = name;
		// const newData = await datasName.filter((data) => data.name == props);
		setShowDetails(false);

		// setPatamData(false);
	};

	useEffect(() => {
		dataFilter();
		console.log("data filter from home is clicked");
	}, [nameFilter]);

	return (
		<div className="">
			<div className="rounded-2xl border p-2 m-3 px-3 shadow-lg  text-gray-600 body-font">
				<div className="">
					<div className="mt-3  p-3 border rounded-2xl">
						<h1 class="text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl black:text-white white:text-dark">
							My <span class="text-blue-500"> Portfolio...</span>
						</h1>
					</div>
					{!showDetails && (
						<div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							{
								// !paramData &&
								datas?.slice(0, 9).map((p, ind) => (
									<div
										key={ind}
										className="container relative  p-3 mb-2 shadow-xl border rounded-xl mx-auto">
										<section className="text-gray-600 body-font">
											<div className=" p-3 m-3 mx-auto text-center">
												<h1 class="text-2xl font-semibold text-center  text-gray-800 capitalize lg:text-3xl black:text-white white:text-dark">
													{p.category} :{" "}
													<span class="text-blue-500">
														{p.name}
													</span>
												</h1>
												<div className="">
													<div className="text-center">
														<h2 className="text-gray-900  text-center text-2xl text-strong title-font font-medium mb-2">
															Website Link
														</h2>
														<div className="flex gap-2 justify-center text-center">
															<p className="text-left btn btn-warning  btn-sm d-block  text-auto text-xl capitalize  ">
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
															<p className="text-left btn btn-warning  btn-sm d-block text-auto text-xl ">
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
														</div>
														{/* <div className="flex gap-2 mt-2 justify-center">
															{p.liveServersite && (
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
															)}
															{p.liveServersiteRepo && (
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
															)}
														</div> */}
													</div>
												</div>
											</div>
										</section>

										<div className="">
											{p?.image
												?.slice(0, 1)
												.map((imgs, ind) => (
													<div
														key={ind}
														className="mb-2">
														<div className=" relative  mb-2 p-2 rounded-xl transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-150 hover:bg-indigo-500 duration-300">
															<PhotoProvider>
																<PhotoView
																	src={`images/${imgs}`}>
																	<img
																		className="rounded-xl max-h-72"
																		src={`images/${imgs}`}
																		alt="Pic of portfolios"
																	/>
																</PhotoView>
															</PhotoProvider>
														</div>
													</div>
												))}
										</div>
										<div className="bg-warning rounded-b-lg bottom-0 right-0 left-0 flex justify-around absolute">
											<Link to={"/portfoliolayout"}>
												<button className="btn btn-sm bolder bottom-2 left-3 btn-warning">
													Show All
												</button>
											</Link>
											<button
												href="#my-modal-2"
												onClick={() => details(p.name)}
												className="btn btn-sm  bottom-2 right-3 btn-warning">
												Details
											</button>
										</div>
									</div>
								))
							}
						</div>
					)}
					{showDetails &&
						datas2?.map((p, ind) => (
							<div
								key={ind}
								className=" relative container p-3 m-5 shadow-xl border rounded-xl mx-auto">
								<section className="text-gray-600 body-font">
									<div className="container  p-3 m-3 mx-auto">
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
													<p className="text-left btn btn-warning  btn-sm d-block mb-1  text-auto text-xl capitalize  ">
														<a
															className="text-decoration-none"
															target="_blank"
															href={p.liveWebsite}
															rel="noreferrer">
															Live Website
														</a>
													</p>
													<p className="text-left btn btn-warning  btn-sm d-block mb-1 text-auto text-xl ">
														<a
															className="text-decoration-none"
															target="_blank"
															href={
																p.liveWebsiteRepo
															}
															rel="noreferrer">
															Live Website Repo
														</a>
													</p>
													{p.liveServersite && (
														<p className="text-left mt-1 btn btn-warning  btn-sm d-block text-auto text-xl ">
															<a
																className="text-decoration-none d-block"
																target="_blank"
																href={
																	p.liveServersite
																}
																rel="noreferrer">
																Live Serversite
															</a>
														</p>
													)}
													{p.liveServersiteRepo && (
														<p className="text-left mt-1 btn btn-warning  btn-sm d-block text-auto text-xl ">
															<a
																className="text-decoration-none d-block"
																target="_blank"
																href={
																	p.liveServersiteRepo
																}
																rel="noreferrer">
																LiveServer Site
																Repo
															</a>
														</p>
													)}
												</div>
											</div>
											<div className="p-4 md:w-1/3 flex">
												<div className="flex-grow pl-6">
													<h2 className="text-gray-900  bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 p-2 rounded text-lg title-font font-medium mb-2">
														Used Technologies
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

													<button
														className="btn btn-xs flex btn-danger"
														onClick={() =>
															setShowMore(
																!showMore,
															)
														}>
														<span>
															{showMore
																? "Show less"
																: "Show more"}
														</span>
														<svg
															fill="none"
															stroke="currentColor"
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
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

								<div className="grid grid-cols-3 mb-2">
									{p?.image?.map((imgs, ind) => (
										<div key={ind} className="">
											<div className="  m-2 p-2 rounded-xl transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-150 hover:bg-indigo-500 duration-300">
												<PhotoProvider>
													<PhotoView
														src={`images/${imgs}`}>
														<img
															className="rounded-xl max-h-72"
															src={`images/${imgs}`}
															alt="Pic of portfolios"
														/>
													</PhotoView>
												</PhotoProvider>
											</div>
										</div>
									))}
								</div>
								<div className="bg-warning d-block rounded-b-lg bottom-0 right-0 left-0 flex justify-around absolute">
									<button
										href="#my-modal-2"
										onClick={() => details2(p.name)}
										className="btn btn-sm d-block m-auto bolder btn-warning">
										Close Details
									</button>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default MyPortfolios;
