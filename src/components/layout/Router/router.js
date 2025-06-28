import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "../../Auth/AdminRoute";
import Blog from "../../Blog/Blog";
import BlogEditor from "../../Blog/BlogEditor";
import BlogPost from "../../Blog/BlogPost";
import AdminDashboardLayout from "../../features/adminDashboard/AdminDashboardLayout";
import TestimonialsPage from "../../Testimonials/TestimonialsPage";
import MyPortfolios from "../../MyPortfolios/MyPortfoliosForHomePage";
import GalleryPage from "../../../pages/GalleryPage";
import AdminDashboardHome from "../../features/adminDashboard/AdminDashboardHome";

// Lazy load ChatWindow
const LazyChatWindow = lazy(() => import("../../../socketIo/components/LazyChatWindow.js"));

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
  </div>
);

// Lazy load components
const MainLayout = lazy(() => import("../MainLayouts/MainLayout.js"));
const OptimizedHomeLayout = lazy(() => import("../MainLayouts/OptimizedHomeLayout"));
const About = lazy(() => import("../../About/About.js"));
const ContactPage = lazy(() => import("../../../pages/ContactPage"));
const ProjectPage = lazy(() => import("../../../pages/ProjectPage"));
const PortfolioLayout = lazy(() => import("../../MyPortfolios/MyPortfolioLayout/PortfolioLayout"));
const MyportfolioImage = lazy(() => import("../../MyPortfolios/MyportfolioImage"));
const ResumeViewer = lazy(() => import("../../resumes/ResumeViewer/ResumeViewer"));
const SignIn = lazy(() => import("../../../auth/components/SignIn"));
const SignUp = lazy(() => import("../../../auth/components/SignUp"));

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
        <LazyChatWindow />
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
            <OptimizedHomeLayout />
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
        path: "blog",
        element: <Blog />,
      },
      {
        path: "blog/new",
        element: (
          <ProtectedRoute>
            <BlogEditor />
          </ProtectedRoute>
        ),
      },
      {
        path: "blog/edit/:id",
        element: (
          <ProtectedRoute>
            <BlogEditor />
          </ProtectedRoute>
        ),
      },
      {
        path: "blog/:id",
        element: <BlogPost />,
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
      {
        path: "/admin/dashboard",
        element: (
          <AdminRoute>
            <AdminDashboardLayout />
          </AdminRoute>
        ),
        children: [
          {
            path: "",
            element: <AdminDashboardHome />,
          },
          {
            path: "blog",
            element: <Blog />,
          },
          {
            path: "testimonials",
            element: <TestimonialsPage />,
          },
          {
            path: "mywork",
            element: <MyPortfolios />,
          },
          {
            path: "gallery",
            element: <GalleryPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
