import ProgressBar from "react-bootstrap/ProgressBar";

function StripedExample() {
	return (
		<div className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-50 duration-300">
			<div className=" m-3 mt-10 p-3 border rounded-xl">
				<div className="m-3 p-3 border rounded-xl">
					<h1>My Skills</h1>
				</div>

				<div className=" grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  lg:grid-cols-1 justify-center gap-3">
					<div className="border transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-200 duration-300 grid items-center text-justify pt-8 p-2 m-2 rounded-lg">
						<div class=" flex flex-col space-y-3">
							<div class="relative w-full  bg-gray-200 rounded">
								<label class="block text-sm  mb-1" for="story">
									HTML
								</label>
								<div
									style={{ width: "100%" }}
									class="absolute top-0 h-4 rounded shim-blue"></div>
							</div>

							<div class="relative w-full  bg-gray-200 rounded">
								<label class="block text-sm  mb-1" for="story">
									CSS
								</label>
								<div
									style={{ width: "98%" }}
									class="absolute top-0 h-4 rounded shim-red"></div>
							</div>
							<div class="relative w-full  bg-gray-200 rounded">
								<label class="block text-sm  mb-1" for="story">
									Bootstrap
								</label>
								<div
									style={{ width: "100%" }}
									class="absolute top-0 h-4 rounded shim-green"></div>
							</div>
							<div class="relative w-full  bg-gray-200 rounded">
								<label class="block text-sm  mb-1" for="story">
									TailwindCSS
								</label>
								<div
									style={{ width: "98%" }}
									class="absolute top-0 h-4 rounded shim-blue"></div>
							</div>

							<div class="relative w-full  bg-gray-200 rounded">
								<label class="block text-sm  mb-1" for="story">
									JavaScript
								</label>
								<div
									style={{ width: "95%" }}
									class="absolute top-0 h-4 rounded shim-red"></div>
							</div>
							<div class="relative w-full  bg-gray-200 rounded">
								<label class="block text-sm  mb-1" for="story">
									React
								</label>
								<div
									style={{ width: "90%" }}
									class="absolute top-0 h-4 rounded shim-green"></div>
							</div>

							<div class="relative w-full  bg-gray-200 rounded">
								<label class="block text-sm  mb-1" for="story">
									NextJs
								</label>
								<div
									style={{ width: "60%" }}
									class="absolute top-0 h-4 rounded shim-blue"></div>
							</div>

							<div class="relative w-full  bg-gray-200 rounded">
								<label class="block text-sm  mb-1" for="story">
									NodeJs
								</label>
								<div
									style={{ width: "70%" }}
									class="absolute top-0 h-4 rounded shim-green"></div>
							</div>
							<div class="relative w-full  bg-gray-200 rounded">
								<label class="block text-sm  mb-1" for="story">
									MongoDb
								</label>
								<div
									style={{ width: "80%" }}
									class="absolute top-0 h-4 rounded shim-red"></div>
							</div>
						</div>
					</div>
					<div className="border transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-200 duration-300 grid  text-justify pt-8 p-2 m-2 rounded-lg">
						<div className="border p-2 m-2 rounded-lg  hover:bg-indigo-400 duration-300 grid">
							<h1>Professional Skills</h1>
							<p className=" p-2 m-2 rounded-lg">
								{" "}
								<h4 className="text-strong text-bold text-decoration-underline ">
									{" "}
									Expertise:
								</h4>
								<p>
									JavaScript, ES6, Rest API, ReactJs, React
									Router, React Hook, Html5, CSS3, CSS,
									TailwindCss(DaisyUi and familiar with
									Headless ) Bootstrap-5, Npm Packages,
								</p>
								<h4 className="text-strong text-bold text-decoration-underline ">
									Comfortable:
								</h4>
								<p>
									Node.js, MongoDb, Firebase, Material UI,
									ExpressJs, Redux,
									Next.Js,Typescript,Prticle.js
								</p>
								<h4 className="text-strong text-bold text-decoration-underline ">
									Familiar:
								</h4>
								<p>
									Node Mailer Tools: Github, VS Code ,
									Brackets, Chrome Dev Tools, Heroku, Netlify,
									Postman, Photoshop, Figma,Illustrator etc.
								</p>
							</p>
						</div>
						<div className="border p-2 m-2 rounded-lg  hover:bg-indigo-400 duration-300 grid">
							<h4 className="text-strong text-bold text-decoration-underline ">
								Front end:
							</h4>
							<p>
								JavaScript, TypeScript, React, Redux,
								Redux-Thunk/Saga, HTML5, CSS3, Styled
								components, SCSS, .
							</p>
							<h4 className="text-strong text-bold text-decoration-underline ">
								Back end:
							</h4>
							<p className=" p-2 m-2 rounded-lg">
								Node.js, Express.js, MongoDB, Mongoose,
								Nodemailer, Node-Geocoder, Stripe, Paypal API,
								SSL commerce,{" "}
							</p>
							<h4 className="text-strong text-bold text-decoration-underline ">
								DevOps:
							</h4>
							<p className=" p-2 m-2 rounded-lg">
								Git, Github, React Dev Tools, Redux Dev tools,
								Tools: Github, VS Code , Brackets, Chrome Dev
								Tools, Heroku, Netlify, Postman, Photoshop,
								Figma,Illustrator etc. .{" "}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StripedExample;
