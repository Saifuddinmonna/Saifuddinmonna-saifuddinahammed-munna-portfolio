import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import SignIn from "../Auth/SignIn";
import SignUp from "../Auth/SignUp";
import LiveChat from "../Chat/LiveChat";
import PrivateRoute from "../Auth/PrivateRoute";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
  </div>
);

// Error Boundary Component
const ErrorBoundary = ({ error }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Reload Page
    </button>
  </div>
);

// Lazy load components with error handling
const lazyLoad = importFunc => {
  return lazy(() => {
    return importFunc().catch(error => {
      console.error("Error loading chunk:", error);
      return {
        default: () => <ErrorBoundary error={error} />,
      };
    });
  });
};

// Lazy load components
const MainLayout = lazyLoad(() => import("../MainLayouts/MainLayout.js"));
const HomeLayout = lazyLoad(() => import("../MainLayouts/HomeLayout"));
const About = lazyLoad(() => import("../About/About.js"));
const ContactPage = lazyLoad(() => import("../../pages/ContactPage"));
const MyPortfolios = lazyLoad(() => import("../MyPortfolios/MyPortfoliosForHomePage.js"));
const Blog = lazyLoad(() => import("../Blog/Blog"));
const ProjectPage = lazyLoad(() => import("../../pages/ProjectPage"));
const PortfolioLayout = lazyLoad(() => import("../MyPortfolios/MyPortfolioLayout/PortfolioLayout"));
const MyportfolioImage = lazyLoad(() => import("../MyPortfolios/MyportfolioImage"));
const GalleryPage = lazyLoad(() => import("../../pages/GalleryPage"));
const ResumeViewer = lazyLoad(() => import("../ResumeViewer/ResumeViewer"));
const TestimonialsPage = lazyLoad(() => import("../../pages/TestimonialsPage"));

// Create router configuration with future flags
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <MainLayout />
        </Suspense>
      ),
      errorElement: <ErrorBoundary error={{ message: "Failed to load page" }} />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <HomeLayout />
            </Suspense>
          ),
        },
        {
          path: "about",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <About />
            </Suspense>
          ),
        },
        {
          path: "portfolio",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <PortfolioLayout />
            </Suspense>
          ),
        },
        {
          path: "gallery",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <GalleryPage />
            </Suspense>
          ),
        },
        {
          path: "contact",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ContactPage />
            </Suspense>
          ),
        },
        {
          path: "blog",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Blog />
            </Suspense>
          ),
        },
        {
          path: "resume",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ResumeViewer />
            </Suspense>
          ),
        },
        {
          path: "testimonials",
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <TestimonialsPage />
            </Suspense>
          ),
        },
        {
          path: "signin",
          element: <SignIn />,
        },
        {
          path: "signup",
          element: <SignUp />,
        },
        {
          path: "chat",
          element: (
            <PrivateRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <LiveChat />
              </Suspense>
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: "/projects/:projectName",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <ProjectPage />
        </Suspense>
      ),
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
          path: ":UsedPhone",
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
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

export default router;
