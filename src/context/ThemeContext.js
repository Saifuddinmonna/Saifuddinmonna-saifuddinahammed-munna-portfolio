import React, { createContext, useContext, useEffect, useState } from "react";
import { theme } from "../theme/theme";

// Create Theme Context
export const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(isDarkMode ? "dark" : "light");

    // Update localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    // Update CSS variables
    const currentTheme = isDarkMode ? theme.dark : theme.light;
    Object.entries(currentTheme).forEach(([category, values]) => {
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === "object") {
          Object.entries(value).forEach(([subKey, subValue]) => {
            document.documentElement.style.setProperty(`--${category}-${key}-${subKey}`, subValue);
          });
        } else {
          document.documentElement.style.setProperty(`--${category}-${key}`, value);
        }
      });
    });

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDarkMode ? "#1f2937" : "#ffffff");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};
