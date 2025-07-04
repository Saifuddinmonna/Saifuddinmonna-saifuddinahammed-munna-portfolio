import React from "react";
import { useParams, Link } from "react-router-dom";
// import portfoliosData from "../components/MyPortfolios/portfolios.json"; //
import { useState, useEffect } from "react";
import { getAllPortfolioProjects, getPortfolioProject } from "../services/apiService";
// Adjust path if ProjectPage.js is elsewhere
import {
  FaExternalLinkAlt,
  FaGithub,
  FaHome,
  FaListUl,
  FaCogs,
  FaImages,
  FaLink,
  FaExclamationCircle,
} from "react-icons/fa";
import NavbarPage from "../components/layout/NavbarPage/NavbarPage"; // Corrected import to NavbarPage.js

const ProjectPage = () => {
  const { datasServer, setDatasServer } = useState();
  const { isLoading, setIsLoading } = useState();
  useEffect(() => {
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      try {
        const response = await getAllPortfolioProjects();
        // response is an object with a data property (the array)
        setDatasServer(response.data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        setDatasServer([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolioData();
  }, []);
  const { projectName } = useParams(); // This matches :projectName in your App.js route
  console.log("[ProjectPage] projectName from URL params:", projectName);

  const project = datasServer.find(p => p.name === projectName);
  console.log("[ProjectPage] Found project object:", project);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
        <FaExclamationCircle className="text-7xl text-red-400 mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-6">
          Project Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-md">
          Could not find project: "{projectName}". Please check the name or go back.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-base font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaHome className="mr-2" />
          Go Back to Home
        </Link>
      </div>
    );
  }

  // The 'technology' field is an array with a single comma-separated string.
  // Let's split it into an array of individual technologies.
  const technologies = project.technology[0]
    ? project.technology[0].split(",").map(tech => tech.trim())
    : [];
  const features = project.overview || []; // Assuming 'overview' is your features list

  return (
    <div className="bg-gray-100 min-h-screen py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarPage />
      </div>
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Project Hero Image */}
        {project.image &&
          project.image.length > 0 &&
          (() => {
            const heroImagePath = `/images/${project.image[2]}`; // Corrected: Use the first image from the array
            console.log("[ProjectPage] Attempting to load Hero Image from:", heroImagePath);
            return (
              <img
                src={heroImagePath}
                alt={`${project.name} main screenshot`}
                className="w-full h-72 md:h-96 object-cover"
              />
            );
          })()}
        {/* Test image removed, dynamic hero image should work now */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
            {project.name}
          </h1>
          <p className="inline-block bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-semibold mb-8 tracking-wide">
            {project.category}
          </p>

          <section className="mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaListUl className="mr-3 text-blue-500" /> Project Overview & Features
            </h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 leading-relaxed pl-5">
              {features.map((item, index) => (
                <li key={index}>{item.startsWith("❖") ? item.substring(2) : item}</li>
              ))}
            </ul>
          </section>

          {technologies.length > 0 && (
            <section className="mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaCogs className="mr-3 text-blue-500" /> Technologies Used
              </h2>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-md text-sm font-medium shadow-sm hover:bg-indigo-200 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}
          {project.image && project.image.length > 0 && (
            <section className="mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaImages className="mr-3 text-blue-500" /> Screenshots
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.image.map((img, index) =>
                  (() => {
                    const screenshotPath = `/images/${img}`; // Corrected: Use the current image from map and remove /public/
                    console.log(
                      `[ProjectPage] Attempting to load Screenshot ${index + 1} from:`,
                      screenshotPath
                    );
                    return (
                      <img
                        key={index}
                        src={screenshotPath}
                        alt={`${project.name} screenshot ${index + 1}`}
                        className="w-full h-auto object-cover rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      />
                    );
                  })()
                )}
              </div>
            </section>
          )}

          <section className="mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaLink className="mr-3 text-blue-500" /> Project Links
            </h2>
            <div className="space-y-4">
              {project.liveWebsite && (
                <ProjectLink
                  href={project.liveWebsite}
                  icon={<FaExternalLinkAlt />}
                  text="Live Website"
                />
              )}
              {project.liveWebsiteRepo && (
                <ProjectLink
                  href={project.liveWebsiteRepo}
                  icon={<FaGithub />}
                  text="Client-Side Repository"
                />
              )}
              {project.liveServersite && (
                <ProjectLink
                  href={project.liveServersite}
                  icon={<FaExternalLinkAlt />}
                  text="Server Site (Live)"
                />
              )}
              {project.liveServersiteRepo && (
                <ProjectLink
                  href={project.liveServersiteRepo}
                  icon={<FaGithub />}
                  text="Server-Side Repository"
                />
              )}
            </div>
          </section>
          <div className="mt-12 text-center">
            <Link
              to="/mywork" // Link to the main portfolio/mywork page
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-base font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FaHome className="mr-2" />
              Back to All Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectLink = ({ href, icon, text }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg font-medium transition-all duration-200 group text-base shadow-sm border border-gray-300 hover:shadow-md"
  >
    {React.cloneElement(icon, {
      className: "mr-3 w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors",
    })}
    {text}
  </a>
);

export default ProjectPage;
