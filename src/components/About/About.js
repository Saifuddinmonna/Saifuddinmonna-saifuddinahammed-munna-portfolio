import React, { useState, useEffect, useContext } from "react";
import router from "react-router-dom";
import ReactConfetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import {
  FaUserGraduate,
  FaCode,
  FaBullseye,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaLinkedin,
  FaGithub,
  FaGraduationCap,
  FaBriefcase,
  FaTools,
  FaGlobe,
  FaPaintBrush,
  FaServer,
  FaBootstrap,
  FaLanguage,
  FaLightbulb,
  FaEnvelope,
  FaMobileAlt,
  FaMapMarkerAlt,
  FaStar,
  FaExternalLinkAlt,
  FaProjectDiagram,
  FaBrain,
  FaCogs,
  FaPalette,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiVercel,
  SiNetlify,
  SiRedux,
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiStripe,
  SiAdobephotoshop,
  SiFigma,
  SiPostman,
  SiNpm,
  SiTypescript,
  SiDocker,
  SiJest,
  SiCypress,
  SiDaisyui,
} from "react-icons/si";

// Corrected import for VS Code icon
import { VscVscode } from "react-icons/vsc";
import { Router } from "react-router-dom";
import { useChat } from "../../context/ChatContext";

// Helper: Section Component for consistent styling and animation
const Section = ({ children, className = "", delay = 0 }) => (
  <motion.section
    className={`py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--background-default)] ${className}`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay: delay * 0.2 }}
  >
    {children}
  </motion.section>
);

// Helper: Section Title
const SectionTitle = ({ icon, title }) => (
  <motion.h2
    className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 text-[var(--primary-main)] flex items-center justify-center"
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5 }}
  >
    {React.cloneElement(icon, { className: "mr-3 text-4xl" })}
    {title}
  </motion.h2>
);

