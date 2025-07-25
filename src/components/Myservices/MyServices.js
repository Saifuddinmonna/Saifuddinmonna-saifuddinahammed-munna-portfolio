// import React from "react";
// import { CgWebsite } from "react-icons/cg";
// import { AiOutlineSetting } from "react-icons/ai";
// import { BiCopyAlt } from "react-icons/bi";
// import { MdOutlineCleaningServices } from "react-icons/md";
// import { TbAsteriskSimple } from "react-icons/tb";
// import { GiAutoRepair } from "react-icons/gi";
// import { RiSecurePaymentFill } from "react-icons/ri";

// const MyServices = () => {
//   return (
//     <div className="">
//       <div className="m-3 p-3 border shadow-lg rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-xl duration-300">
//         {" "}
//         <h1 class="text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl black:text-white white:text-dark">
//           Services I <span class="text-indigo-500"> Provides...</span>
//         </h1>
//         <section class="bg-white rounded-xl dark:bg-gray-900">
//           <div class="container px-6 py-12 mx-auto">
//             <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//               <div className="p-2 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-lg duration-300 border border-gray-200">
//                 <CgWebsite className="text-4xl text-indigo-500"></CgWebsite>
//                 <h1 class=" mt-4 text-xl font-semibold text-lg font-semibold text-center text-gray-800 capitalize lg:text-3xl black:text-white white:text-dark text-gray-800">
//                   Full website creation
//                 </h1>
//                 <p class="mt-2 text-gray-500 dark:text-gray-400">
//                   I can create any type of website for your business, portfolio, company, e-commerce
//                   store, blog etc. I provide unique, clean & awesome graphical design interface.
//                 </p>
//               </div>
//               <div className="p-2 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-lg duration-300 border border-gray-200">
//                 <GiAutoRepair className="text-4xl text-indigo-500"></GiAutoRepair>
//                 <h1 class="mt-4 text-xl font-semibold text-lg font-semibold text-center text-gray-800 capitalize lg:text-3xl black:text-white white:text-dark text-gray-800 black:text-white white:text-dark">
//                   Fixing problems
//                 </h1>
//                 <p class="mt-2 text-gray-500 dark:text-gray-400">
//                   Website problem & bugs it’s a common problem for every website. Don’t worry about
//                   bugs and problems. I can fix any type of problems & bugs for any website.
//                 </p>
//               </div>
//               <div className="p-2 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-lg duration-300 border border-gray-200">
//                 <RiSecurePaymentFill className="text-4xl text-indigo-500"></RiSecurePaymentFill>
//                 <h1 class="mt-4 text-xl font-semibold text-lg font-semibold text-center text-gray-800 capitalize lg:text-3xl black:text-white white:text-dark text-gray-800 black:text-white white:text-dark">
//                   Online store & shopping
//                 </h1>
//                 <p class="mt-2 text-gray-500 dark:text-gray-400">
//                   I can create a fully functional online store with any type of payment gateway
//                   support and add shopping cart functionality into you’re existing website.
//                 </p>
//               </div>
//               <div className="p-2 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-lg duration-300 border border-gray-200">
//                 <svg class="w-8 h-8" viewBox="0 0 30 30" fill="none">
//                   <path
//                     d="M29.6931 14.2283L22.7556 6.87823C22.3292 6.426 21.6175 6.40538 21.1652 6.83212C20.7137 7.25851 20.6927 7.9706 21.1195 8.42248L27.3284 15L21.1195 21.5783C20.6927 22.0302 20.7137 22.7419 21.1652 23.1687C21.3827 23.3738 21.6606 23.4754 21.9374 23.4754C22.2363 23.4754 22.5348 23.3569 22.7557 23.1233L29.6932 15.7729C30.1022 15.339 30.1023 14.6618 29.6931 14.2283Z"
//                     fill="#2D3748"
//                   />
//                   <path
//                     d="M8.88087 21.578L2.67236 15L8.88087 8.42215C9.30726 7.97028 9.28664 7.25812 8.83476 6.83179C8.38323 6.4054 7.67073 6.42603 7.2444 6.87791L0.306858 14.2279C-0.102245 14.6614 -0.102245 15.3391 0.306858 15.7726L7.24475 23.123C7.466 23.3574 7.76413 23.4755 8.06302 23.4755C8.33976 23.4755 8.61767 23.3735 8.83476 23.1684C9.28705 22.742 9.30726 22.0299 8.88087 21.578Z"
//                     fill="#2D3748"
//                   />
//                   <path
//                     d="M16.8201 3.08774C16.2062 2.99476 15.6317 3.41622 15.5379 4.03011L12.2379 25.6302C12.1441 26.2445 12.566 26.8186 13.1803 26.9124C13.238 26.921 13.295 26.9252 13.3516 26.9252C13.898 26.9252 14.3773 26.5266 14.4624 25.97L17.7624 4.3699C17.8562 3.7556 17.4343 3.1815 16.8201 3.08774Z"
//                     fill="#4299E1"
//                   />
//                 </svg>

