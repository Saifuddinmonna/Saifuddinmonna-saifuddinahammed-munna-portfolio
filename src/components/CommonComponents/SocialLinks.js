import React from "react";

const SocialLinks = () => {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/Saifuddinmonna",
      icon: (
        <svg
          className="w-5 h-5 group-hover:animate-bounce"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.202 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.942.359.309.678.922.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/saifuddin-ahammed-monna-67ba1849/",
      icon: (
        <svg
          className="w-5 h-5 group-hover:animate-pulse"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      bgColor: "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/ahammed.rafayel",
      icon: (
        <svg
          className="w-5 h-5 group-hover:animate-pulse"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bgColor: "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600",
    },
    {
      name: "Email",
      url: "mailto:saifuddinmonna@gmail.com",
      icon: (
        <svg
          className="w-5 h-5 group-hover:animate-ping"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      bgColor: "bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600",
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center px-2">
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 ${link.bgColor} text-white rounded-lg transition-all duration-300 hover:shadow-lg group`}
          style={{ willChange: "transform" }}
        >
          {link.icon}
          <span className="font-medium">{link.name}</span>
        </a>
      ))}
    </div>
  );
};

export default React.memo(SocialLinks);
