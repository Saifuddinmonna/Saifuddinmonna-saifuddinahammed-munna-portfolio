import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';

// Assuming portfolios.json is in the public folder or accessible via fetch
import allProjectsData from "./portfolios.json"; // Direct import if in src

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const MyPortfolios = () => {
    const [recentProjects, setRecentProjects] = useState([]);

    useEffect(() => {
        // If using direct import:
        setRecentProjects(allProjectsData.slice(0, 3)); // Show first 3 projects as a teaser

        // If fetching from public folder:
        // fetch('/portfolios.json') // Make sure this path is correct
        //     .then(res => res.json())
        //     .then(data => {
        //         setRecentProjects(data.slice(0, 3)); // Show first 3 projects
        //     })
        //     .catch(error => console.error("Failed to load projects for teaser:", error));
    }, []);

    return (
        <section className="py-16 md:py-20 bg-white rounded-xl shadow-lg"> {/* Section background */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2 
                    className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                >
                    Explore My <span className="text-indigo-600">Recent Work</span>
                </motion.h2>

                {recentProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {recentProjects.map((project, index) => (
                            <motion.div
                                key={project.name} // Assuming 'name' is unique, or use an 'id' if available
                                className="bg-slate-50 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group"
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                custom={index} 
                                whileHover={{ y: -5, boxShadow: "0px 8px 16px rgba(0,0,0,0.1)" }} // Card hover effect
                            >
                                {/* Link for the image */}
                                <Link to={`/projects/${encodeURIComponent(project.name)}`} className="block">
                                    <div className="aspect-video overflow-hidden">
                                        <img 
                                            src={`/images/${project.image[0]}`} // Adjust path if images are not in public/images
                                            alt={project.name} 
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </Link>
                                
                                <div className="p-6">
                                    {/* Link for the title */}
                                    <Link to={`/projects/${encodeURIComponent(project.name)}`} className="block mb-2">
                                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                            {project.name}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-indigo-500 mb-3">{project.category}</p>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                        {project.overview[0]} {/* Show first line of overview */}
                                    </p>
                                    {/* Link for the "View Project" text/button */}
                                  <Link 
    to={`/projects/${encodeURIComponent(project.name)}`} 
    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors group-hover:underline"
>
    View Project
    <FaExternalLinkAlt className="ml-2 h-3 w-3" />
</Link>
                                </div> {/* This is the correct closing tag for the div with className="p-6" */}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 mb-12">Loading projects...</p>
                )}

                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Link to="/PortfolioLayout"> {/* Updated to link to PortfolioLayout */}
                        <motion.button 
                            className="text-indigo-600 font-bold py-3 px-8 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 transform hover:-translate-y-0.5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                            whileHover={{ 
                                borderColor: "#4f46e5", // indigo-600
                                boxShadow: "0 0 12px rgba(99, 102, 241, 0.4)", // Subtle glow with indigo
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            View All Projects
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default MyPortfolios;