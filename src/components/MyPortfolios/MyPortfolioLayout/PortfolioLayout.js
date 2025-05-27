import { render } from "@testing-library/react";
import React, { useEffect, useState, useContext } from "react";
import ReactConfetti from "react-confetti";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Outlet, useLoaderData, useParams } from "react-router-dom";
import { ThemeContext } from "../../../App";
import MyPortfolios from "../MyPortfolios";
import { motion, useScroll, useSpring } from "framer-motion";
import portfoliosName from "../portfolios.json";
import "./Portfolio.css";
import NavbarPage2 from "../../NavbarPage/NavbarPage2";
import Footer from "../../BodyDiv/Footer";
const PortfolioLayout = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);
  const [confettiStart, setConfettiStart] = useState(true);
  const websiteName = useParams();
  const nameFilter = websiteName?.UsedPhone;
  const [datasName, setDatasName] = useState(portfoliosName);
  const [datas, setDatas] = useState(portfoliosName);
  const [datas2, setDatas2] = useState();
  const [data, setData] = useState();
  const [paramData, setPatamData] = useState();
  const [showMore, setShowMore] = useState(false);
  const width = window.screen.width;
  const width2 = window.screen.availWidth;
  console.log(width);
  console.log(width2);
  const dataFilter2 = async props => {
    await setDatas(portfoliosName);
    setPatamData(false);
    console.log("data filter 2 clicked");
    console.log(portfoliosName);
  };

  useEffect(() => {
    fetch("portfolios.json")
      .then(res => res.json())
      .then(datas => setDatas(datas));
    console.log(datas);
    console.log("useEffect is work");
  }, []);

  console.log(datas);
  console.log(data);
  console.log(data?.name);

  console.log(datas2);

  const dataFilter = async props => {
    // const { name } = name;
    const newData = await datasName.filter(data => data.name == (props || nameFilter));
    setDatas(newData);
    console.log(props);
    console.log(newData);
    // setPatamData(false);
    if (window.screen.availWidth < 720) {
      window.scrollTo(0, 800);
    } else {
      window.scrollTo(0, 0);
    }
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {confettiStart && <ReactConfetti />}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarPage2 />
      </div>
      <main className="flex-grow bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 lg:w-1/5">
              <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div className="space-y-2">
                  <motion.div
                    className="progress-bar h-1 bg-indigo-500 dark:bg-indigo-400 z-[99998] absolute mx-3 rounded-xl bottom-0"
                    style={{ scaleX: scrollYProgress }}
                  />
                  {datasName?.map((nameall, ind) => (
                    <div key={ind}>
                      <motion.button
                        onClick={() => dataFilter(nameall.name)}
                        className="flex flex-wrap text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-400 font-medium rounded-xl text-sm block w-full m-2 p-2"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {nameall.category}
                      </motion.button>
                    </div>
                  ))}
                  <motion.button
                    onClick={dataFilter2}
                    className="text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-400 font-medium rounded-xl text-sm block w-full m-2 p-2"
                    whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    All
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              <div className="space-y-6">
                {datas?.map((p, ind) => (
                  <motion.div
                    key={ind}
                    className="pl-3 m-5 border shadow-lg rounded-xl mx-auto overflow-hidden bg-white dark:bg-gray-800 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-xl"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: ind * 0.1 }}
                  >
                    <motion.h1
                      className="mt-3 text-3xl font-semibold text-center text-gray-800 dark:text-white capitalize lg:text-4xl"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + ind * 0.1 }}
                    >
                      <motion.span
                        className="p-2 px-3 border shadow-lg bg-indigo-500 dark:bg-indigo-600 text-white rounded-full"
                        whileHover={{
                          scale: 1.1,
                          boxShadow: "0px 0px 15px rgba(99, 102, 241, 0.8)",
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {datas.length}
                      </motion.span>{" "}
                      {datas.length > 1 ? " Websites Are" : "Website Is"}
                      <motion.span
                        className="text-indigo-600 dark:text-indigo-300"
                        whileHover={{ color: "#EC4899" }}
                        transition={{ duration: 0.2 }}
                      >
                        {" "}
                        Founded {datas.length === 14 ? "Here " : "in This Category"}
                      </motion.span>
                    </motion.h1>
                    <section className="text-gray-600 dark:text-gray-200 body-font">
                      <div className="container p-3 m-3 mx-auto">
                        <motion.h1
                          className="text-3xl font-semibold text-center text-gray-800 dark:text-white capitalize lg:text-4xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 + ind * 0.1 }}
                        >
                          {p.category} :{" "}
                          <motion.span
                            className="text-indigo-600 dark:text-indigo-300"
                            whileHover={{ letterSpacing: "0.5px", color: "#EC4899" }}
                            transition={{ duration: 0.2 }}
                          >
                            {p.name}
                          </motion.span>
                        </motion.h1>
                        <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
                          <div className="p-4 sm:1 md:w-1/2 lg:w-1/3 md:flex">
                            <div className="flex-grow pl-6">
                              <h2 className="text-gray-900 dark:text-white text-left text-2xl text-strong title-font font-medium mb-2">
                                Website Link
                              </h2>
                              <motion.p
                                className="text-left mt-2 btn btn-sm block uppercase tracking-wider font-bold text-sm text-white bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 shadow-md hover:shadow-lg"
                                whileHover={{
                                  scale: 1.1,
                                  x: 5,
                                  rotate: -2,
                                  boxShadow: "0px 8px 20px rgba(236, 72, 153, 0.5)",
                                }}
                                whileTap={{ scale: 0.9, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <a
                                  className="text-decoration-none block"
                                  target="_blank"
                                  href={p.liveWebsite}
                                  rel="noreferrer"
                                >
                                  Live Website Link
                                </a>
                              </motion.p>
                              <motion.p
                                className="text-left mt-2 btn btn-sm block uppercase tracking-wider font-bold text-sm text-white bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 shadow-md hover:shadow-lg"
                                whileHover={{
                                  scale: 1.1,
                                  x: 5,
                                  rotate: -2,
                                  boxShadow: "0px 8px 20px rgba(236, 72, 153, 0.5)",
                                }}
                                whileTap={{ scale: 0.9, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <a
                                  className="text-decoration-none block"
                                  target="_blank"
                                  href={p.liveWebsiteRepo}
                                  rel="noreferrer"
                                >
                                  Client Repo Link
                                </a>
                              </motion.p>
                              {p.liveServersite && (
                                <motion.p
                                  className="text-left mt-2 btn btn-sm block uppercase tracking-wider font-bold text-sm text-white bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 shadow-md hover:shadow-lg"
                                  whileHover={{
                                    scale: 1.1,
                                    x: 5,
                                    rotate: -2,
                                    boxShadow: "0px 8px 20px rgba(236, 72, 153, 0.5)",
                                  }}
                                  whileTap={{ scale: 0.9, rotate: 0 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  <a
                                    className="text-decoration-none block"
                                    target="_blank"
                                    href={p.liveServersite}
                                    rel="noreferrer"
                                  >
                                    Server Link
                                  </a>
                                </motion.p>
                              )}
                              {p.liveServersiteRepo && (
                                <motion.p
                                  className="text-left mt-2 btn btn-sm block uppercase tracking-wider font-bold text-sm text-white bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 shadow-md hover:shadow-lg"
                                  whileHover={{
                                    scale: 1.1,
                                    x: 5,
                                    rotate: -2,
                                    boxShadow: "0px 8px 20px rgba(236, 72, 153, 0.5)",
                                  }}
                                  whileTap={{ scale: 0.9, rotate: 0 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  <a
                                    className="text-decoration-none block"
                                    target="_blank"
                                    href={p.liveServersiteRepo}
                                    rel="noreferrer"
                                  >
                                    Server Repo Link
                                  </a>
                                </motion.p>
                              )}
                            </div>
                          </div>
                          <div className="p-4 md:w-1/3 flex">
                            <div className="flex-grow pl-6">
                              <motion.h2
                                className="text-white bg-indigo-600 dark:bg-indigo-500 p-2 rounded text-2xl font-medium mb-2"
                                whileHover={{
                                  letterSpacing: "0.2px",
                                  boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)",
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                Used Technologies
                              </motion.h2>
                              <p className="leading-relaxed text-base text-gray-700 dark:text-gray-200">
                                {p.technology}
                              </p>
                            </div>
                          </div>
                          <div className="p-4 md:w-1/3 flex">
                            <div className="flex-grow pl-6">
                              <motion.h2
                                className="text-white bg-indigo-600 dark:bg-indigo-500 p-2 rounded text-2xl font-medium mb-2"
                                whileHover={{
                                  letterSpacing: "0.2px",
                                  boxShadow: "0px 5px 15px rgba(99, 102, 241, 0.4)",
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                Overview
                              </motion.h2>
                              {showMore ? (
                                <>
                                  {p.overview.map((over, ind) => (
                                    <p
                                      key={ind}
                                      className="text-left text-gray-700 dark:text-gray-200"
                                    >
                                      {over}
                                    </p>
                                  ))}
                                </>
                              ) : (
                                <>
                                  {p.overview.slice(0, 2).map((over, ind) => (
                                    <p
                                      key={ind}
                                      className="text-left text-gray-700 dark:text-gray-200"
                                    >
                                      {over}
                                    </p>
                                  ))}
                                </>
                              )}

                              {p.overview.length > 2 && (
                                <button
                                  className="btn btn-xs flex items-center text-white bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 mt-2"
                                  onClick={() => setShowMore(!showMore)}
                                >
                                  {showMore ? "Show less" : "Show more"}
                                  <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    className="w-4 h-4 ml-2 d-inline-block"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                      {p?.image?.map((imgs, ind) => (
                        <motion.div
                          key={ind}
                          className="m-2 p-1 rounded-xl bg-white dark:bg-gray-800"
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: ind * 0.1 }}
                          whileHover={{
                            scale: 1.08,
                            y: -5,
                            boxShadow: "0px 10px 20px rgba(0,0,0,0.25)",
                          }}
                        >
                          <PhotoProvider>
                            <PhotoView src={`images/${imgs}`}>
                              <img
                                className="rounded-xl maxHight"
                                src={`images/${imgs}`}
                                alt="Pic of portfolios"
                              />
                            </PhotoView>
                          </PhotoProvider>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioLayout;
