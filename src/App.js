import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import Footer from "./components/BodyDiv/Footer";

// Lazy load components
const MainLayout = lazy(() => import("./components/MainLayouts/Main"));
const HomeLayout = lazy(() => import("./components/MainLayouts/HomeLayout"));
const About = lazy(() => import("./components/About/About"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const MyPortfolios = lazy(() => import("./components/MyPortfolios/MyPortfolios"));
const Blog = lazy(() => import("./components/Blog/Blog"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const PortfolioLayout = lazy(() => import("./components/MyPortfolios/MyPortfolioLayout/PortfolioLayout"));
const MyportfolioImage = lazy(() => import("./components/MyPortfolios/MyportfolioImage"));

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
	<div className="flex items-center justify-center min-h-screen">
		<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
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
							<>
								<MyportfolioImage />
								<Footer />
							</>
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
		<QueryClientProvider client={queryClient}>
			<div className="App max-w-[1440px] mx-auto">
				{confettiStart && <ReactConfetti />}
				<RouterProvider router={router} />
			</div>
		</QueryClientProvider>
	);
}

export default App;
