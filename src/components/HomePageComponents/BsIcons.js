import React from "react";
import { BsGit, BsGithub } from "react-icons/bs";

const BsIcons = ({ name, className }) => {
  const icons = {
    BsGit,
    BsGithub,
  };

  const Icon = icons[name];
  return Icon ? <Icon className={className} /> : null;
};

export default BsIcons;
