import React from "react";
import { FaReact, FaNodeJs, FaDatabase } from "react-icons/fa";
import { SiJavascript, SiTailwindcss } from "react-icons/si";
import { AiOutlineApi } from "react-icons/ai";

const SkillsOverview = () => {
	const cardBaseClasses =
		"p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out";
	const cardHoverClasses =
		"hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-xl dark:hover:shadow-indigo-500/20";
	
    const iconWrapperClasses =
		"inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-gray-700 rounded-full mb-4";
	const iconClasses = "w-8 h-8 text-indigo-600 dark:text-indigo-400";

	return (
		<section id="skills" className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
			<div className="container mx-auto px-4">
				<div className="mb-12 lg:mb-16 text-center">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white capitalize">
						Skills <span className="text-indigo-600 dark:text-indigo-400">Overview</span>
					</h1>
					<p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
						My technical expertise and core competencies in web development
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{/* Frontend Development */}
					<div
						className={`${cardBaseClasses} bg-white dark:bg-gray-800 ${cardHoverClasses} text-center`}
					>
						<div className={iconWrapperClasses}>
							<FaReact className={iconClasses} />
						</div>
						<h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white capitalize">
							Frontend Development
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Expertise in React.js, Next.js, and modern frontend frameworks. Strong focus on creating responsive and interactive user interfaces.
						</p>
					</div>

					{/* JavaScript Expertise */}
					<div
						className={`${cardBaseClasses} bg-white dark:bg-gray-800 ${cardHoverClasses} text-center`}
					>
						<div className={iconWrapperClasses}>
							<SiJavascript className={iconClasses} />
						</div>
						<h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white capitalize">
							JavaScript Mastery
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Advanced JavaScript programming including ES6+, TypeScript, and modern development patterns and practices.
						</p>
					</div>

					{/* Backend Development */}
					<div
						className={`${cardBaseClasses} bg-white dark:bg-gray-800 ${cardHoverClasses} text-center`}
					>
						<div className={iconWrapperClasses}>
							<FaNodeJs className={iconClasses} />
						</div>
						<h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white capitalize">
							Backend Development
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Node.js and Express.js development with focus on building scalable and efficient server-side applications.
						</p>
					</div>
					
					{/* Database Management */}
					<div
						className={`${cardBaseClasses} bg-white dark:bg-gray-800 ${cardHoverClasses} text-center`}
					>
						<div className={iconWrapperClasses}>
							<FaDatabase className={iconClasses} />
						</div>
						<h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white capitalize">
							Database Management
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Experience with MongoDB, MySQL, and database design. Proficient in both SQL and NoSQL database systems.
						</p>
					</div>

					{/* API Development */}
					<div
						className={`${cardBaseClasses} bg-white dark:bg-gray-800 ${cardHoverClasses} text-center`}
					>
						<div className={iconWrapperClasses}>
							<AiOutlineApi className={iconClasses} />
						</div>
						<h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white capitalize">
							API Development
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							RESTful API design and implementation, API integration, and microservices architecture.
						</p>
					</div>

					{/* CSS & Styling */}
					<div
						className={`${cardBaseClasses} bg-white dark:bg-gray-800 ${cardHoverClasses} text-center`}
					>
						<div className={iconWrapperClasses}>
							<SiTailwindcss className={iconClasses} />
						</div>
						<h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white capitalize">
							CSS & Styling
						</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Advanced Tailwind CSS, CSS3, Sass/SCSS, and modern styling techniques for creating beautiful user interfaces.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SkillsOverview;