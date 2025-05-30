import React from "react";
import { motion } from "framer-motion";
import { FaCode, FaTools, FaLaptopCode } from "react-icons/fa";
import {
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiExpress,
  SiRedux,
  SiHtml5,
  SiCss3,
  SiBootstrap,
  SiTailwindcss,
  SiMysql,
} from "react-icons/si";
import { DiPostgresql } from "react-icons/di";
import { DiFirebase } from "react-icons/di";
import { TbBrandNextjs } from "react-icons/tb";
import { BsGit, BsGithub } from "react-icons/bs";

/**
 * ProfessionalProfile Component
 * Displays professional skills, expertise, and tools in an animated grid layout
 */
const ProfessionalProfile = () => {
  // Data for expertise section with icons and names
  const expertise = [
    { icon: <SiJavascript className="text-yellow-400" />, name: "JavaScript" },
    { icon: <SiReact className="text-blue-400" />, name: "ReactJS" },
    { icon: <SiNodedotjs className="text-green-500" />, name: "Node.js" },
    { icon: <SiMongodb className="text-green-600" />, name: "MongoDB" },
    { icon: <SiExpress className="text-gray-800" />, name: "Express.js" },
    { icon: <SiRedux className="text-purple-500" />, name: "Redux" },
    { icon: <SiHtml5 className="text-orange-500" />, name: "HTML5" },
    { icon: <SiCss3 className="text-blue-500" />, name: "CSS3" },
    { icon: <SiBootstrap className="text-purple-600" />, name: "Bootstrap-5" },
    { icon: <SiTailwindcss className="text-cyan-500" />, name: "Tailwind CSS" },
  ];

  // Data for comfortable technologies section
  const comfortable = [
    { icon: <DiPostgresql className="text-blue-600" />, name: "PostgreSQL" },
    { icon: <SiMysql className="text-blue-600" />, name: "SQL" },
    { icon: <DiFirebase className="text-orange-500" />, name: "Firebase" },
    { icon: <TbBrandNextjs className="text-black dark:text-white" />, name: "Next.js" },
    { icon: <BsGit className="text-orange-600" />, name: "Git" },
    { icon: <BsGithub className="text-gray-800 dark:text-white" />, name: "GitHub" },
  ];

  // List of development tools
  const tools = [
    "VS Code",
    "Chrome Dev Tools",
    "Netlify",
    "Postman",
    "Figma",
    "Photoshop",
    "Illustrator",
  ];

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Professional Summary Section */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Summary
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            I want to be an experienced and skilful Web Developer to build up a career as a Full
            Stack Web Developer. I also have a special interest to develop NPM packages to build
            more efficient and effective user experience both front end and back-end.
          </p>
        </motion.div>

        {/* Expertise Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="flex items-center mb-8">
            <FaCode className="text-4xl text-blue-600 mr-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Expertise</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {expertise.map((skill, index) => (
              <motion.div
                key={index}
                className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.05 }}
                variants={itemVariants}
              >
                <span className="text-2xl mr-3">{skill.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comfortable Technologies Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <div className="flex items-center mb-8">
            <FaLaptopCode className="text-4xl text-green-600 mr-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Comfortable With</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {comfortable.map((skill, index) => (
              <motion.div
                key={index}
                className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.05 }}
                variants={itemVariants}
              >
                <span className="text-2xl mr-3">{skill.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tools Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center mb-8">
            <FaTools className="text-4xl text-purple-600 mr-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Tools</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
                whileHover={{ scale: 1.05 }}
                variants={itemVariants}
              >
                <span className="text-gray-700 dark:text-gray-300">{tool}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfessionalProfile;
