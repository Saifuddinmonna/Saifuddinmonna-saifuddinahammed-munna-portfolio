import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContractMe = () => {
	const form = useRef();

	const sendEmail = (e) => {
		e.preventDefault();

		emailjs
			.sendForm(
				"service_ythgcgo",
				"template_oatc6pp",
				form.current,
				"NL8TLruSwXX0qZ9OS",
			)
			.then(
				(result) => {
					toast("Your Message has been sent");
				},
				(error) => {
					toast(error.text);
				},
			);
	};
	return (
		<div className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-100 duration-300">
			<div className=" p-5 shadow border rounded-lg  m-8">
				<div className="border rounded-2xl m-2 ">
					
					<h1 class="text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl dark:text-white">
						Contract
						<span class="text-blue-500">Me...</span>
					</h1>
				</div>

				<form
					className="flex  flex-col"
					ref={form}
					onSubmit={sendEmail}>
					<div className="flex m-2 flex-col">
						<label class="block text-sm mb-1" for="name">
							Your Name
						</label>
						<input
							class="form-input"
							placeholder="Type  Your Name"
							id="name"
						/>

						{/* <label>Name</label>
					<input type="text" name="user_name" /> */}
					</div>
					<div className="flex m-2 flex-col">
						<label class="block text-sm mb-1" for="name">
							Phone Number
						</label>
						<input
							type="number"
							class="form-input"
							placeholder="Type Your Phone  Number"
							id="name"
							name="phone-number"
						/>
					</div>
					<div className="flex m-2 flex-col">
						<label class="block text-sm mb-1" for="name">
							Your Email
						</label>
						<input
							type="email"
							name="user_email"
							class="form-input"
							placeholder="Type Your Email"
							id="name"
						/>
					</div>
					<div className="flex m-2 flex-col">
						<label class="block text-sm  mb-1" for="story">
							Your Message
						</label>
						<textarea
							name="message"
							class="form-input"
							id="story"
							placeholder="Type Your Message"
							rows="3"></textarea>
					</div>

					<div class="block  text-sm mb-1">
						<input
							className="block my-3 p-2 rounded bg-gradient-to-r from-cyan-500 to-blue-500 w-full
						"
							type="submit"
							value="Send"
						/>
					</div>
				</form>
			</div>
			<ToastContainer />
		</div>
	);
};

export default ContractMe;