//                 <h1 class="mt-4 text-xl font-semibold text-lg font-semibold text-center text-gray-800 capitalize lg:text-3xl black:text-white white:text-dark text-gray-800 black:text-white white:text-dark">
//                   Default Taiwindcss Config
//                 </h1>

//                 <p class="mt-2 text-gray-500 dark:text-gray-400">
//                   With my strong understanding of Tailwind CSS, I am able to quickly and efficiently
//                   create custom designs that are consistent with the default configuration, making
//                   them both visually appealing and easy to maintain.
//                 </p>
//               </div>

//               <div className="p-2 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-lg duration-300 border border-gray-200">
//                 <svg class="w-8 h-8" viewBox="0 0 30 30" fill="none">
//                   <path
//                     d="M27.3633 7.08984H26.4844V6.21094C26.4844 4.75705 25.3015 3.57422 23.8477 3.57422H4.39453C2.94064 3.57422 1.75781 4.75705 1.75781 6.21094V21.1523H0.878906C0.393516 21.1523 0 21.5459 0 22.0312V23.7891C0 25.2429 1.18283 26.4258 2.63672 26.4258H27.3633C28.8172 26.4258 30 25.2429 30 23.7891V9.72656C30 8.27268 28.8172 7.08984 27.3633 7.08984ZM3.51562 6.21094C3.51562 5.72631 3.9099 5.33203 4.39453 5.33203H23.8477C24.3323 5.33203 24.7266 5.72631 24.7266 6.21094V7.08984H20.332C18.8781 7.08984 17.6953 8.27268 17.6953 9.72656V21.1523H3.51562V6.21094ZM1.75781 23.7891V22.9102H17.6953V23.7891C17.6953 24.0971 17.7489 24.3929 17.8465 24.668H2.63672C2.15209 24.668 1.75781 24.2737 1.75781 23.7891ZM28.2422 23.7891C28.2422 24.2737 27.8479 24.668 27.3633 24.668H20.332C19.8474 24.668 19.4531 24.2737 19.4531 23.7891V9.72656C19.4531 9.24193 19.8474 8.84766 20.332 8.84766H27.3633C27.8479 8.84766 28.2422 9.24193 28.2422 9.72656V23.7891Z"
//                     fill="#2D3748"
//                   />
//                   <path
//                     d="M24.7266 21.1523H22.9688C22.4834 21.1523 22.0898 21.5459 22.0898 22.0312C22.0898 22.5166 22.4834 22.9102 22.9688 22.9102H24.7266C25.212 22.9102 25.6055 22.5166 25.6055 22.0312C25.6055 21.5459 25.212 21.1523 24.7266 21.1523Z"
//                     fill="#4299E1"
//                   />
//                   <path
//                     d="M23.8477 12.3633C24.3331 12.3633 24.7266 11.9698 24.7266 11.4844C24.7266 10.999 24.3331 10.6055 23.8477 10.6055C23.3622 10.6055 22.9688 10.999 22.9688 11.4844C22.9688 11.9698 23.3622 12.3633 23.8477 12.3633Z"
//                     fill="#4299E1"
//                   />
//                 </svg>

