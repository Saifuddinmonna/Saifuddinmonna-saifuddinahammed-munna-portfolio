import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ChatWindow from "../../socketIo/components/ChatWindow.js";
import Blog from "../Blog/Blog";
import BlogEditor from "../Blog/BlogEditor";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
  </div>
);

// Lazy load components
const MainLayout = lazy(() => import("../MainLayouts/MainLayout.js"));
const HomeLayout = lazy(() => import("../MainLayouts/HomeLayout"));
const About = lazy(() => import("../About/About.js"));
const ContactPage = lazy(() => import("../../pages/ContactPage"));
const MyPortfolios = lazy(() => import("../MyPortfolios/MyPortfoliosForHomePage.js"));
const ProjectPage = lazy(() => import("../../pages/ProjectPage"));
const PortfolioLayout = lazy(() => import("../MyPortfolios/MyPortfolioLayout/PortfolioLayout"));
const MyportfolioImage = lazy(() => import("../MyPortfolios/MyportfolioImage"));
const GalleryPage = lazy(() => import("../../pages/GalleryPage"));
const ResumeViewer = lazy(() => import("../ResumeViewer/ResumeViewer"));
const TestimonialsPage = lazy(() => import("../../pages/TestimonialsPage"));
const SignIn = lazy(() => import("../../auth/components/SignIn"));
const SignUp = lazy(() => import("../../auth/components/SignUp"));

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/projects/:projectName",
    element: <Suspense fallback={<LoadingSpinner />}></Suspense>,
  },
  {
    path: "/*",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PrivateRoute>
          <ChatWindow />
        </PrivateRoute>
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
        path: "/portfolio",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PortfolioLayout />
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
        path: "/contact",
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
        element: <Blog />,
      },
      {
        path: "/blog/new",
        element: <BlogEditor />,
      },
      {
        path: "/blog/edit/:id",
        element: <BlogEditor />,
      },
      {
        path: "/resume",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ResumeViewer />
          </Suspense>
        ),
      },
      {
        path: "/testimonials",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <TestimonialsPage />
          </Suspense>
        ),
      },
      {
        path: "/signin",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SignUp />
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

export default router;
