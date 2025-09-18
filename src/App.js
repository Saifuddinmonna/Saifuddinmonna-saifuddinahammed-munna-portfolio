import { createContext } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, lazy } from "react";
import ReactConfetti from "react-confetti";
import { theme } from "./theme/theme";
import router from "./components/layout/Router/router";

import { AuthProvider } from "./auth/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

// Import SocketProvider directly - DISABLED FOR PERFORMANCE
// import { SocketProvider } from "./socketIo/SocketProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initializeErrorHandling } from "./utils/errorHandler";
import WhatsAppButton from "./components/ui/WhatsAppButton";
const PerformanceMonitor = lazy(() => import("./components/features/PerformanceMonitor"));
const PerformanceOptimizer = lazy(() => import("./components/features/PerformanceOptimizer"));

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

// Enhanced QueryClient configuration for v5
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
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

  // Initialize error handling
  useEffect(() => {
    initializeErrorHandling();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <Toaster position="top-right" />
            {/* SocketProvider DISABLED FOR PERFORMANCE */}
            {/* <SocketProvider> */}
            <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 App max-w-[1440px] mx-auto bg-[var(--background-default)] text-[var(--text-primary)] transition-colors duration-200">
              {confettiStart && <ReactConfetti />}
              <RouterProvider router={router} />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={localStorage.getItem("theme") === "dark" ? "dark" : "light"}
              />
              <PerformanceMonitor />
              <PerformanceOptimizer />
              <WhatsAppButton />
            </div>
            {/* </SocketProvider> */}
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
