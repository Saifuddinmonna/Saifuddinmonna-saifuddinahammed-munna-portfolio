import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaCode, FaBullseye, FaReact, FaNodeJs, FaDatabase, FaGitAlt, FaHtml5, FaCss3Alt, FaJsSquare } from 'react-icons/fa'; // Example icons
import { SiTailwindcss, SiExpress, SiMongodb, SiFirebase, SiVercel, SiNetlify } from 'react-icons/si'; // More specific icons

const AboutPageForHome  = () => { // Renamed component to start with an uppercase letter
    const [confettiActive, setConfettiActive] = useState(true);
    const [windowSize, setWindowSize] = useState({ width: undefined, height: undefined });

    useEffect(() => {
        window.scrollTo(0, 0);

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call handler right away so state gets updated with initial window size

        const confettiTimer = setTimeout(() => {
            setConfettiActive(false);
        }, 5000); // Confetti for 5 seconds

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(confettiTimer);
        };
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    const skills = [
        { name: 'HTML5', icon: <FaHtml5 className="text-orange-500" />, level: 'Advanced' },
        { name: 'CSS3', icon: <FaCss3Alt className="text-blue-500" />, level: 'Advanced' },
        { name: 'JavaScript (ES6+)', icon: <FaJsSquare className="text-yellow-400" />, level: 'Proficient' },
        { name: 'React', icon: <FaReact className="text-sky-400" />, level: 'Proficient' },
        { name: 'Node.js', icon: <FaNodeJs className="text-green-500" />, level: 'Intermediate' },
        { name: 'Express.js', icon: <SiExpress className="text-gray-700 dark:text-gray-300" />, level: 'Intermediate' },
        { name: 'MongoDB', icon: <SiMongodb className="text-green-600" />, level: 'Intermediate' },
        { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-teal-400" />, level: 'Proficient' },
        { name: 'Git & GitHub', icon: <FaGitAlt className="text-red-500" />, level: 'Proficient' },
        { name: 'Firebase', icon: <SiFirebase className="text-yellow-500" />, level: 'Beginner' },
        { name: 'Vercel/Netlify', icon: <><SiVercel className="mr-1" /> <SiNetlify className="text-teal-500" /></>, level: 'Deployment' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-8 px-4 sm:px-6 lg:px-8">
            {confettiActive && windowSize.width && windowSize.height && (
                <ReactConfetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={300}
                    gravity={0.1}
                />
            )}

            <motion.div
                className="max-w-5xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* --- Hero Section --- */}
                {/* <motion.section
                    className="flex flex-col lg:flex-row items-center bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 sm:p-10 mb-12"
                    variants={itemVariants}
                >
                    <motion.img
                        src="images/profile1.png" // Make sure this path is correct
                        alt="Saifuddin Ahammed Monna"
                        className="w-48 h-48 sm:w-60 sm:h-60 rounded-full object-cover shadow-lg mb-6 lg:mb-0 lg:mr-10 border-4 border-sky-500"
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    />
                    <div className="text-center lg:text-left">
                        <motion.h1
                            className="text-4xl sm:text-5xl font-bold text-sky-600 dark:text-sky-400 mb-3"
                            variants={itemVariants}
                        >
                            Saifuddin Ahammed Monna
                        </motion.h1>
                        <motion.p
                            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-6"
                            variants={itemVariants}
                        >
                            Passionate Web Developer & Educator
                        </motion.p>
                        <motion.a
                            href="#contact" // Link to your contact section or page
                            className="inline-block bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105 text-lg"
                            variants={itemVariants}
                        >
                            Let's Connect
                        </motion.a>
                    </div>
                </motion.section> */}

                {/* --- My Story Section --- */}
                <motion.section className="mb-12 p-6  sm:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl" variants={itemVariants}>
                    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700 dark:text-gray-300 flex items-center justify-center">
                        <FaUserGraduate className="mr-3 text-sky-500" /> My Journey
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-justify indent-8">
                        Born in Mymensingh Sadar, Bangladesh, I grew up with a supportive family of three brothers and my parents. My academic path led me to complete a post-graduation in Public Administration in 2017. While I have a background in teaching, my true passion ignited when I delved into the world of coding.
                    </p>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-justify indent-8">
                        For the past few years, I've dedicated myself to web design and development, driven by the desire to help individuals and businesses establish their online presence and enhance functionality. I find immense joy in crafting digital experiences and solving complex problems through code. This isn't just a job for me; it's a significant part of my life where I continuously learn and evolve, dedicating many hours each day to hone my skills.
                    </p>
                </motion.section>

                {/* --- Skills Section --- */}
                <motion.section className="mb-12 p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl" variants={itemVariants}>
                    <h2 className="text-3xl font-semibold mb-8 text-center text-gray-700 dark:text-gray-300 flex items-center justify-center">
                        <FaCode className="mr-3 text-sky-500" /> My Technical Toolkit
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-shadow"
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                            >
                                <div className="text-4xl mb-2">{skill.icon}</div>
                                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">{skill.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{skill.level}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* --- Vision Section --- */}
                <motion.section className="p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl" variants={itemVariants}>
                    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700 dark:text-gray-300 flex items-center justify-center">
                        <FaBullseye className="mr-3 text-sky-500" /> My Vision
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-center italic">
                        "My ultimate goal is to become a highly proficient web developer and contribute meaningfully to the open-source community, particularly by building optimized NPM packages for React. I believe in the power of shared knowledge and aim to create tools that simplify and enhance the development experience for others."
                    </p>
                    <div className="text-center text-3xl text-sky-500 mt-6">
                        ~ Saifuddin Ahammed Monna ~
                    </div>
                </motion.section>

            </motion.div>
        </div>
    );
};

export default AboutPageForHome; // Export with the new uppercase name