//                 <h1 class="mt-4 text-xl font-semibold text-lg font-semibold text-center text-gray-800 capitalize lg:text-3xl black:text-white white:text-dark text-gray-800 black:text-white white:text-dark">
//                   Fully Responsive Components
//                 </h1>

//                 <p class="mt-2 text-gray-500 dark:text-gray-400">
//                   If you want to grow your business, you need a responsive website design. I’ll
//                   provide you with an responsive web design services, I provide your company with a
//                   responsive and attractive site that generates traffic, leads, and sales.
//                 </p>
//               </div>

//               <div className="p-2 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-lg duration-300 border border-gray-200">
//                 <svg class="w-8 h-8" viewBox="0 0 30 30" fill="none">
//                   <g clip-path="url(#clip0)">
//                     <path
//                       d="M26.599 4.339a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zM7.151 25.661a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zM23.486 13.163a8.636 8.636 0 00-1.19-2.873l1.123-1.123-2.592-2.59L19.705 7.7a8.636 8.636 0 00-2.873-1.19V4.921h-3.664v1.586a8.634 8.634 0 00-2.873 1.19l-1.122-1.12-2.592 2.589 1.123 1.123a8.636 8.636 0 00-1.19 2.873H4.922l-.002 3.663h1.592A8.626 8.626 0 007.704 19.7l-1.127 1.127 2.59 2.591 1.128-1.127a8.623 8.623 0 002.873 1.19v1.597h3.664v-1.597a8.628 8.628 0 002.873-1.19l1.128 1.128 2.59-2.592-1.127-1.127a8.627 8.627 0 001.19-2.873h1.593v-3.664h-1.593zM15 19.256a4.255 4.255 0 110-8.511 4.255 4.255 0 010 8.51z"
//                       fill="#4299E1"
//                     />
//                     <path
//                       d="M5.276 23.2c-.42 0-.823.105-1.182.302A13.853 13.853 0 011.172 15C1.172 7.375 7.375 1.172 15 1.172c.927 0 1.854.092 2.754.274a.586.586 0 00.232-1.149A15.111 15.111 0 0015 0C10.993 0 7.226 1.56 4.393 4.393A14.902 14.902 0 000 15c0 3.37 1.144 6.66 3.228 9.296-.268.4-.413.872-.413 1.365 0 .657.257 1.275.721 1.74a2.444 2.444 0 001.74.721c.658 0 1.276-.256 1.74-.721.465-.465.721-1.083.721-1.74s-.256-1.276-.72-1.74a2.445 2.445 0 00-1.74-.72zm.912 3.373a1.28 1.28 0 01-.912.377 1.28 1.28 0 01-.911-.377 1.28 1.28 0 01-.378-.912c0-.344.134-.668.378-.912a1.28 1.28 0 01.911-.377c.345 0 .668.134.912.378.243.243.377.567.377.911 0 .344-.134.668-.377.912zM26.772 5.703a2.465 2.465 0 00-.308-3.104 2.446 2.446 0 00-1.74-.721c-.658 0-1.276.256-1.74.72a2.445 2.445 0 00-.721 1.74c0 .658.256 1.276.72 1.741.465.465 1.083.72 1.74.72.42 0 .824-.104 1.183-.3A13.854 13.854 0 0128.828 15c0 7.625-6.203 13.828-13.828 13.828-.918 0-1.836-.09-2.728-.269a.586.586 0 00-.23 1.15c.968.193 1.963.291 2.958.291 4.007 0 7.773-1.56 10.607-4.393A14.902 14.902 0 0030 15c0-3.37-1.145-6.66-3.228-9.297zm-2.96-.452a1.28 1.28 0 01-.377-.912c0-.344.134-.668.377-.911a1.28 1.28 0 01.912-.378 1.29 1.29 0 010 2.578 1.28 1.28 0 01-.912-.377z"
//                       fill="#2D3748"
//                     />
//                     <path
//                       d="M12.582 25.078c0 .324.263.586.586.586h3.664a.586.586 0 00.586-.586v-1.136a9.179 9.179 0 002.199-.911l.802.802a.586.586 0 00.829 0l2.59-2.592a.586.586 0 000-.828l-.802-.802a9.169 9.169 0 00.911-2.199h1.132a.586.586 0 00.586-.585v-3.664a.586.586 0 00-.586-.586h-1.132a9.17 9.17 0 00-.911-2.199l.797-.797a.587.587 0 000-.829l-2.592-2.59a.586.586 0 00-.829 0l-.795.797a9.177 9.177 0 00-2.2-.912V4.922a.586.586 0 00-.585-.586h-3.664a.586.586 0 00-.586.586v1.126a9.169 9.169 0 00-2.199.91l-.796-.795a.586.586 0 00-.828 0l-2.592 2.59a.585.585 0 000 .828l.797.797a9.173 9.173 0 00-.911 2.199h-1.13a.586.586 0 00-.586.585l-.002 3.664a.585.585 0 00.586.586h1.132c.207.77.512 1.507.911 2.2l-.801.8a.586.586 0 000 .83l2.59 2.59a.586.586 0 00.829 0l.801-.801a9.185 9.185 0 002.2.911v1.136zm-1.97-3.28a.586.586 0 00-.732.078l-.713.714-1.761-1.763.712-.713a.586.586 0 00.078-.732 8.02 8.02 0 01-1.11-2.679.586.586 0 00-.572-.462H5.507l.002-2.492h1.005a.586.586 0 00.572-.463 8.022 8.022 0 011.11-2.678.586.586 0 00-.078-.733l-.708-.708 1.763-1.761.707.707c.196.196.5.228.733.078a8.016 8.016 0 012.678-1.11.586.586 0 00.463-.573v-1h2.492v1c0 .277.193.515.463.573a8.024 8.024 0 012.678 1.11c.232.15.537.118.732-.078l.708-.707 1.762 1.761-.708.708a.586.586 0 00-.078.732 8.027 8.027 0 011.11 2.679c.058.27.297.463.573.463h1.007v2.492h-1.007a.586.586 0 00-.573.462 8.02 8.02 0 01-1.11 2.679.586.586 0 00.078.732l.713.713-1.761 1.762-.714-.713a.586.586 0 00-.732-.078 8.027 8.027 0 01-2.678 1.11.586.586 0 00-.463.573v1.011h-2.492v-1.01a.586.586 0 00-.463-.574 8.021 8.021 0 01-2.678-1.11z"
//                       fill="#2D3748"
//                     />
//                     <path
//                       d="M19.841 15A4.847 4.847 0 0015 10.158 4.847 4.847 0 0010.158 15 4.847 4.847 0 0015 19.841 4.847 4.847 0 0019.841 15zm-8.51 0A3.674 3.674 0 0115 11.33 3.674 3.674 0 0118.67 15 3.674 3.674 0 0115 18.67 3.674 3.674 0 0111.33 15z"
//                       fill="#2D3748"
//                     />
//                     <path
//                       d="M20.395 2.216a.59.59 0 00.415-.172.593.593 0 00.171-.415.59.59 0 00-.586-.586.589.589 0 00-.586.586.589.589 0 00.586.587zM9.63 27.794a.59.59 0 00-.586.586.59.59 0 00.586.586.59.59 0 00.586-.586.59.59 0 00-.586-.585z"
//                       fill="#4299E1"
//                     />
//                   </g>
//                   <defs>
//                     <clipPath id="clip0">
//                       <path fill="#fff" d="M0 0h30v30H0z" />
//                     </clipPath>
//                   </defs>
//                 </svg>