const About = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [confettiActive, setConfettiActive] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const { openChat } = useChat();

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    handleResize();
    const confettiTimer = setTimeout(() => setConfettiActive(false), 7000); // Longer confetti
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(confettiTimer);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  const categorizedSkills = [
    {
      category: "Frontend Development",
      icon: <FaReact className="text-[var(--primary-main)]" />,
      skills: [
        {
          name: "HTML5",
          icon: <FaHtml5 className="text-[var(--primary-main)]" />,
          level: "Expertise",
        },
        {
          name: "CSS3",
          icon: <FaCss3Alt className="text-[var(--primary-main)]" />,
          level: "Expertise",
        },
        {
          name: "JavaScript (ES6+)",
          icon: <FaJsSquare className="text-[var(--primary-main)]" />,
          level: "Expertise",
        },
        {
          name: "React",
          icon: <FaReact className="text-[var(--primary-main)]" />,
          level: "Expertise",
        },
        {
          name: "Next.js",
          icon: <SiNextdotjs className="text-[var(--text-primary)]" />,
          level: "Comfortable",
        },
        {
          name: "Redux",
          icon: <SiRedux className="text-[var(--primary-main)]" />,
          level: "Expertise",
        },
        {
          name: "Tailwind CSS",
          icon: <SiTailwindcss className="text-[var(--primary-main)]" />,
          level: "Expertise",
        },
        {
          name: "Bootstrap 5",
          icon: <FaBootstrap className="text-[var(--primary-main)]" />,
          level: "Expertise",
        },
        {
          name: "DaisyUI",
          icon: <SiDaisyui className="text-[var(--primary-main)]" />,
          level: "Familiar",
        },
        {
          name: "Material UI",
          icon: <FaPalette className="text-[var(--primary-main)]" />,
          level: "Comfortable",
        },
        { name: "Framer Motion", icon: <motion.div> M </motion.div>, level: "Intermediate" },
      ],
    },
    {
      category: "Backend Development",
      icon: <FaNodeJs className="text-[var(--primary-main)]" />,
      skills: [
        {
          name: "Node.js",
          icon: <FaNodeJs className="text-[var(--primary-main)]" />,
          level: "Expertise",
        },
        {
          name: "Express.js",
          icon: <SiExpress className="text-[var(--text-primary)]" />,
          level: "Expertise",
        },
        {
          name: "REST API Design",
          icon: <FaServer className="text-[var(--text-primary)]" />,
          level: "Expertise",
        },
      ],
    },
    {
      category: "Databases & ORMs",
      icon: <FaDatabase className="text-[var(--primary-main)]" />,
      skills: [
        {
          name: "MongoDB",
          icon: <SiMongodb className="text-[var(--primary-main)]" />,
          level: "Expertise",
        },
        {
          name: "Mongoose",
          icon: <FaDatabase className="text-[var(--primary-main)]" />,
          level: "Expertise",
        },
        {
          name: "Firebase",
          icon: <SiFirebase className="text-[var(--primary-main)]" />,
          level: "Comfortable",
        },
        {
          name: "SQL",
          icon: <FaDatabase className="text-[var(--primary-main)]" />,
          level: "Comfortable",
        },
        {
          name: "PostgreSQL",
          icon: <SiPostgresql className="text-[var(--primary-main)]" />,
          level: "Comfortable",
        },
        {
          name: "Prisma",
          icon: <SiPrisma className="text-[var(--primary-main)]" />,
          level: "Comfortable",
        },
      ],
    },
    {
      category: "Tools & Platforms",
      icon: <FaTools className="text-[var(--primary-main)]" />,
      skills: [
        {
          name: "Git & GitHub",
          icon: <FaGitAlt className="text-[var(--primary-main)]" />,
          level: "Proficient",
        },
        { name: "VS Code", icon: <FaCode className="text-[var(--primary-main)]" />, level: "Tool" },
        {
          name: "Chrome DevTools",
          icon: <FaTools className="text-[var(--primary-main)]" />,
          level: "Tool",
        },
        {
          name: "Postman",
          icon: <SiPostman className="text-[var(--primary-main)]" />,
          level: "Tool",
        },
        { name: "NPM", icon: <SiNpm className="text-[var(--primary-main)]" />, level: "Tool" },
        {
          name: "Vercel",
          icon: <SiVercel className="text-[var(--text-primary)]" />,
          level: "Deployment",
        },
        {
          name: "Netlify",
          icon: <SiNetlify className="text-[var(--primary-main)]" />,
          level: "Deployment",
        },
      ],
    },
    {
      category: "Design & Others",
      icon: <FaPaintBrush className="text-[var(--primary-main)]" />,
      skills: [
        { name: "Figma", icon: <SiFigma className="text-[var(--primary-main)]" />, level: "Tool" },
        {
          name: "Photoshop",
          icon: <SiAdobephotoshop className="text-[var(--primary-main)]" />,
          level: "Tool",
        },
        {
          name: "Stripe Integration",
          icon: <SiStripe className="text-[var(--primary-main)]" />,
          level: "Comfortable",
        },
      ],
    },
  ];

  const education = [
    {
      degree: "MSS (Public Administration)",
      institution: "Jatiya Kabi Kazi Nazrul Islam University (JKKNIU)",
      result: "1st Class (3.35)",
      year: "2017",
    },
    {
      degree: "BSS (Public Administration)",
      institution: "JKKNIU",
      result: "1st Class (3.26)",
      year: "2015",
    },
    {
      degree: "H.S.C (Humanities)",
      institution: "Dhaka Education Board",
      result: "GPA 5.00",
      year: "2010",
    },
    {
      degree: "S.S.C (Science)",
      institution: "Dhaka Education Board",
      result: "GPA 5.00",
      year: "2008",
    },
  ];

  const certifications = [
    {
      name: "Certified Web Development",
      from: "Programming Hero, Bangladesh",
      icon: <FaStar className="text-[var(--primary-main)]" />,
    },
    {
      name: "Computer Technology Coursework",
      from: "Relevant Academic Study",
      icon: <FaGraduationCap className="text-[var(--primary-main)]" />,
    },
  ];

  const projects = [
    {
      name: "Personal Portfolio (This Site)",
      image: "/images/portfolio.png",
      tech: ["React", "Framer Motion", "Tailwind CSS", "Firebase"],
      description:
        "A dynamic and animated showcase of my skills, projects, and journey into web development, designed to be engaging and informative.",
      liveLink: "https://saifuddinahammed-monna.web.app/",
      githubLink: "https://github.com/Saifuddinmonna/my-portfolio-saifuddin",
    },
    {
      name: "UsedPhone - E-commerce Resale",
      image: "/images/usedphone.png",
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
      image: "/images/repairservice.png",
      tech: ["React", "NodeJS", "ExpressJS", "MongoDB", "Firebase", "Tailwind CSS", "Vercel"],
      description:
        "A platform for individual service providers, featuring Google login, service management, and client review system.",
      liveLink: "https://repairservice-c3829.web.app/",
      clientGithub: "https://github.com/Saifuddinmonna/repairservice-client",
      serverGithub: "https://github.com/Saifuddinmonna/repairservice-server",
    },
    {
      name: "EnglishLearning - EdTech Platform",
      image: "/images/englishlearning.png",
      tech: ["React", "NodeJS", "ExpressJS", "MongoDB", "Firebase", "Tailwind CSS", "Vercel"],
      description:
        "An online learning platform offering courses with premium access upon registration, built with the MERN stack.",
      liveLink: "https://englishlearning-3609b.web.app/",
      clientGithub: "https://github.com/Saifuddinmonna/englishlearning-client",
      serverGithub: "https://github.com/Saifuddinmonna/englishlearning-server",
    },
  ];

  const whatImLearning = [
    {
      name: "TypeScript",
      icon: <SiTypescript className="text-[var(--primary-main)]" />,
      reason: "For robust, scalable applications and improved developer experience.",
    },
    {
      name: "Advanced Next.js Features",
      icon: <SiNextdotjs className="text-[var(--text-primary)]" />,
      reason: "To leverage server components, edge functions, and optimize performance.",
    },
    {
      name: "Testing (Jest, Cypress)",
      icon: <SiJest className="text-[var(--primary-main)]" />,
      reason: "To ensure code quality and reliability in larger projects.",
    },
    {
      name: "Docker & Basic DevOps",
      icon: <SiDocker className="text-[var(--primary-main)]" />,
      reason: "For containerization and streamlined deployment workflows.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background-default)] text-[var(--text-primary)] overflow-x-hidden">
      {confettiActive && windowSize.width > 0 && windowSize.height > 0 && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500} // More pieces
          gravity={0.15}
          tweenDuration={10000}
        />
      )}

      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* --- Hero Section --- */}
        <Section className="!pt-20 sm:!pt-28">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <motion.div className="lg:w-1/2 text-center lg:text-left" variants={itemVariants}>
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="block">Hello, I'm</span>
                <span className="block text-[var(--primary-main)]">Saifuddin Ahammed Monna</span>
              </motion.h1>
              <motion.p
                className="text-xl sm:text-2xl text-[var(--text-secondary)] mb-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                A Passionate MERN Stack Developer & Lifelong Learner, crafting intuitive and
                performant web experiences.
              </motion.p>
              <motion.div
                className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <button
                  onClick={openChat}
                  className="no-underline inline-flex items-center bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-main)] hover:from-[var(--primary-main)] hover:to-[var(--primary-main)] text-[var(--text-primary)] font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
                >
                  <FaEnvelope className="mr-2" /> Get In Touch
                </button>
                <Link
                  to="/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[var(--background-paper)] hover:bg-[var(--background-paper)] text-[var(--text-primary)] font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
                >
                  <FaUserGraduate className="mr-2" /> View Resume
                </Link>
              </motion.div>
              <motion.div
                className="flex justify-center lg:justify-start space-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <a
                  href="https://github.com/Saifuddinmonna"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors"
                >
                  <FaGithub size={32} />
                </a>
                <a
                  href="https://www.linkedin.com/in/saifuddin-ahammed-monna/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors"
                >
                  <FaLinkedin size={32} />
                </a>
                <a
                  href="https://saifuddinahammed-monna.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Portfolio Website"
                  className="text-[var(--text-secondary)] hover:text-[var(--primary-main)] transition-colors"
                >
                  <FaGlobe size={32} />
                </a>
              </motion.div>
            </motion.div>
            <motion.div
              className="lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 120, delay: 0.2 }}
            >
              <img
                src="images/profile1.png" // Ensure this path is correct
                alt="Saifuddin Ahammed Monna"
                className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full object-cover shadow-2xl border-8 border-[var(--primary-main)]"
              />
            </motion.div>
          </div>
        </Section>

        {/* --- My Philosophy Section --- */}
        <Section>
          <SectionTitle icon={<FaBrain />} title="My Development Philosophy" />
          <motion.div
            className="max-w-3xl mx-auto text-center bg-[var(--background-paper)] p-8 rounded-xl shadow-xl"
            variants={itemVariants}
          >
            <p className="text-lg sm:text-xl text-[var(--text-primary)] leading-relaxed italic">
              "I believe in crafting web solutions that are not only functional and robust but also
              intuitive and enjoyable to use. My approach centers on clean code, user-centric
              design, and a commitment to continuous learning to stay ahead in this ever-evolving
              tech landscape. Collaboration and problem-solving are at the heart of what I do,
              aiming to deliver value and make a positive impact through technology."
            </p>
          </motion.div>
        </Section>

        {/* --- My Story Section --- */}
        <Section>
          <SectionTitle icon={<FaUserGraduate />} title="My Journey" />
          <motion.div
            className="max-w-3xl mx-auto bg-[var(--background-paper)] p-6 sm:p-8 rounded-xl shadow-xl"
            variants={itemVariants}
          >
            <p className="text-lg text-[var(--text-primary)] leading-relaxed indent-8 mb-4">
              A MERN stack specialist, I thrive on building and deploying dynamic web applications,
              from single-page sites to complex e-commerce platforms. My passion for technology
              drives my rapid adaptability and eagerness to master new tools and techniques.
            </p>
            <p className="text-lg text-[var(--text-primary)] leading-relaxed indent-8">
              Originating from Mymensingh, Bangladesh, my academic journey culminated in a Master's
              in Public Administration. However, the allure of coding redirected my path. For
              several years, I've immersed myself in web development, transforming ideas into
              tangible digital experiences and tackling intricate challenges with enthusiasm. This
              dedication isn't just a career; it's a significant, evolving part of my life.
            </p>
          </motion.div>
        </Section>

        {/* --- Skills Section --- */}
        <Section>
          <SectionTitle icon={<FaCode />} title="My Technical Toolkit" />
          <div className="space-y-10">
            {categorizedSkills.map((category, catIndex) => (
              <motion.div key={category.category} variants={itemVariants}>
                <h3 className="text-2xl font-semibold mb-6 text-[var(--text-primary)] flex items-center">
                  {React.cloneElement(category.icon, { className: "mr-3 text-3xl" })}
                  {category.category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      className="flex flex-col items-center p-4 bg-[var(--background-paper)] rounded-lg shadow-lg hover:shadow-[var(--shadow-md)] transition-all duration-300 transform hover:-translate-y-1"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: catIndex * 0.1 + skillIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-4xl sm:text-5xl mb-2 transition-transform duration-300 group-hover:scale-110">
                        {skill.icon}
                      </div>
                      <h4 className="text-sm sm:text-md font-medium text-center text-[var(--text-primary)]">
                        {skill.name}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">{skill.level}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* --- Projects Section --- */}
        <Section>
          <SectionTitle icon={<FaProjectDiagram />} title="Featured Projects" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {projects.slice(0, 4).map(
              (
                project,
                index // Showing 4 projects
              ) => (
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
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/400x250/CCCCCC/FFFFFF?text=${encodeURIComponent(
                          project.name
                        )}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-[var(--primary-main)] mb-2">
                      {project.name}
                    </h3>
                    <div className="mb-3">
                      {project.tech.slice(0, 5).map(
                        (
                          t // Show max 5 tech tags
                        ) => (
                          <span
                            key={t}
                            className="inline-block bg-[var(--background-paper)] text-[var(--text-primary)] text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full"
                          >
                            {t}
                          </span>
                        )
                      )}
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
              )
            )}
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
        </Section>

        {/* --- Education & Certifications Section --- */}
        <Section>
          <SectionTitle icon={<FaGraduationCap />} title="Education & Certifications" />
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">
                Academic Qualifications
              </h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[8.75rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent via-[var(--background-paper)] to-transparent">
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    className="relative flex items-start group"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <div className="absolute left-5 -translate-x-1/2 transform md:left-[8.75rem] top-1.5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--primary-main)] bg-[var(--background-paper)] group-hover:bg-[var(--primary-main)] transition-colors duration-300">
                        <FaGraduationCap
                          className="text-[var(--primary-main)] group-hover:text-[var(--text-primary)] transition-colors duration-300"
                          size={20}
                        />
                      </div>
                    </div>
                    <div className="ml-10 md:ml-44 p-4 bg-[var(--background-paper)] rounded-lg shadow-lg w-full">
                      <h4 className="text-lg sm:text-xl font-semibold text-[var(--primary-main)]">
                        {edu.degree}
                      </h4>
                      <p className="text-md text-[var(--text-secondary)]">{edu.institution}</p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {edu.result} ({edu.year})
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">
                Key Certifications
              </h3>
              <ul className="space-y-4">
                {certifications.map((cert, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start p-4 bg-[var(--background-paper)] rounded-lg shadow-lg"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <div className="mr-4 text-2xl text-[var(--primary-main)] shrink-0">
                      {cert.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-[var(--text-primary)]">
                        {cert.name}
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)]">{cert.from}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </Section>

        {/* --- Vision & Future Focus Section --- */}
        <Section>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <motion.div
              variants={itemVariants}
              className="bg-[var(--background-paper)] p-6 sm:p-8 rounded-xl shadow-xl"
            >
              <SectionTitle icon={<FaBullseye />} title="My Vision" />
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed text-center italic mb-6">
                "My ultimate goal is to become a highly proficient web developer and contribute
                meaningfully to the open-source community, particularly by building optimized NPM
                packages for React. I believe in the power of shared knowledge and aim to create
                tools that simplify and enhance the development experience for others."
              </p>
              <div className="text-center text-2xl text-[var(--primary-main)] mt-4">
                ~ Saifuddin Ahammed Monna ~
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-[var(--background-paper)] p-6 sm:p-8 rounded-xl shadow-xl"
            >
              <SectionTitle icon={<FaCogs />} title="Current Learning & Future Focus" />
              <ul className="space-y-4">
                {whatImLearning.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start p-3 bg-[var(--background-paper)] rounded-lg shadow-sm"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="mr-3 text-2xl text-[var(--primary-main)] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)]">{item.name}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">{item.reason}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </Section>

        {/* --- More About Me / Contact Info Snippet --- */}
        <Section>
          <SectionTitle icon={<FaLightbulb />} title="Connect & Know More" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              variants={itemVariants}
              className="bg-[var(--background-paper)] p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold text-[var(--primary-main)] mb-3 flex items-center">
                <FaLanguage className="mr-2" /> Languages
              </h3>
              <ul className="list-disc list-inside ml-4 text-[var(--text-secondary)]">
                <li>Bangla (Native)</li>
                <li>English (Proficient)</li>
              </ul>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-[var(--background-paper)] p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold text-[var(--primary-main)] mb-3 flex items-center">
                <FaStar className="mr-2" /> Key Strengths
              </h3>
              <ul className="list-disc list-inside ml-4 text-[var(--text-secondary)] grid grid-cols-1 sm:grid-cols-2 gap-x-2">
                <li>Analytical Thinking</li>
                <li>Problem Solving</li>
                <li>Adaptability</li>
                <li>Team Collaboration</li>
                <li>Continuous Learning</li>
              </ul>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-[var(--background-paper)] p-6 rounded-xl shadow-lg md:col-span-2 lg:col-span-1"
            >
              <h3 className="text-xl font-semibold text-[var(--primary-main)] mb-3 flex items-center">
                <FaMapMarkerAlt className="mr-2" /> Contact Information
              </h3>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li className="flex items-center">
                  <FaEnvelope className="mr-3 text-[var(--primary-main)]" />{" "}
                  <a
                    href="mailto:saifuddinmonna@email.com"
                    className="hover:text-[var(--primary-main)]"
                  >
                    saifuddinmonna@email.com
                  </a>
                </li>
                <li className="flex items-center">
                  <FaMobileAlt className="mr-3 text-[var(--primary-main)]" /> +8801623361191
                </li>
                <li className="flex items-center">
                  <FaMapMarkerAlt className="mr-3 text-[var(--primary-main)]" /> Mymensingh,
                  Bangladesh
                </li>
              </ul>
            </motion.div>
          </div>
        </Section>

        {/* --- Footer Call to Action --- */}
        <Section className="!pb-20 text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-6 text-[var(--text-primary)]"
            variants={itemVariants}
          >
            Ready to build something amazing together?
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto"
            variants={itemVariants}
          >
            I'm always excited to discuss new projects, creative ideas, or opportunities to
            collaborate. Let's connect and bring your vision to life!
          </motion.p>
          <motion.a
            href="mailto:saifuddinmonna@email.com"
            className="inline-flex items-center bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-main)] hover:from-[var(--primary-main)] hover:to-[var(--primary-main)] text-[var(--text-primary)] font-bold py-4 px-10 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 text-xl"
            variants={itemVariants}
          >
            <FaEnvelope className="mr-3" /> Let's Talk
          </motion.a>
        </Section>
      </motion.div>
    </div>
  );
};

export default About;
