import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactConfetti from "react-confetti";
import { Outlet } from "react-router-dom";
import NavbarPage2 from "../NavbarPage/NavbarPage"; // Assuming NavbarPage2 is the correct Navbar component

const SingleLayout = () => {
  const [confettiStart, setConfettiStart] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setConfettiStart(false);
    }, 8000);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background-default)]">
      {/* Navbar can be added here if this layout is used for pages needing a navbar */}
      {confettiStart && <ReactConfetti />}
      <Outlet></Outlet>
    </div>
  );
};

export default SingleLayout;
