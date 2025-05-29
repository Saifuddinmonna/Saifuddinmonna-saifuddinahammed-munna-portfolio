import React from "react";
import { useSpring, animated, useTrail } from "react-spring";
import { Transition } from "@headlessui/react";
import { UserCircleIcon, CodeBracketIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";

const AboutPageForHome = () => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 20 },
  });

  const cardTrail = useTrail(3, {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 20 },
    delay: 200,
  });

  const cards = [
    {
      icon: <UserCircleIcon className="w-12 h-12" />,
      title: "About Me",
      description:
        "A passionate Full Stack Developer with a keen eye for detail and a love for creating beautiful, functional web applications.",
    },
    {
      icon: <CodeBracketIcon className="w-12 h-12" />,
      title: "My Approach",
      description:
        "I combine technical expertise with creative problem-solving to deliver solutions that are both efficient and user-friendly.",
    },
    {
      icon: <RocketLaunchIcon className="w-12 h-12" />,
      title: "My Mission",
      description:
        "To create impactful digital experiences that help businesses grow and users achieve their goals through technology.",
    },
  ];

  return (
    <animated.section
      style={fadeIn}
      id="about"
      className="py-20 px-4 md:px-8 relative min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-slate-100"
    >
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
            About Me
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Get to know more about my journey, approach, and what drives me as a developer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cardTrail.map((style, index) => (
            <animated.div
              key={index}
              style={style}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50
                       hover:bg-slate-800/70 transition-all duration-300 hover:scale-105"
            >
              <div className="text-accent mb-4">{cards[index].icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-white">{cards[index].title}</h3>
              <p className="text-slate-400">{cards[index].description}</p>
            </animated.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="#contact"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500
                     hover:from-purple-600 hover:to-pink-600 text-white font-semibold
                     transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Let's Work Together
          </a>
        </div>
      </div>
    </animated.section>
  );
};

export default AboutPageForHome;
