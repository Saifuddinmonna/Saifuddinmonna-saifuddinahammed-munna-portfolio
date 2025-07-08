import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "../../Auth/AdminRoute";
import Blog from "../../Blog/Blog";
import BlogEditor from "../../Blog/BlogEditor";
import BlogPost from "../../Blog/BlogPost";
import AdminDashboardLayout from "../../features/adminDashboard/AdminDashboardLayout";
import AdminTestimonialsManager from "../../features/adminDashboard/AdminTestimonialsManager";
import AdminBlogManager from "../../features/adminDashboard/AdminBlogManager";
import AdminMyProjectWorksManager from "../../features/adminDashboard/AdminMyProjectWorksManager";
import MyProjectWorksList from "../../features/adminDashboard/MyProjectWorksList";
import MyProjectWorksForm from "../../features/adminDashboard/MyProjectWorksForm";
import MyProjectWorksDetail from "../../features/adminDashboard/MyProjectWorksDetail";
import TestimonialsPage from "../../Testimonials/TestimonialsPage";
import MyPortfolios from "../../MyPortfolios/MyPortfoliosForHomePage";
import GalleryPage from "../../../pages/GalleryPage";
import AdminDashboardHome from "../../features/adminDashboard/AdminDashboardHome";
import { ErrorFallback, NotFoundError } from "../../ErrorBoundary";
import LoadingSpinner from "../../LoadingSpinner";
import AdminResumesManager from "../../features/adminDashboard/AdminResumesManager";
import ModernResumeViewer from "../../features/adminDashboard/components/resume/ModernResumeViewer.js";

// Lazy load components
const MainLayout = lazy(() => import("../MainLayouts/MainLayout.js"));
const OptimizedHomeLayout = lazy(() => import("../MainLayouts/OptimizedHomeLayout"));
const About = lazy(() => import("../../About/About.js"));
const ContactPage = lazy(() => import("../../../pages/ContactPage"));
const ProjectPage = lazy(() => import("../../../pages/ProjectPage"));
const PortfolioLayout = lazy(() => import("../../MyPortfolios/MyPortfolioLayout/PortfolioLayout"));
const PortfolioDetailsPage = lazy(() => import("../../MyPortfolios/PortfolioDetailsPage"));
const MyportfolioImage = lazy(() => import("../../MyPortfolios/MyportfolioImage"));
const ResumeViewer = lazy(() => import("../../resumes/ResumeViewer/ResumeViewer"));
const SignIn = lazy(() => import("../../../auth/components/SignIn"));
const SignUp = lazy(() => import("../../../auth/components/SignUp"));

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/projects/:projectName",
    element: <Suspense fallback={<LoadingSpinner />}></Suspense>,
    errorElement: <ErrorFallback />,
  },

  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <MainLayout />
      </Suspense>
    ),
    errorElement: <ErrorFallback />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <OptimizedHomeLayout />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/about",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <About />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/portfolio",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PortfolioLayout />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/gallery",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <GalleryPage />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/contact",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ContactPage />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/mywork",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <MyPortfolios />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/project/:projectId",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PortfolioDetailsPage />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/blog",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Blog />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/blog/new",
        element: (
          <ProtectedRoute>
            <BlogEditor />
          </ProtectedRoute>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/blog/edit/:id",
        element: (
          <ProtectedRoute>
            <BlogEditor />
          </ProtectedRoute>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/blog/:id",
        element: <BlogPost />,
        errorElement: <ErrorFallback />,
      },
      {
        path: "/resume",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ResumeViewer />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/resume/:id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ModernResumeViewer />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/testimonials",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <TestimonialsPage />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/signin",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SignIn />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SignUp />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
      },
      {
        path: "/portfoliolayout",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PortfolioLayout />
          </Suspense>
        ),
        errorElement: <ErrorFallback />,
        children: [
          {
            path: "/portfoliolayout/:UsedPhone",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <MyportfolioImage />
              </Suspense>
            ),
            errorElement: <ErrorFallback />,
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
        errorElement: <ErrorFallback />,
        children: [
          {
            path: "",
            element: <AdminDashboardHome />,
            errorElement: <ErrorFallback />,
          },
          {
            path: "blog",
            element: <AdminBlogManager />,
            errorElement: <ErrorFallback />,
          },
          {
            path: "blog/new",
            element: <BlogEditor />,
            errorElement: <ErrorFallback />,
          },
          {
            path: "blog/edit/:id",
            element: <BlogEditor />,
            errorElement: <ErrorFallback />,
          },
          {
            path: "testimonials",
            element: <AdminTestimonialsManager />,
            errorElement: <ErrorFallback />,
          },
          {
            path: "myprojectworks",
            element: <AdminMyProjectWorksManager />,
            errorElement: <ErrorFallback />,
            children: [
              {
                path: "",
                element: <MyProjectWorksList />,
                errorElement: <ErrorFallback />,
              },
              {
                path: "create",
                element: <MyProjectWorksForm />,
                errorElement: <ErrorFallback />,
              },
              {
                path: "edit/:id",
                element: <MyProjectWorksForm />,
                errorElement: <ErrorFallback />,
              },
              {
                path: "detail/:id",
                element: <MyProjectWorksDetail />,
                errorElement: <ErrorFallback />,
              },
            ],
          },
          {
            path: "mywork",
            element: <MyPortfolios />,
            errorElement: <ErrorFallback />,
          },
          {
            path: "gallery",
            element: <GalleryPage />,
            errorElement: <ErrorFallback />,
          },
          {
            path: "resumes",
            element: <AdminResumesManager />,
            errorElement: <ErrorFallback />,
          },
        ],
      },
    ],
  },
  // Catch-all route for 404 errors
  {
    path: "*",
    element: <NotFoundError />,
  },
]);

export default router;
