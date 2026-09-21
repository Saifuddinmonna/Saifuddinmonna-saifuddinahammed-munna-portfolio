import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactConfetti from "react-confetti";
import { Outlet } from "react-router-dom";
import NavbarPage2 from "../NavbarPage/NavbarPage"; // Assuming NavbarPage2 is the correct Navbar component

const SingleLayout = () => {
  c;

  return (
    <div className="min-h-screen bg-[var(--background-default)]">
      {/* Navbar can be added here if this layout is used for pages needing a navbar */}

      <Outlet></Outlet>
    </div>
  );
};

export default SingleLayout;