//                 <h1 class="mt-4 text-xl font-semibold text-lg font-semibold text-center text-gray-800 capitalize lg:text-3xl black:text-white white:text-dark text-gray-800 black:text-white white:text-dark">
//                   Maintenance & Optimized
//                 </h1>

//                 <p class="mt-2 text-gray-500 dark:text-gray-400">
//                   Slow loading website it’s the biggest problem for every website. I can boost your
//                   website’s speed by optimization your website. And if you don’t have time to
//                   maintain your website don’t worry I’m here.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section class="bg-red-600 rounded-xl dark:bg-gray-900">
//           <div class="container px-6 py-10 mx-auto">
//             <h1 class="text-3xl font-semibold text-lg font-semibold text-center text-gray-800 capitalize lg:text-3xl black:text-white white:text-dark text-center text-gray-800 capitalize lg:text-4xl black:text-white white:text-dark">
//               My Service <span class="text-indigo-500"> Qualilties...</span>
//             </h1>

//             <div class="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-16 md:grid-cols-2 xl:grid-cols-3">
//               <div
//                 class="rounded-xl transition ease-in-out
// 							delay-150 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-lg duration-200 flex flex-col items-center p-6 space-y-3 text-center bg-gray-100 rounded-xl dark:bg-gray-800 border border-gray-200"
//               >
//                 <span class="inline-block p-3 text-indigo-500 bg-yellow-200 rounded-full black:text-white white:text-dark dark:bg-indigo-500">
//                   <BiCopyAlt></BiCopyAlt>
//                 </span>

