import React from "react";
import {
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiExpress,
  SiRedux,
  SiHtml5,
  SiCss3,
  SiBootstrap,
  SiTailwindcss,
  SiMysql,
} from "react-icons/si";

const SiIcons = ({ name, className }) => {
  const icons = {
    SiJavascript,
    SiReact,
    SiNodedotjs,
    SiMongodb,
    SiExpress,
    SiRedux,
    SiHtml5,
    SiCss3,
    SiBootstrap,
    SiTailwindcss,
    SiMysql,
  };

  const Icon = icons[name];
  return Icon ? <Icon className={className} /> : null;
};

export default SiIcons;
