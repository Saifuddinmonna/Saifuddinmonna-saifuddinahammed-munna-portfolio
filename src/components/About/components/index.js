import { lazy } from "react";

// Lazy load exports for better performance
export const HeroSection = lazy(() => import("./HeroSection"));
export const PhilosophySection = lazy(() => import("./PhilosophySection"));
export const JourneySection = lazy(() => import("./JourneySection"));
export const SkillsSection = lazy(() => import("./SkillsSection"));
export const ProjectsSection = lazy(() => import("./ProjectsSection"));
export const EducationSection = lazy(() => import("./EducationSection"));
export const VisionSection = lazy(() => import("./VisionSection"));
export const ContactSection = lazy(() => import("./ContactSection"));
export const CallToActionSection = lazy(() => import("./CallToActionSection"));

// Default exports for direct imports
export { default as HeroSectionDefault } from "./HeroSection";
export { default as PhilosophySectionDefault } from "./PhilosophySection";
export { default as JourneySectionDefault } from "./JourneySection";
export { default as SkillsSectionDefault } from "./SkillsSection";
export { default as ProjectsSectionDefault } from "./ProjectsSection";
export { default as EducationSectionDefault } from "./EducationSection";
export { default as VisionSectionDefault } from "./VisionSection";
export { default as ContactSectionDefault } from "./ContactSection";
export { default as CallToActionSectionDefault } from "./CallToActionSection";
