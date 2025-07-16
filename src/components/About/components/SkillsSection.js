import React from "react";
import { motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaBootstrap,
  FaServer,
  FaTools,
  FaPaintBrush,
  FaPalette,
  FaCode,
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
  SiDaisyui,
} from "react-icons/si";

const SkillsSection = () => {
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

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--background-default)]">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 text-[var(--primary-main)] flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <FaCode className="mr-3 text-4xl" />
        My Technical Toolkit
      </motion.h2>
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
    </section>
  );
};

export default SkillsSection;
