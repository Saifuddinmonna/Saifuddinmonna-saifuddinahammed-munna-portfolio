import React, { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import router from "./components/Router/router";

// Create a client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <ChatProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <RouterProvider router={router} />
              </Suspense>
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
                theme="light"
              />
            </ChatProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
