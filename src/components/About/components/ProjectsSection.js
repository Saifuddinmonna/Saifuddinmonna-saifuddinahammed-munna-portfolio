import React from "react";
import { motion } from "framer-motion";
import { FaProjectDiagram, FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const ProjectsSection = () => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  const projects = [
    {
      name: "Personal Portfolio (This Site)",
      image: "images/project-portfolio.png",
      tech: ["React", "Framer Motion", "Tailwind CSS", "Firebase"],
      description:
        "A dynamic and animated showcase of my skills, projects, and journey into web development, designed to be engaging and informative.",
      liveLink: "https://saifuddinahammed-monna.web.app/",
      githubLink: "https://github.com/Saifuddinmonna/my-portfolio-saifuddin",
    },
    {
      name: "UsedPhone - E-commerce Resale",
      image: "images/project-usedphone.png",
      tech: [
        "React",
        "NodeJS",
        "ExpressJS",
        "MongoDB",
        "Stripe",
        "Firebase",
        "Tailwind CSS",
        "DaisyUI",
        "Vercel",
      ],
      description:
        "Full-stack MERN application for buying/selling used phones with role-based access, payment integration, and admin dashboard.",
      liveLink: "https://usedphone-f28c1.web.app/",
      clientGithub: "https://github.com/Saifuddinmonna/usedphone-client",
      serverGithub: "https://github.com/Saifuddinmonna/usedphone-server",
    },
    {
      name: "RepairService - Service Platform",
      image: "images/project-repairservice.png",
      tech: ["React", "NodeJS", "ExpressJS", "MongoDB", "Firebase", "Tailwind CSS", "Vercel"],
      description:
        "A platform for individual service providers, featuring Google login, service management, and client review system.",
      liveLink: "https://repairservice-c3829.web.app/",
      clientGithub: "https://github.com/Saifuddinmonna/repairservice-client",
      serverGithub: "https://github.com/Saifuddinmonna/repairservice-server",
    },
    {
      name: "EnglishLearning - EdTech Platform",
      image: "images/project-englishlearning.png",
      tech: ["React", "NodeJS", "ExpressJS", "MongoDB", "Firebase", "Tailwind CSS", "Vercel"],
      description:
        "An online learning platform offering courses with premium access upon registration, built with the MERN stack.",
      liveLink: "https://englishlearning-3609b.web.app/",
      clientGithub: "https://github.com/Saifuddinmonna/englishlearning-client",
      serverGithub: "https://github.com/Saifuddinmonna/englishlearning-server",
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--background-default)]">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 text-[var(--primary-main)] flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <FaProjectDiagram className="mr-3 text-4xl" />
        Featured Projects
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {projects.slice(0, 4).map((project, index) => (
          <motion.div
            key={project.name}
            className="bg-[var(--background-paper)] rounded-xl shadow-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-[var(--shadow-md)]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="relative h-56 sm:h-64 w-full overflow-hidden">
              <img
                src={
                  project.image ||
                  `https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=${encodeURIComponent(
                    project.name
                  )}`
                }
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold text-[var(--primary-main)] mb-2">{project.name}</h3>
              <div className="mb-3">
                {project.tech.slice(0, 5).map(t => (
                  <span
                    key={t}
                    className="inline-block bg-[var(--background-paper)] text-[var(--text-primary)] text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full"
                  >
                    {t}
                  </span>
                ))}
                {project.tech.length > 5 && (
                  <span className="text-xs text-[var(--text-secondary)]">
                    +{project.tech.length - 5} more
                  </span>
                )}
              </div>
              <p className="text-[var(--text-primary)] mb-4 text-sm leading-relaxed flex-grow">
                {project.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-3 pt-4 border-t border-[var(--border-main)]">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm bg-[var(--primary-main)] hover:bg-[var(--primary-main)] text-[var(--text-primary)] py-2 px-4 rounded-md transition-colors duration-300 transform hover:scale-105"
                  >
                    <FaExternalLinkAlt className="mr-2" /> Live Demo
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm bg-[var(--background-paper)] hover:bg-[var(--background-paper)] text-[var(--text-primary)] py-2 px-4 rounded-md transition-colors duration-300 transform hover:scale-105"
                  >
                    <FaGithub className="mr-2" /> GitHub
                  </a>
                )}
                {project.clientGithub && (
                  <a
                    href={project.clientGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm bg-[var(--background-paper)] hover:bg-[var(--background-paper)] text-[var(--text-primary)] py-2 px-4 rounded-md transition-colors duration-300 transform hover:scale-105"
                  >
                    Client Code
                  </a>
                )}
                {project.serverGithub && (
                  <a
                    href={project.serverGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm bg-[var(--background-paper)] hover:bg-[var(--background-paper)] text-[var(--text-primary)] py-2 px-4 rounded-md transition-colors duration-300 transform hover:scale-105"
                  >
                    Server Code
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {projects.length > 4 && (
        <motion.div className="text-center mt-12" variants={itemVariants}>
          <a
            href="https://github.com/Saifuddinmonna?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-main)] hover:from-[var(--primary-main)] hover:to-[var(--primary-main)] text-[var(--text-primary)] font-semibold py-3 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105 text-lg"
          >
            Explore More Projects
          </a>
        </motion.div>
      )}
    </section>
  );
};

export default ProjectsSection;