//                 <h1 class="text-2xl font-semibold text-lg font-semibold text-center text-gray-800 capitalize lg:text-3xl black:text-white white:text-dark text-gray-700 capitalize black:text-white white:text-dark">
//                   Copy & paste components
//                 </h1>

//                 <p class="text-gray-500 dark:text-gray-300">
//                   I can make clean copy and paste component website to boost your website’s speedy
//                   and optimization with ease and efficiency, saving time and resources for more
//                   important tasks.
//                 </p>
//               </div>
//               <div
//                 class="rounded-xl transition ease-in-out
// 							delay-150 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-lg duration-200 flex flex-col items-center p-6 space-y-3 text-center bg-gray-100 rounded-xl dark:bg-gray-800 border border-gray-200"
//               >
//                 <span class="inline-block p-3 text-indigo-500 bg-indigo-100 rounded-full black:text-white white:text-dark dark:bg-indigo-500">
//                   <AiOutlineSetting></AiOutlineSetting>
//                 </span>

//                 <h1 class="text-2xl font-semibold text-lg font-semibold text-center text-gray-800 capitalize lg:text-3xl black:text-white white:text-dark text-gray-700 capitalize black:text-white white:text-dark">
//                   Zero Configrations
//                 </h1>

//                 <p class="text-gray-500 dark:text-gray-300">
//                   I can make any configuration in your website according to your need to build your
//                   website more effective and more efficient.
//                 </p>
//               </div>
//               {/* className=" p-2 rounded-xl transition ease-in-out
// 							delay-150 hover:-translate-y-1 hover:scale-102 hover:border-blue-300 hover:shadow-lg duration-200" */}
//               <div
//                 class="rounded-xl transition ease-in-out
// 							delay-150 hover:-translate-y-1 hover:scale-102 hover:border-indigo-500 hover:shadow-lg duration-200 flex flex-col items-center p-6 space-y-3 text-center bg-gray-100 rounded-xl dark:bg-gray-800 border border-gray-200"
//               >
//                 <span class="inline-block p-3 text-indigo-500 bg-indigo-100 rounded-full black:text-white white:text-dark dark:bg-indigo-500">
//                   {/* <MdOutlineCleaningServices></MdOutlineCleaningServices> */}
//                   <TbAsteriskSimple></TbAsteriskSimple>
//                 </span>

//                 <h1 class="text-2xl font-semibold text-lg font-semibold text-center text-gray-800 capitalize lg:text-3xl black:text-white white:text-dark text-gray-700 capitalize black:text-white white:text-dark">
//                   Simple & clean designs
//                 </h1>

//                 <p class="text-gray-500 dark:text-gray-300">
//                   I have experience in Simple & clean designs websites that are optimized for all
//                   devices and browsers. My design approach is user-centered, ensuring that the
//                   website is easy to navigate and provides a seamless user experience.
//                   {/* I also have expertise in
// 									creating visually appealing designs that are
// 									aligned with your brand and business
// 									objectives.  */}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default MyServices;
