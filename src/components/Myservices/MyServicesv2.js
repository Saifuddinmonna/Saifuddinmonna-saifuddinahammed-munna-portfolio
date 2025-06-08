import React from "react";
import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaDatabase, FaGitAlt, FaDocker, FaAws } from "react-icons/fa";
import {
  SiJavascript,
  SiTailwindcss,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiNextdotjs,
  SiRedux,
  SiExpress,
  // SiReact, // FaReact is used from react-icons/fa for the main icon
} from "react-icons/si";
import { AiOutlineApi, AiOutlineSecurityScan, AiOutlineCloudServer } from "react-icons/ai";

// Card Components
const ServiceCard = ({ icon: Icon, title, description, techIcons }) => {
  return (
    <motion.div
      className="p-6 rounded-xl border border-[var(--border-light)] dark:border-[var(--border-main)] transition-all duration-300 ease-in-out bg-[var(--background-paper)] dark:bg-[var(--background-elevated)] backdrop-blur-sm hover:-translate-y-2 hover:scale-[1.02] hover:border-[var(--primary-main)]/50 dark:hover:border-[var(--primary-light)]/50 hover:shadow-[var(--shadow-lg)] dark:hover:shadow-[var(--shadow-lg)] text-center group"
      variants={itemVariants}
    >
      <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-[var(--background-elevated)] dark:to-[var(--background-paper)] rounded-2xl mb-6 shadow-lg shadow-[var(--primary-main)]/10 dark:shadow-[var(--primary-light)]/5 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-8 h-8 text-[var(--primary-main)] dark:text-[var(--primary-light)] group-hover:scale-110 transition-transform duration-300" />
      </div>
      <h3 className="mb-4 text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)] capitalize">
        {title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] leading-relaxed">
        {description}
      </p>
      <div className="mt-4 flex justify-center gap-2">{techIcons}</div>
    </motion.div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const SkillsOverview = () => {
  const services = [
    {
      icon: FaReact,
      title: "Frontend Development",
      description:
        "Expert in React.js, Next.js, and modern frontend frameworks. Specialized in creating responsive, interactive UIs with TypeScript and Redux for state management.",
      techIcons: [
        <FaReact key="react" className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
        <SiNextdotjs key="next" className="w-6 h-6 text-gray-800 dark:text-gray-100" />,
        <SiRedux key="redux" className="w-6 h-6 text-purple-500 dark:text-purple-400" />,
      ],
    },
    {
      icon: FaNodeJs,
      title: "Backend Development",
      description:
        "Proficient in Node.js and Express.js development. Experience in building scalable, secure, and efficient server-side applications with RESTful APIs.",
      techIcons: [
        <FaNodeJs key="node" className="w-6 h-6 text-green-500 dark:text-green-400" />,
        <SiExpress key="express" className="w-6 h-6 text-gray-800 dark:text-gray-100" />,
        <AiOutlineApi key="api" className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      ],
    },
    {
      icon: FaDatabase,
      title: "Database Management",
      description:
        "Skilled in both SQL and NoSQL databases. Experience with MongoDB, PostgreSQL, and database design, optimization, and management.",
      techIcons: [
        <SiMongodb key="mongo" className="w-6 h-6 text-green-600 dark:text-green-400" />,
        <SiPostgresql key="postgres" className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
        <FaDatabase key="db" className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      ],
    },
    {
      icon: AiOutlineCloudServer,
      title: "DevOps & Cloud",
      description:
        "Experience with AWS, Docker, and CI/CD pipelines. Skilled in cloud deployment, containerization, and infrastructure management.",
      techIcons: [
        <FaAws key="aws" className="w-6 h-6 text-orange-500 dark:text-orange-400" />,
        <FaDocker key="docker" className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
        <FaGitAlt key="git" className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
      ],
    },
    {
      icon: AiOutlineSecurityScan,
      title: "Security & Performance",
      description:
        "Focus on application security, performance optimization, and best practices. Experience with JWT, OAuth, and security protocols.",
      techIcons: [
        <AiOutlineSecurityScan
          key="security"
          className="w-6 h-6 text-green-500 dark:text-green-400"
        />,
        <SiTypescript key="typescript" className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
        <SiJavascript key="javascript" className="w-6 h-6 text-yellow-400 dark:text-yellow-300" />,
      ],
    },
    {
      icon: SiTailwindcss,
      title: "UI/UX Development",
      description:
        "Expert in Tailwind CSS, responsive design, and modern UI frameworks. Focus on creating beautiful, accessible, and user-friendly interfaces.",
      techIcons: [
        <SiTailwindcss key="tailwind" className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />,
        <SiJavascript key="javascript" className="w-6 h-6 text-yellow-400 dark:text-yellow-300" />,
        <FaReact key="react" className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[var(--background-default)] to-[var(--background-paper)] dark:from-[var(--background-default)] dark:to-[var(--background-elevated)]"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-16 lg:mb-20 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] capitalize mb-6">
            My Technical{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-main)] to-[var(--secondary-main)] dark:from-[var(--primary-light)] dark:to-[var(--secondary-light)]">
              Expertise
            </span>
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Specialized in full-stack development with a focus on modern technologies and best
            practices
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsOverview;
