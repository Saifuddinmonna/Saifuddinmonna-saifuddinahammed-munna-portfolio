import ProgressBar from "react-bootstrap/ProgressBar";

function StripedExample() {
	return (
		<div className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-50 duration-300">
			<div className=" m-3 mt-10 p-3 border rounded-xl">
				<div className="m-3 p-3 border rounded-xl">
					<h1>My Skills</h1>
				</div>

				<div className=" grid grid-cols-2 justify-center gap-3">
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
						<p className=" p-2 m-2 rounded-lg">
							{" "}
							Front end: JavaScript, TypeScript, React, Redux,
							Redux-Thunk/Saga, Vue, VueX, HTML5, CSS3, Styled
							components, SCSS, Webpack, Babel.{" "}
						</p>
						<p className=" p-2 m-2 rounded-lg">
							Back end: Node.js, Express.js, MongoDB, Mongoose,
							Nodemailer, Node-Geocoder, Stripe, Razorpay, Paypal
							API, Coinbase commerce,{" "}
						</p>
						<p className=" p-2 m-2 rounded-lg">
							DevOps: Git, Github, Heroku, Digital Ocean,
							Cloudinary, AWS S3, React Dev Tools, Redux Dev
							tools, SSH, Unit testing, Intergration testing,
							Continous Integration/Continous Deployment.{" "}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StripedExample;
