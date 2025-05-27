import { lazy, Suspense, createContext, useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { theme } from "./theme/theme";
import PortfolioLayou from "../src/components/MyPortfolios/MyPortfolioLayout/PortfolioLayout.js";

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
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};

// Lazy load components
const MainLayout = lazy(() => import("./components/MainLayouts/MainLayout.js"));
const HomeLayout = lazy(() => import("./components/MainLayouts/HomeLayout"));
const About = lazy(() => import("./components/About/About"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const MyPortfolios = lazy(() => import("./components/MyPortfolios/MyPortfolios"));
const Blog = lazy(() => import("./components/Blog/Blog"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const PortfolioLayout = lazy(() =>
  import("./components/MyPortfolios/MyPortfolioLayout/PortfolioLayout")
);
const MyportfolioImage = lazy(() => import("./components/MyPortfolios/MyportfolioImage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
  </div>
);

function App() {
  const [confettiStart, setConfettiStart] = useState(true);

  const router = createBrowserRouter([
    {
      path: "/projects/:projectName",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <ProjectPage />
        </Suspense>
      ),
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <MainLayout />
        </Suspense>
      ),
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <HomeLayout />
            </Suspense>
          ),
        },
        {
          path: "/about",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <About />
            </Suspense>
          ),
        },
        {
          path: "/about",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              {" "}
              <PortfolioLayou />{" "}
            </Suspense>
          ),
        },
        {
          path: "/gallery",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <GalleryPage />
            </Suspense>
          ),
        },
        {
          path: "/contractMe",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ContactPage />
            </Suspense>
          ),
        },
        {
          path: "/mywork",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <MyPortfolios />
            </Suspense>
          ),
        },
        {
          path: "/blog",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Blog />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/portfoliolayout",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <PortfolioLayout />
        </Suspense>
      ),
      children: [
        {
          path: "/portfoliolayout/:UsedPhone",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <MyportfolioImage />
            </Suspense>
          ),
          loader: () => {
            return fetch("portfolios.json");
          },
        },
      ],
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfettiStart(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div className=" bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200  App max-w-[1440px] mx-auto bg-[var(--background-default)] text-[var(--text-primary)] transition-colors duration-200">
          {confettiStart && <ReactConfetti />}
          <RouterProvider router={router} />
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
