import React from "react";
import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaDatabase, FaGitAlt, FaDocker, FaAws } from "react-icons/fa";
import {
  SiJavascript,
  SiTailwindcss,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiNextdotjs,
  SiRedux,
  SiExpress,
  SiReact,
} from "react-icons/si";
import { AiOutlineApi, AiOutlineSecurityScan, AiOutlineCloudServer } from "react-icons/ai";

const SkillsOverview = () => {
  // Base classes for consistent styling
  const cardBaseClasses =
    "p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 backdrop-blur-sm";
  const cardHoverClasses =
    "hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]";

  const iconWrapperClasses =
    "inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl mb-6 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/5";
  const iconClasses = "w-8 h-8 text-indigo-600 dark:text-indigo-400";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <section
      id="skills"
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-16 lg:mb-20 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white capitalize mb-6">
            My Technical{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">
              Expertise
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Specialized in full-stack development with a focus on modern technologies and best
            practices
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Frontend Development */}
          <motion.div
            className={`${cardBaseClasses} ${cardHoverClasses} text-center group`}
            variants={itemVariants}
          >
            <div
              className={`${iconWrapperClasses} group-hover:scale-110 transition-transform duration-300`}
            >
              <FaReact
                className={`${iconClasses} group-hover:scale-110 transition-transform duration-300`}
              />
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white capitalize">
              Frontend Development
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Expert in React.js, Next.js, and modern frontend frameworks. Specialized in creating
              responsive, interactive UIs with TypeScript and Redux for state management.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <SiReact className="w-6 h-6 text-blue-500" />
              <SiNextdotjs className="w-6 h-6 text-gray-800 dark:text-white" />
              <SiRedux className="w-6 h-6 text-purple-500" />
            </div>
          </motion.div>

          {/* Backend Development */}
          <motion.div
            className={`${cardBaseClasses} ${cardHoverClasses} text-center group`}
            variants={itemVariants}
          >
            <div
              className={`${iconWrapperClasses} group-hover:scale-110 transition-transform duration-300`}
            >
              <FaNodeJs
                className={`${iconClasses} group-hover:scale-110 transition-transform duration-300`}
              />
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white capitalize">
              Backend Development
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Proficient in Node.js and Express.js development. Experience in building scalable,
              secure, and efficient server-side applications with RESTful APIs.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <FaNodeJs className="w-6 h-6 text-green-500" />
              <SiExpress className="w-6 h-6 text-gray-800 dark:text-white" />
              <AiOutlineApi className="w-6 h-6 text-blue-500" />
            </div>
          </motion.div>

          {/* Database Management */}
          <motion.div
            className={`${cardBaseClasses} ${cardHoverClasses} text-center group`}
            variants={itemVariants}
          >
            <div
              className={`${iconWrapperClasses} group-hover:scale-110 transition-transform duration-300`}
            >
              <FaDatabase
                className={`${iconClasses} group-hover:scale-110 transition-transform duration-300`}
              />
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white capitalize">
              Database Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Skilled in both SQL and NoSQL databases. Experience with MongoDB, PostgreSQL, and
              database design, optimization, and management.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <SiMongodb className="w-6 h-6 text-green-600" />
              <SiPostgresql className="w-6 h-6 text-blue-600" />
              <FaDatabase className="w-6 h-6 text-blue-500" />
            </div>
          </motion.div>

          {/* DevOps & Cloud */}
          <motion.div
            className={`${cardBaseClasses} ${cardHoverClasses} text-center group`}
            variants={itemVariants}
          >
            <div
              className={`${iconWrapperClasses} group-hover:scale-110 transition-transform duration-300`}
            >
              <AiOutlineCloudServer
                className={`${iconClasses} group-hover:scale-110 transition-transform duration-300`}
              />
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white capitalize">
              DevOps & Cloud
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Experience with AWS, Docker, and CI/CD pipelines. Skilled in cloud deployment,
              containerization, and infrastructure management.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <FaAws className="w-6 h-6 text-orange-500" />
              <FaDocker className="w-6 h-6 text-blue-500" />
              <FaGitAlt className="w-6 h-6 text-orange-600" />
            </div>
          </motion.div>

          {/* Security & Performance */}
          <motion.div
            className={`${cardBaseClasses} ${cardHoverClasses} text-center group`}
            variants={itemVariants}
          >
            <div
              className={`${iconWrapperClasses} group-hover:scale-110 transition-transform duration-300`}
            >
              <AiOutlineSecurityScan
                className={`${iconClasses} group-hover:scale-110 transition-transform duration-300`}
              />
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white capitalize">
              Security & Performance
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Focus on application security, performance optimization, and best practices.
              Experience with JWT, OAuth, and security protocols.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <AiOutlineSecurityScan className="w-6 h-6 text-green-500" />
              <SiTypescript className="w-6 h-6 text-blue-500" />
              <SiJavascript className="w-6 h-6 text-yellow-400" />
            </div>
          </motion.div>

          {/* UI/UX Development */}
          <motion.div
            className={`${cardBaseClasses} ${cardHoverClasses} text-center group`}
            variants={itemVariants}
          >
            <div
              className={`${iconWrapperClasses} group-hover:scale-110 transition-transform duration-300`}
            >
              <SiTailwindcss
                className={`${iconClasses} group-hover:scale-110 transition-transform duration-300`}
              />
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white capitalize">
              UI/UX Development
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Expert in Tailwind CSS, responsive design, and modern UI frameworks. Focus on creating
              beautiful, accessible, and user-friendly interfaces.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <SiTailwindcss className="w-6 h-6 text-cyan-500" />
              <SiJavascript className="w-6 h-6 text-yellow-400" />
              <FaReact className="w-6 h-6 text-blue-500" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsOverview;
