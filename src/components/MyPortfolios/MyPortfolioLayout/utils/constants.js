// =======================
// Constants
// =======================
export const CONFETTI_DURATION = 8000;
export const MOBILE_BREAKPOINT = 720;
export const SCROLL_POSITION = {
  mobile: 800,
  desktop: 0,
};

export const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
};

export const STYLE_OPTIONS = {
  DEFAULT: "default",
  MODERN: "modern",
  MINIMAL: "minimal",
  GRADIENT: "gradient",
  NEUMORPHIC: "neumorphic",
};

export const VIEW_MODES = {
  GRID_1: "grid-1",
  GRID_2: "grid-2",
  GRID_3: "grid-3",
  LIST: "list",
};

// =======================
// Google Fonts (inline)
// =======================
export const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
`;

// =======================
// Animation Variants
// =======================
export const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

// =======================
// Common Styles
// =======================
export const commonButtonStyles =
  "transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] active:translate-y-[1px] shadow-md hover:shadow-lg";
