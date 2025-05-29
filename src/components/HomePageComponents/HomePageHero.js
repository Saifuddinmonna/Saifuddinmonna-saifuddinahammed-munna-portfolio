import React from "react";
import { useSpring, animated, useTrail } from "react-spring";
import { Typewriter } from "react-simple-typewriter";
import { Transition } from "@headlessui/react";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

const HomePageHero = () => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 20 },
  });

  const buttonTrail = useTrail(2, {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 20 },
    delay: 500,
  });

  const scrollSpring = useSpring({
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 20 },
    delay: 1000,
  });

  return (
    <animated.section
      style={fadeIn}
      className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-slate-900 to-gray-900 text-slate-100 px-4"
    >
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
            <Typewriter
              words={["Hi, I'm Saifuddin", "Full Stack Developer"]}
              loop={true}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto">
          Crafting digital experiences with modern web technologies and creative solutions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {buttonTrail.map((style, index) => (
            <animated.a
              key={index}
              style={style}
              href={index === 0 ? "#contact" : "#projects"}
              className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300
                ${
                  index === 0
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    : "bg-slate-800 hover:bg-slate-700 border border-slate-700"
                }
                hover:scale-105 hover:shadow-lg`}
            >
              {index === 0 ? "Get in Touch" : "View Projects"}
            </animated.a>
          ))}
        </div>
      </div>

      <animated.div
        style={scrollSpring}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm text-slate-400 mb-2">Scroll Down</span>
          <ArrowDownIcon className="w-6 h-6 text-slate-400 animate-bounce" />
        </div>
      </animated.div>
    </animated.section>
  );
};

export default HomePageHero;
