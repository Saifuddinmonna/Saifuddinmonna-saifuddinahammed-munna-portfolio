import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Outlet, useLoaderData, useParams } from "react-router-dom";
import Footer from "../../BodyDiv/Footer";
import NavbarFooter from "../../NavbarPage/NabvarFooter";
import NavbarPage2 from "../../NavbarPage/NavbarPage2";
import MyPortfolios from "../MyPortfolios";

import portfoliosName from "../portfolios.json";
import "./Portfolio.css";

const PortfolioLayout = () => {
	const [confettiStart, setConfettiStart] = useState(true);
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

	useEffect(() => {
		setConfettiStart(true);
	}, [datas]);
	useEffect(() => {
		setTimeout(() => {
			setConfettiStart(false);
		}, 8000);
	}, [datas]);
	return (
		<div className="relative">
			{confettiStart && <ReactConfetti />}
			{/* fixed w-full top-0 left-0 right-0 mx-auto */}
			<div className="fixed z-30 w-full top-0 left-0 right-0 mx-auto">
				<NavbarPage2></NavbarPage2>
			</div>

			<div className="min-h-screen rounded-2xl mt-4 shadow-2xl  border p-2 m-1 text-gray-600 body-font">
				<div className="grid grid-cols-1 md:grid-cols-10  lg:grid-cols-10  xl:grid-cols-10 ">
					<div className=" relative  md:col-span-3 lg:col-span-2 xl:col-span-2  ">
						<div className="sm:mt-12 md:mt-12   lg:mt-12 xl:mt-12   md:fixed    ">
							<div className="pb-20 overflow-x-auto max-h-screen">
								{datasName?.map((nameall, ind) => (
									<div className=" " key={ind}>
										<div className="flex rounded-xl  justify-between">
											{/* <span>{ind + 1}. </span> */}
											<button
												onClick={() =>
													dataFilter(nameall.name)
												}
												className="btn flex flex-wrap text-auto size-auto btn-warning rounded-xl d-block btn-sm w-full m-2 p-2">
												{nameall.category}
											</button>
										</div>
									</div>
								))}
								<button
									onClick={dataFilter2}
									className="btn btn-warning text-auto size-auto d-block btn-sm w-full m-2 p-2">
									All
								</button>
							</div>
						</div>
					</div>
					<div className="md:col-span-7 lg:col-span-8 xl:col-span-8 me-3 ">
						{/* {paramData && <Outlet></Outlet>} */}
						{
							// !paramData &&
							datas?.map((p, ind) => (
								<div
									key={ind}
									className=" pl-3 m-5 shadow border rounded-xl mx-auto">
									<h1 class="mt-3 text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl black:text-white white:text-dark">
										<span className="p-2 px-3 border shadow-lg text-warning rounded-full">
											{datas.length}
										</span>{" "}
										{datas.length > 1
											? " Websites Are"
											: "Website Is"}
										<span class="text-blue-500">
											{" "}
											Founded{" "}
											{datas.length === 14
												? "Here "
												: "in This Category"}
										</span>
									</h1>
									<section className="text-gray-600 body-font">
										<div className="container p-3 m-3 mx-auto">
											<h1 class="text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl black:text-white white:text-dark">
												{p.category} :{" "}
												<span class="text-blue-500">
													{p.name}
												</span>
											</h1>
											<div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
												<div className="p-4 sm:1 md:w-1/2 lg:w-1/3 md:flex">
													<div className="flex-grow pl-6">
														<h2 className="text-gray-900  text-left text-2xl text-strong title-font font-medium mb-2">
															Website Link
														</h2>
														<p className="text-left mt-1 btn btn-warning  btn-sm d-block  text-auto text-xl capitalize  ">
															<a
																className="text-decoration-none d-block"
																target="_blank"
																href={
																	p.liveWebsite
																}
																rel="noreferrer">
																Live Website
															</a>
														</p>
														<p className="text-left mt-1 btn btn-warning  btn-sm d-block text-auto text-xl ">
															<a
																className="text-decoration-none  d-block"
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
															<p className="text-left mt-1 btn btn-warning  btn-sm d-block text-auto text-xl ">
																<a
																	className="text-decoration-none d-block"
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
															<p className="text-left mt-1 btn btn-warning  btn-sm d-block text-auto text-xl ">
																<a
																	className="text-decoration-none d-block"
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
											<div key={ind} className=" ">
												<div className="  m-2 p-2 rounded-xl transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-150 hover:bg-indigo-500 duration-300">
													<PhotoProvider>
														<PhotoView
															src={`images/${imgs}`}>
															<img
																className="rounded-xl maxHight"
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
					</div>
				</div>
			</div>
			<NavbarFooter className="fixed z-30 w-full bottom-0 left-0 right-0 mx-auto"></NavbarFooter>
			<Footer></Footer>
		</div>
	);
}; 
		
			
						

							
							
						
					
				
			
		
	


export default PortfolioLayout;
