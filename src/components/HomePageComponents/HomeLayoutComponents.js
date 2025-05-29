import React from "react";
import HomePageHero from "./HomePageHero";
import AboutPageForHome from "./AboutPageForHome";

const HomeLayoutComponents = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900">
      <HomePageHero />
      <AboutPageForHome />
    </div>
  );
};

export default HomeLayoutComponents;
