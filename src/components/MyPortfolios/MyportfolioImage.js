import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useLoaderData, useParams } from "react-router-dom";

import { getAllPortfolioProjects, getPortfolioProject } from "../../services/apiService";

const MyportfolioImage = () => {
  const [datas, setDatas] = useState();
  const [datas2, setDatas2] = useState();
  const [data4, setData4] = useState();
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
        {datas2?.map((project, ind) => (
          <div
            key={ind}
            className="container p-3 m-5 shadow-xl border border-[var(--border-color)] rounded-xl mx-auto bg-[var(--background-paper)]"
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
                      <p className="text-left mt-1 btn btn-warning btn-sm d-block text-[var(--text-primary)] text-xl capitalize bg-[var(--secondary-main)] hover:bg-[var(--secondary-dark)] transition-colors duration-300">
                        <a
                          className="text-decoration-none"
                          target="_blank"
                          href={project.liveWebsite}
                          rel="noreferrer"
                        >
                          Live Website
                        </a>
                      </p>
                      <p className="text-left mt-1 btn btn-warning btn-sm d-block text-[var(--text-primary)] text-xl bg-[var(--secondary-main)] hover:bg-[var(--secondary-dark)] transition-colors duration-300">
                        <a
                          className="text-decoration-none"
                          target="_blank"
                          href={project.liveWebsiteRepo}
                          rel="noreferrer"
                        >
                          Live Website Repo
                        </a>
                      </p>
                      {project.liveServersite && (
                        <p className="text-left mt-1 btn btn-warning btn-sm d-block text-[var(--text-primary)] text-xl bg-[var(--success-main)] hover:bg-[var(--success-dark)] transition-colors duration-300">
                          <a
                            className="text-decoration-none"
                            target="_blank"
                            href={project.liveServersite}
                            rel="noreferrer"
                          >
                            && ( Live Serversite)
                          </a>
                        </p>
                      )}
                      {project.liveServersiteRepo && (
                        <p className="text-left mt-1 btn btn-warning btn-sm d-block text-[var(--text-primary)] text-xl bg-[var(--success-main)] hover:bg-[var(--success-dark)] transition-colors duration-300">
                          <a
                            className="text-decoration-none"
                            target="_blank"
                            href={project.liveServersiteRepo}
                            rel="noreferrer"
                          >
                            LiveServer Site Repo
                          </a>
                        </p>
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

                      <button
                        className="btn btn-danger d flex bg-[var(--error-main)] hover:bg-[var(--error-dark)] text-white transition-colors duration-300"
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
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {project?.image?.map((imgs, ind) => (
                <div key={ind} className="">
                  <div className="border border-[var(--border-color)] m-2 p-2 rounded transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-[var(--background-elevated)] duration-300">
                    <PhotoProvider>
                      <PhotoView src={`images/${imgs}`}>
                        <img
                          src={`images/${imgs}`}
                          alt="Pic of portfolios"
                          className="w-full h-auto rounded transition-all duration-300 dark:brightness-90 dark:contrast-110"
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
  );
};

export default MyportfolioImage;
