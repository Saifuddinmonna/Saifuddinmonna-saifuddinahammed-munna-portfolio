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
    <div className="transition-colors duration-200">
      <div className="p-5 shadow-lg border rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-104 hover:bg-opacity-10 hover:bg-primary-light m-6 border bg-background-default text-text-primary rounded-xl">
        <div className="border rounded-2xl m-2">
          <h1 className="text-3xl font-semibold text-center bg-background-default text-text-primary lg:text-4xl">
            Contract
            <span className="text-primary-main"> Me...</span>
          </h1>
        </div>

        <form
          className="flex flex-col bg-background-default text-text-primary"
          ref={form}
          onSubmit={sendEmail}
        >
          <div className="flex m-2 flex-col">
            <label
              className="block text-sm mb-1 bg-background-default text-text-primary"
              htmlFor="name"
            >
              Your Name
            </label>
            <input
              className="rounded-xl p-2 bg-background-default text-text-primary border border-border-main focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-colors duration-200"
              placeholder="Type Your Name"
              id="name"
              name="user_name"
            />
          </div>

          <div className="flex m-2 flex-col">
            <label
              className="block text-sm mb-1 bg-background-default text-text-primary"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              className="rounded-xl p-2 bg-background-default text-text-primary border border-border-main focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-colors duration-200"
              type="number"
              placeholder="Type Your Phone Number"
              id="phone"
              name="phone-number"
            />
          </div>

          <div className="flex m-2 flex-col">
            <label
              className="block text-sm mb-1 bg-background-default text-text-primary"
              htmlFor="email"
            >
              Your Email
            </label>
            <input
              className="rounded-xl p-2 bg-background-default text-text-primary border border-border-main focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-colors duration-200"
              type="email"
              name="user_email"
              placeholder="Type Your Email"
              id="email"
            />
          </div>

          <div className="flex m-2 flex-col">
            <label
              className="block text-sm mb-1 bg-background-default text-text-primary"
              htmlFor="message"
            >
              Your Message
            </label>
            <textarea
              className="rounded-2xl p-2 bg-background-default text-text-primary border border-border-main focus:border-primary-main focus:ring-1 focus:ring-primary-main transition-colors duration-200"
              name="message"
              id="message"
              placeholder="Type Your Message"
              rows="3"
            ></textarea>
          </div>

          <div className="block text-sm mb-1">
            <input
              className="block my-3 p-2 rounded bg-gradient-to-r from-secondary-main to-primary-main w-full text-white font-medium hover:from-secondary-dark hover:to-primary-dark transition-all duration-200"
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
