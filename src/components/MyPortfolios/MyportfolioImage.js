import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useLoaderData, useParams } from "react-router-dom";
import {
  FaEye,
  FaExternalLinkAlt,
  FaGithub,
  FaServer,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import { getAllPortfolioProjects, getPortfolioProject } from "../../services/apiService";

const MyportfolioImage = () => {
  const [datas, setDatas] = useState();
  const [datas2, setDatas2] = useState();
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const datas3 = useLoaderData({});
  const websiteName = useParams();
  const nameFilter = websiteName?.UsedPhone;
  useEffect(() => {
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      try {
        const response = await getAllPortfolioProjects();
        // response is an object with a data property (the array)
        setDatas2(response.data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        setDatas2([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolioData();
  }, []);

  console.log("data from response with server data ", datas2);

  const dataFilter = async props => {
    const newData = await datas2.filter(data => data.name == nameFilter);
    setDatas2(newData);
    console.log(nameFilter);
    console.log(newData);
  };

  useEffect(() => {
    dataFilter();
  }, [nameFilter]);

  console.log(datas2);
  console.log(websiteName);

  console.log(nameFilter);

  return (
    <div className="min-h-screen bg-[var(--background-default)] text-[var(--text-primary)]">
      <div className="col-span-6">
        {isLoading ? (
          <motion.div
            className="flex items-center justify-center min-h-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-main)] mx-auto mb-4"></div>
              <p className="text-[var(--text-secondary)]">Loading project details...</p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {datas2?.map((project, ind) => (
              <motion.div
                key={ind}
                className="container p-3 m-5 shadow-xl border border-[var(--border-color)] rounded-xl mx-auto bg-[var(--background-paper)]"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{
                  duration: 0.6,
                  delay: ind * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 },
                }}
              >
                <section className="text-[var(--text-secondary)] body-font">
                  <div className="container p-3 m-3 mx-auto">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font text-center text-[var(--text-primary)] mb-20">
                      {project.category}
                      <br className="hidden sm:block" />
                      {project.name}
                    </h1>
                    <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
                      <div className="p-4 md:w-1/2 lg:w-1/3 flex">
                        <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-[var(--primary-main)]/20 text-[var(--primary-main)] mb-4 flex-shrink-0"></div>
                        <div className="flex-grow pl-6">
                          <motion.a
                            href={project.liveWebsite}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--secondary-main)] hover:bg-[var(--secondary-dark)] rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaExternalLinkAlt className="w-4 h-4" />
                            <span>Live Website</span>
                          </motion.a>

                          <motion.a
                            href={project.liveWebsiteRepo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--secondary-main)] hover:bg-[var(--secondary-dark)] rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg mt-2"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaGithub className="w-4 h-4" />
                            <span>Website Code</span>
                          </motion.a>

                          {project.liveServersite && (
                            <motion.a
                              href={project.liveServersite}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--success-main)] hover:bg-[var(--success-dark)] rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg mt-2"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaServer className="w-4 h-4" />
                              <span>Live Server</span>
                            </motion.a>
                          )}

                          {project.liveServersiteRepo && (
                            <motion.a
                              href={project.liveServersiteRepo}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--success-main)] hover:bg-[var(--success-dark)] rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg mt-2"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaGithub className="w-4 h-4" />
                              <span>Server Code</span>
                            </motion.a>
                          )}
                        </div>
                      </div>
                      <div className="p-4 md:w-1/3 flex">
                        <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-[var(--primary-main)]/20 text-[var(--primary-main)] mb-4 flex-shrink-0"></div>
                        <div className="flex-grow pl-6">
                          <h2 className="text-[var(--text-primary)] bg-gradient-to-r from-[var(--secondary-light)] to-[var(--secondary-dark)] p-2 rounded text-2xl font-medium mb-2">
                            Used Technologies
                          </h2>
                          <p className="leading-relaxed text-base text-[var(--text-secondary)]">
                            {project.technology}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 md:w-1/3 flex">
                        <div className="flex-grow pl-6">
                          <h2 className="text-[var(--text-primary)] bg-gradient-to-r from-[var(--secondary-light)] to-[var(--secondary-dark)] p-2 rounded text-2xl font-medium mb-2">
                            Overview
                          </h2>
                          {showMore ? (
                            <>
                              {project.overview.map((over, ind) => (
                                <p key={ind} className="text-left text-[var(--text-secondary)]">
                                  {over}
                                </p>
                              ))}
                            </>
                          ) : (
                            <>
                              {project.overview.slice(0, 2).map((over, ind) => (
                                <p key={ind} className="text-left text-[var(--text-secondary)]">
                                  {over}
                                </p>
                              ))}
                            </>
                          )}

                          <motion.button
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--error-main)] hover:bg-[var(--error-dark)] rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg mt-3"
                            onClick={() => setShowMore(!showMore)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>{showMore ? "Show less" : "Show more"}</span>
                            <motion.div
                              animate={{ rotate: showMore ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {showMore ? (
                                <FaChevronUp className="w-4 h-4" />
                              ) : (
                                <FaChevronDown className="w-4 h-4" />
                              )}
                            </motion.div>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Enhanced Photo Gallery Section */}
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-6 text-center">
                    Project Screenshots
                  </h3>

                  <PhotoProvider
                    maskOpacity={0.8}
                    maskClosable={true}
                    photoClosable={true}
                    bannerVisible={false}
                    overlayRender={({ overlay, index }) => (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                        {index + 1} / {project?.image?.length}
                      </div>
                    )}
                  >
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                    >
                      {project?.image?.map((imgs, ind) => (
                        <motion.div
                          key={ind}
                          className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500"
                          variants={{
                            hidden: { opacity: 0, y: 50, scale: 0.9 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: {
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                              },
                            },
                          }}
                          whileHover={{
                            y: -8,
                            scale: 1.02,
                            transition: { duration: 0.3 },
                          }}
                        >
                          {/* Image Container */}
                          <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                            <PhotoView src={`images/${imgs}`} index={ind}>
                              <motion.img
                                src={`images/${imgs}`}
                                alt={`${project.name} screenshot ${ind + 1}`}
                                className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-700 ease-out"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: ind * 0.1 }}
                                loading="lazy"
                              />
                            </PhotoView>

                            {/* Hover Overlay */}
                            <motion.div
                              className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                            >
                              <motion.div
                                className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                                initial={{ scale: 0.8, y: 20 }}
                                whileHover={{ scale: 1, y: 0 }}
                              >
                                <FaEye className="w-4 h-4" />
                                <span>Click to view</span>
                              </motion.div>
                            </motion.div>

                            {/* Image Counter Badge */}
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                              {ind + 1}
                            </div>
                          </div>

                          {/* Image Title */}
                          <div className="p-3 bg-[var(--background-paper)] dark:bg-[var(--background-elevated)]">
                            <p className="text-sm text-[var(--text-secondary)] font-medium truncate">
                              Screenshot {ind + 1}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </PhotoProvider>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default MyportfolioImage;
