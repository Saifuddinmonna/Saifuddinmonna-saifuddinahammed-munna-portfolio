import React from "react";
import { TbBrandNextjs } from "react-icons/tb";

const TbIcons = ({ name, className }) => {
  const icons = {
    TbBrandNextjs,
  };

  const Icon = icons[name];
  return Icon ? <Icon className={className} /> : null;
};

export default TbIcons;
