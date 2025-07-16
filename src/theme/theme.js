export const theme = {
  light: {
    primary: {
      main: "rgb(59, 130, 246)", // blue-500
      light: "rgb(96, 165, 250)", // blue-400
      dark: "rgb(37, 99, 235)", // blue-600
    },
    secondary: {
      main: "rgb(6, 182, 212)", // cyan-500
      light: "rgb(34, 211, 238)", // cyan-400
      dark: "rgb(8, 145, 178)", // cyan-600
    },
    background: {
      default: "rgb(255, 255, 255)",
      paper: "rgb(249, 250, 251)", // gray-50
      elevated: "rgb(243, 244, 246)", // gray-100
    },
    text: {
      primary: "rgb(17, 24, 39)", // gray-900
      secondary: "rgb(55, 65, 81)", // gray-700
      disabled: "rgb(156, 163, 175)", // gray-400
    },
    border: {
      light: "rgb(229, 231, 235)", // gray-200
      main: "rgb(209, 213, 219)", // gray-300
      dark: "rgb(156, 163, 175)", // gray-400
    },
    shadow: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    },
    footer: {
      background: "rgb(79, 70, 229)", // Example: Indigo-600, adjust as needed
      text: "rgb(255, 255, 255)", // White
      heading: "rgb(255, 255, 255)", // White
      link: "rgb(34, 211, 238)", // Example: Cyan-400, adjust as needed
      linkHover: "rgb(6, 182, 212)", // Example: Cyan-500, adjust as needed
    },
    headerGradient: {
      start: "rgb(96, 165, 250)", // Example: Blue-400, adjust as needed
      end: "rgb(75, 192, 192)", // Example: Teal-400, adjust as needed
    },
  },
  dark: {
    primary: {
      main: "rgb(147, 197, 253)", // blue-300 - brighter for better contrast
      light: "rgb(191, 219, 254)", // blue-200 - even brighter
      dark: "rgb(96, 165, 250)", // blue-400
    },
    secondary: {
      main: "rgb(103, 232, 249)", // cyan-300 - brighter for better contrast
      light: "rgb(165, 243, 252)", // cyan-200 - even brighter
      dark: "rgb(34, 211, 238)", // cyan-400
    },
    background: {
      default: "rgb(15, 23, 42)", // slate-900 - darker for better contrast
      paper: "rgb(30, 41, 59)", // slate-800
      elevated: "rgb(51, 65, 85)", // slate-700
    },
    text: {
      primary: "rgb(248, 250, 252)", // slate-50 - brighter for better contrast
      secondary: "rgb(226, 232, 240)", // slate-200
      disabled: "rgb(148, 163, 184)", // slate-400
    },
    border: {
      light: "rgb(71, 85, 105)", // slate-600
      main: "rgb(51, 65, 85)", // slate-700
      dark: "rgb(30, 41, 59)", // slate-800
    },
    shadow: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.4)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.5)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.5)",
    },
    footer: {
      background: "rgb(30, 41, 59)", // slate-800 for dark mode
      text: "rgb(248, 250, 252)", // slate-50 for dark mode
      heading: "rgb(255, 255, 255)", // White
      link: "rgb(165, 243, 252)", // cyan-200 for dark mode
      linkHover: "rgb(103, 232, 249)", // cyan-300 for dark mode
    },
    headerGradient: {
      start: "rgb(147, 197, 253)", // blue-300 for dark mode
      end: "rgb(103, 232, 249)", // cyan-300 for dark mode
    },
  },
};
