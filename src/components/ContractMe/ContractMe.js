import React, { useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContractMe = () => {
  const form = useRef();

  const sendEmail = e => {
    e.preventDefault();

    emailjs.sendForm("service_ythgcgo", "template_oatc6pp", form.current, "NL8TLruSwXX0qZ9OS").then(
      result => {
        toast("Your Message has been sent");
      },
      error => {
        toast(error.text);
      }
    );
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="">
      <div className=" p-5 shadow-lg border rounded-lgtransition ease-in-out delay-150  hover:-translate-y-1 hover:scale-104 hover:bg-indigo-100 duration-300  m-6 border  bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200  rounded-xl">
        <div className="border rounded-2xl m-2 ">
          <h1 class="text-3xl font-semibold text-center  bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200  lg:text-4xl black:text-white white:text-dark">
            Contract
            <span class="text-blue-500"> Me...</span>
          </h1>
        </div>

        <form
          className="flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
          ref={form}
          onSubmit={sendEmail}
        >
          <div className="flex m-2 flex-col">
            <label
              className="block text-sm mb-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              htmlFor="name"
            >
              Your Name
            </label>
            <input
              className="rounded-xl p-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
              placeholder="Type Your Name"
              id="name"
              name="user_name"
            />
          </div>

          <div className="flex m-2 flex-col">
            <label
              className="block text-sm mb-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              className="rounded-xl p-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
              type="number"
              placeholder="Type Your Phone Number"
              id="phone"
              name="phone-number"
            />
          </div>

          <div className="flex m-2 flex-col">
            <label
              className="block text-sm mb-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              htmlFor="email"
            >
              Your Email
            </label>
            <input
              className="rounded-xl p-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
              type="email"
              name="user_email"
              placeholder="Type Your Email"
              id="email"
            />
          </div>

          <div className="flex m-2 flex-col">
            <label
              className="block text-sm mb-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              htmlFor="message"
            >
              Your Message
            </label>
            <textarea
              className="rounded-2xl p-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
              name="message"
              id="message"
              placeholder="Type Your Message"
              rows="3"
            ></textarea>
          </div>

          <div className="block text-sm mb-1">
            <input
              className="block my-3 p-2 rounded bg-gradient-to-r from-cyan-500 to-blue-500 w-full text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
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
