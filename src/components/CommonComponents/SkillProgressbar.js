import React from "react";
import { motion } from "framer-motion";
import ProgressBar from "react-bootstrap/ProgressBar";
import { IconName, GrUserExpert } from "react-icons/gr";

const SkillSection = ({ title, skills }) => {
  // Define skill levels for different categories
  const getSkillLevel = (category, skill) => {
    const levels = {
      Expertise: 90,
      Comfortable: 75,
      Familiar: 60,
      Frontend: 85,
      Backend: 80,
      DevOps: 70,
    };
    return levels[category] || 50;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <h4 className="text-lg font-semibold text-[var(--primary-main)] p-2 m-3">{title}</h4>
      <div className="p-2 space-y-4">
        {skills.split(",").map((skill, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-primary)]">{skill.trim()}</span>
              <span className="text-[var(--text-secondary)] text-sm">
                {getSkillLevel(title, skill)}%
              </span>
            </div>
            <ProgressBar now={getSkillLevel(title, skill)} className="h-2" variant="success" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const SkillDetails = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const similar =
    "Node Mailer Tools: Github, VS-Code,Brackets, Chrome Dev Tools, Heroku, Netlify,Postman, Photoshop, Figma,Illustrator etc.";
  const similararray = similar.split(",");
  console.log(similararray);
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--background-paper)] backdrop-blur-sm border border-[var(--border-color)] shadow-lg rounded-2xl p-8 transition-all duration-300 hover:shadow-xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-[var(--text-primary)] mb-8"
          >
            Skill <span className="text-[var(--primary-main)]">Details</span>
          </motion.h1>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--background-default)] backdrop-blur-sm rounded-xl p-6 border border-[var(--border-color)] hover:shadow-lg transition-all duration-300"
            >
              <SkillSection
                title="Expertise"
                skills="JavaScript, ReactJS, Node.js, MongoDB, Mongoose, Express.js, Redux, SQL, PostgreSQL, Rest API, Html5, CSS3, Bootstrap-5, Tailwind CSS, ES6, React Router, React Hook, DaisyUI, Headless, EmailJS, Npm Packages"
              />
              <SkillSection
                title="Comfortable"
                skills="Firebase, Prisma, Material UI, Next.js, Figma, SSL-COMMERCE, Stripe, GitHub, Claude.ai, TypeScript, Particle.js"
              />
              <SkillSection
                title="Familiar"
                skills="Node Mailer Tools, GitHub, VS-Code, Brackets, Chrome Dev Tools, Heroku, Netlify, Postman, Photoshop, Figma, Illustrator"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--background-default)] backdrop-blur-sm rounded-xl p-6 border border-[var(--border-color)] hover:shadow-lg transition-all duration-300"
            >
              <SkillSection
                title="Frontend"
                skills="JavaScript, TypeScript, React, Redux, Redux-Thunk/Saga, HTML5, CSS3, Styled Components, SCSS"
              />
              <SkillSection
                title="Backend"
                skills="Node.js, Express.js, MongoDB, PostgreSQL, Firebase, REST APIs"
              />
              <SkillSection
                title="DevOps"
                skills="Git, GitHub, VS Code, Netlify, Vercel, Heroku, React Dev Tools, Redux Dev Tools, Figma, Brackets, Chrome DevTools, Postman, Photoshop, Illustrator"
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SkillDetails;
