import ProgressBar from "react-bootstrap/ProgressBar";
import { IconName, GrUserExpert } from "react-icons/gr";
import SkillTag from "../SkillTag"; // path adjust koro jodi onno folder e thake

function SkillProgressbar() {
	const similar =
		"Node Mailer Tools: Github, VS-Code,Brackets, Chrome Dev Tools, Heroku, Netlify,Postman, Photoshop, Figma,Illustrator etc.";
	const similararray = similar.split(",");
	console.log(similararray);
	return (
		<div className="">
			<div className=" p-4">
				<div className="m-3  border  rounded-xl">
					<h1 class="text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl black:text-white white:text-dark">
						My Professional{" "}
						<span class="text-blue-500"> Skills...</span>
					</h1>
				</div>

				<div className=" grid grid-cols-1 md:grid-cols-1   lg:grid-cols-1 xl:grid-cols-1 justify-center gap-3 ">
					<div className="border shadow-lg transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-104 hover:bg-indigo-200 duration-300 grid items-center text-justify pt-8 p-3 m-1 rounded-lg">
						<div class=" flex flex-col space-y-3">
							<div class="relative w-full  bg-gray-200 rounded">
								<label
									class="block text-xl text-bold mt-3 mb-1"
									for="story">
									HTML
								</label>
								<div
									style={{ width: "100%" }}
									class="absolute top-0 h-4 rounded shim-blue"></div>
							</div>

							<div class="relative w-full  bg-gray-200 rounded">
								<label
									class="block text-xl text-bold mt-3 mb-1"
									for="story">
									CSS
								</label>
								<div
									style={{ width: "98%" }}
									class="absolute top-0 h-4 rounded shim-red"></div>
							</div>
							<div class="relative w-full  bg-gray-200 rounded">
								<label
									class="block text-xl text-bold mt-3 mb-1"
									for="story">
									Bootstrap

								</label>
								<div
									style={{ width: "95%" }}
									class="absolute top-0 h-4 rounded shim-blue"></div>
							</div>
							<div class="relative w-full  bg-gray-200 rounded">
								<label
									class="block text-xl text-bold mt-3 mb-1"
									for="story">
									TailwindCSS
								</label>
								<div
									style={{ width: "98%" }}
									class="absolute top-0 h-4 rounded shim-green "></div>
							</div>

							<div class="relative w-full  bg-gray-200 rounded">
								<label
									class="block text-xl text-bold  mt-3 mb-1"
									for="story">
									JavaScript
								</label>
								<div
									style={{ width: "95%" }}
									class="absolute top-0 h-4 rounded shim-blue"></div>
							</div>
							<div class="relative w-full  bg-gray-200 rounded">
								<label
									class="block text-xl text-bold  mt-3 mb-1"
									for="story">
									TypeScript
								</label>
								<div
									style={{ width: "75%" }}
									class="absolute top-0 h-4 rounded shim-red"></div>
							</div>
							<div class="relative w-full  bg-gray-200 rounded">
								<label
									class="block text-xl text-bold mt-3 mb-1"
									for="story">
									React
								</label>
								<div
									style={{ width: "90%" }}
									class="absolute top-0 h-4 rounded shim-green"></div>
							</div>

							<div class="relative w-full  bg-gray-200 rounded">
								<label
									class="block text-xl text-bold mt-3 mb-1"
									for="story">
									NextJs
								</label>
								<div
									style={{ width: "60%" }}
									class="absolute top-0 h-4 rounded shim-blue"></div>
							</div>

							<div class="relative w-full  bg-gray-200 rounded">
								<label
									class="block text-xl text-bold mt-3 mb-1"
									for="story">
									NodeJs
								</label>
								<div
									style={{ width: "70%" }}
									class="absolute top-0 h-4 rounded shim-green"></div>
							</div>
							<div class="relative w-full  bg-gray-200 rounded">
								<label
									class="block text-xl text-bold mt-3 mb-1"
									for="story">
									MongoDb
								</label>
								<div
									style={{ width: "80%" }}
									class="absolute top-0 h-4 rounded shim-red"></div>
							</div>
							<div class="relative w-full  bg-gray-200 rounded">
								<label
									class="block text-xl text-bold mt-3 mb-1"
									for="story">
									SQL (Postgresql)
								</label>
								<div
									style={{ width: "60%" }}
									class="absolute top-0 h-4 rounded shim-green"></div>
							</div>
							<div class="relative w-full  bg-gray-200 rounded">
								<label
									class="block text-xl text-bold mt-3 mb-1"
									for="story">
									Pisma
								</label>
								<div
									style={{ width: "55%" }}
									class="absolute top-0 h-4 rounded shim-red"></div>
							</div>
						</div>
					</div>
					<div className="border shadow-lg transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-104 mt-4  text-justify pt-8  rounded-lg">
						<h1 class="text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl black:text-white white:text-dark mb-2 mt-4">
							Skills'
							<span class="text-blue-500">Overview...</span>
						</h1>
						<div className="border  rounded-lg hover:shadow-[0_0_10px_gray] duration-300  grid shadow-md ">
							<div className="  rounded-lg ">
								{" "}
								<h4 className="text-strong text-bold bg-gradient-to-r from-cyan-500 to-blue-500 ... p-2 m-3 rounded   d-block text-left ">
									Expertise:
								</h4>
								
								<p className="p-2 text-lg grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
  {"JavaScript, ReactJS, Node.js, MongoDB, Mongoose, Express.js, Redux,SQL, PostgreSQL, Rest API, Html5, CSS3, Bootstrap-5, tailwind CSS ,ES6, Rest API, ReactRouter, React Hook, DaisyUi , familiar withHeadless ,EmailJS, Npm Packages".split(",").map((tp, idx) => (
    <SkillTag key={idx} name={tp} />
  ))}
</p>

								<h4 className="text-strong text-bold bg-gradient-to-r from-cyan-500 to-blue-500 ... p-2 m-3 rounded d-block text-left ">
									Comfortable:
								</h4>
								
								<p className="p-2 text-lg grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
  {"Firebase, Prisma, Material UI, Next.Js,Figma, SSL-COMMERCE and Stripe, GitHub, claude.ai, Typescript,Prticle.js".split(",").map((tp, idx) => (
    <SkillTag key={idx} name={tp} />
  ))}
</p>
								<h4 className="text-strong text-bold bg-gradient-to-r from-cyan-500 to-blue-500 ... p-2 m-3 rounded  d-block text-left ">
									Familiar:
								</h4>
								<p className="p-2 text-lg grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
  {"Node Mailer Tools, Github, VS-Code, Brackets, Chrome Dev Tools, Heroku, Netlify, Postman, Photoshop, Figma, Illustrator".split(",").map((tp, idx) => (
    <SkillTag key={idx} name={tp} />
  ))}
</p>
							</div>
						</div>
						<div className="border  rounded-lg  hover:shadow-[0_0_10px_gray] duration-300 grid shadow-md">
							<h4 className="text-strong text-bold bg-gradient-to-r from-cyan-500 to-blue-500 ... p-2 m-3 rounded ">
								Front end:
							</h4>
							<p className="p-2 text-lg grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
  {"JavaScript, TypeScript, React, Redux,Redux-Thunk/Saga, HTML5, CSS3, Styledcomponents, SCSS".split(",").map((tp, idx) => (
    <SkillTag key={idx} name={tp} />
  ))}
</p>
							<h4 className="text-strong text-bold bg-gradient-to-r from-cyan-500 to-blue-500 ... p-2 m-3 rounded ">
								Back end:
							</h4>
							<p className="p-2 text-lg grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
  {"Node.js, Express.js, MongoDB, PostgreSQL, Firebase, REST APIs".split(",").map((tp, idx) => (
    <SkillTag key={idx} name={tp} />
  ))}
</p>
							<h4 className="text-strong text-bold bg-gradient-to-r from-cyan-500 to-blue-500 ... p-2 m-3 rounded ">
								DevOps:
							</h4>
							
							<p className="p-2 text-lg grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
  {"Git, GitHub, VS Code, Netlify, Vercel, Heroku ,VS Code , React Dev Tools, Redux Dev tools ,Figma, Brackets, Chrome DevTools, Heroku, Netlify, Postman, Photoshop,Illustrator etc.".split(",").map((tp, idx) => (
    <SkillTag key={idx} name={tp} />
  ))}
</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SkillProgressbar;
