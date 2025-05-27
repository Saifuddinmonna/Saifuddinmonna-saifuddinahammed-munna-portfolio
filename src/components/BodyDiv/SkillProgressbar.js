import React from "react";
import { IconName, GrUserExpert } from "react-icons/gr";
import SkillTag from "../SkillTag";
import SkillChart from "./SkillChart";

function SkillProgressbar() {
  const similar =
    "Node Mailer Tools: Github, VS-Code,Brackets, Chrome Dev Tools, Heroku, Netlify,Postman, Photoshop, Figma,Illustrator etc.";
  const similararray = similar.split(",");

  return (
    <section id="skills" className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-gray-800 dark:text-white">
        <div className="mb-12 lg:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white capitalize">
            My Professional <span className="text-indigo-600 dark:text-indigo-400">Skills...</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-6 lg:gap-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
          {/* Progress Bars */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-xl dark:hover:shadow-indigo-500/20 rounded-xl p-6">
            <div className="flex flex-col space-y-3 bg-white dark:bg-gray-800">
              <div className="relative w-full bg-gray-50 dark:bg-gray-700 rounded">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-1">
                  HTML
                </label>
                <div
                  style={{ width: "100%" }}
                  className="absolute top-0 h-4 rounded shim-blue"
                ></div>
              </div>

              <div className="relative w-full bg-gray-50 dark:bg-gray-700 rounded">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-1">
                  CSS
                </label>
                <div style={{ width: "98%" }} className="absolute top-0 h-4 rounded shim-red"></div>
              </div>

              <div className="relative w-full bg-gray-50 dark:bg-gray-700 rounded">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-1">
                  Bootstrap
                </label>
                <div
                  style={{ width: "95%" }}
                  className="absolute top-0 h-4 rounded shim-blue"
                ></div>
              </div>

              <div className="relative w-full bg-gray-50 dark:bg-gray-700 rounded">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-1">
                  TailwindCSS
                </label>
                <div
                  style={{ width: "98%" }}
                  className="absolute top-0 h-4 rounded shim-green"
                ></div>
              </div>

              <div className="relative w-full bg-gray-50 dark:bg-gray-700 rounded">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-1">
                  JavaScript
                </label>
                <div
                  style={{ width: "95%" }}
                  className="absolute top-0 h-4 rounded shim-blue"
                ></div>
              </div>

              <div className="relative w-full bg-gray-50 dark:bg-gray-700 rounded">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-1">
                  TypeScript
                </label>
                <div style={{ width: "75%" }} className="absolute top-0 h-4 rounded shim-red"></div>
              </div>

              <div className="relative w-full bg-gray-50 dark:bg-gray-700 rounded">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-1">
                  React
                </label>
                <div
                  style={{ width: "90%" }}
                  className="absolute top-0 h-4 rounded shim-green"
                ></div>
              </div>

              <div className="relative w-full bg-gray-50 dark:bg-gray-700 rounded">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-1">
                  NextJs
                </label>
                <div
                  style={{ width: "60%" }}
                  className="absolute top-0 h-4 rounded shim-blue"
                ></div>
              </div>

              <div className="relative w-full bg-gray-50 dark:bg-gray-700 rounded">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-1">
                  NodeJs
                </label>
                <div
                  style={{ width: "70%" }}
                  className="absolute top-0 h-4 rounded shim-green"
                ></div>
              </div>

              <div className="relative w-full bg-gray-50 dark:bg-gray-700 rounded">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-1">
                  MongoDb
                </label>
                <div style={{ width: "80%" }} className="absolute top-0 h-4 rounded shim-red"></div>
              </div>

              <div className="relative w-full bg-gray-50 dark:bg-gray-700 rounded">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-1">
                  SQL (Postgresql)
                </label>
                <div
                  style={{ width: "60%" }}
                  className="absolute top-0 h-4 rounded shim-green"
                ></div>
              </div>

              <div className="relative w-full bg-gray-50 dark:bg-gray-700 rounded">
                <label className="block text-xl font-semibold text-gray-800 dark:text-white mt-3 mb-1">
                  Pisma
                </label>
                <div style={{ width: "55%" }} className="absolute top-0 h-4 rounded shim-red"></div>
              </div>
            </div>
          </div>

          {/* Skills Chart */}
          <SkillChart />

          {/* Skills Details */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-xl dark:hover:shadow-indigo-500/20 rounded-xl p-6 mt-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white capitalize mb-6">
              Skills <span className="text-indigo-600 dark:text-indigo-400">Details</span>
            </h1>
            <div className="border bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-[0_0_10px_gray] duration-300 grid shadow-md">
              <div className="rounded-lg">
                <h4 className="text-strong text-bold bg-gradient-to-r from-cyan-500 to-blue-500 p-2 m-3 rounded d-block text-left">
                  Expertise:
                </h4>
                <p className="p-2 text-lg grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                  {"JavaScript, ReactJS, Node.js, MongoDB, Mongoose, Express.js, Redux, SQL, PostgreSQL, Rest API, Html5, CSS3, Bootstrap-5, tailwind CSS, ES6, Rest API, ReactRouter, React Hook, DaisyUi, familiar with Headless, EmailJS, Npm Packages"
                    .split(",")
                    .map((tp, idx) => (
                      <SkillTag key={idx} name={tp} />
                    ))}
                </p>
                <h4 className="text-strong text-bold bg-gradient-to-r from-cyan-500 to-blue-500 p-2 m-3 rounded d-block text-left">
                  Comfortable:
                </h4>
                <p className="p-2 text-lg grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                  {"Firebase, Prisma, Material UI, Next.Js, Figma, SSL-COMMERCE and Stripe, GitHub, claude.ai, Typescript, Prticle.js"
                    .split(",")
                    .map((tp, idx) => (
                      <SkillTag key={idx} name={tp} />
                    ))}
                </p>
                <h4 className="text-strong text-bold bg-gradient-to-r from-cyan-500 to-blue-500 p-2 m-3 rounded d-block text-left">
                  Familiar:
                </h4>
                <p className="p-2 text-lg grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                  {"Node Mailer Tools, Github, VS-Code, Brackets, Chrome Dev Tools, Heroku, Netlify, Postman, Photoshop, Figma, Illustrator"
                    .split(",")
                    .map((tp, idx) => (
                      <SkillTag key={idx} name={tp} />
                    ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SkillProgressbar;
