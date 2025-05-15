// src/components/SkillTag.js

import React from "react";
import { GrUserExpert } from "react-icons/gr";

// Props: name (skill name), icon (optional)
const SkillTag = ({ name, icon: Icon = GrUserExpert }) => {
	return (
		<div
			className="flex items-center gap-2 border border-gray-300 rounded-xl md:rounded-full p-2 md:p-3 m-2 shadow text-base
        transition duration-300 ease-in-out transform hover:scale-105 hover:border-blue-500 hover:shadow-md cursor-pointer"
		>
			<Icon className="text-blue-600 text-lg" />
			<span>{name.trim()}</span>
		</div>
	);
};

export default SkillTag;
