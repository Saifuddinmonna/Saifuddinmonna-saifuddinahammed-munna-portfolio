import { createContext, useContext } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { theme } from "./theme/theme";
import router from "./components/Router/router";
import React from "react";
import MainLayout from "./components/MainLayouts/MainLayout";

// Create Theme Context
export const ThemeContext = createContext();

// Theme Provider Component
const ThemeProvider = ({ children }) => {
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  const [confettiStart, setConfettiStart] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfettiStart(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const setDarkMode = () => {
    if (!document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.add("dark");
    }
  };

  React.useEffect(() => {
    setDarkMode();
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 App max-w-[1440px] mx-auto bg-[var(--background-default)] text-[var(--text-primary)] transition-colors duration-200">
          {confettiStart && <ReactConfetti />}
          <RouterProvider router={router} />
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
