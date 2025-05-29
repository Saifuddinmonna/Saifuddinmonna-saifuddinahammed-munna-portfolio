import React from "react";
import { FaReact, FaNodeJs, FaDatabase } from "react-icons/fa";
import { SiJavascript, SiTailwindcss } from "react-icons/si";
import { AiOutlineApi } from "react-icons/ai";

const SkillsOverview = () => {
  const cardBaseClasses =
    "p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 backdrop-blur-sm";
  const cardHoverClasses =
    "hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]";

  const iconWrapperClasses =
    "inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl mb-6 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/5";
  const iconClasses = "w-8 h-8 text-indigo-600 dark:text-indigo-400";

  return (
    <section
      id="skills"
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="mb-16 lg:mb-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white capitalize mb-6">
            What I Skills{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">
              offer
            </span>
          </h1>
          <p
            className="mt-4 bold font-bold
           text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            My technical Tecnical support and core competencies in web development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Frontend Development */}
          <div className={`${cardBaseClasses} ${cardHoverClasses} text-center group`}>
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
              Expertise in React.js, Next.js, and modern frontend frameworks. Strong focus on
              creating responsive and interactive user interfaces.
            </p>
          </div>

          {/* JavaScript Expertise */}
          <div className={`${cardBaseClasses} ${cardHoverClasses} text-center group`}>
            <div
              className={`${iconWrapperClasses} group-hover:scale-110 transition-transform duration-300`}
            >
              <SiJavascript
                className={`${iconClasses} group-hover:scale-110 transition-transform duration-300`}
              />
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white capitalize">
              JavaScript Mastery
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Advanced JavaScript programming including ES6+, TypeScript, and modern development
              patterns and practices.
            </p>
          </div>

          {/* Backend Development */}
          <div className={`${cardBaseClasses} ${cardHoverClasses} text-center group`}>
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
              Node.js and Express.js development with focus on building scalable and efficient
              server-side applications.
            </p>
          </div>

          {/* Database Management */}
          <div className={`${cardBaseClasses} ${cardHoverClasses} text-center group`}>
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
              Experience with MongoDB, MySQL, and database design. Proficient in both SQL and NoSQL
              database systems.
            </p>
          </div>

          {/* API Development */}
          <div className={`${cardBaseClasses} ${cardHoverClasses} text-center group`}>
            <div
              className={`${iconWrapperClasses} group-hover:scale-110 transition-transform duration-300`}
            >
              <AiOutlineApi
                className={`${iconClasses} group-hover:scale-110 transition-transform duration-300`}
              />
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white capitalize">
              API Development
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              RESTful API design and implementation, API integration, and microservices
              architecture.
            </p>
          </div>

          {/* CSS & Styling */}
          <div className={`${cardBaseClasses} ${cardHoverClasses} text-center group`}>
            <div
              className={`${iconWrapperClasses} group-hover:scale-110 transition-transform duration-300`}
            >
              <SiTailwindcss
                className={`${iconClasses} group-hover:scale-110 transition-transform duration-300`}
              />
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white capitalize">
              CSS & Styling
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Advanced Tailwind CSS, CSS3, Sass/SCSS, and modern styling techniques for creating
              beautiful user interfaces.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsOverview;
