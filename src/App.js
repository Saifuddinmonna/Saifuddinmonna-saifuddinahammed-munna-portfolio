import logo from "./logo.svg";
import "./App.css";
import HeaderPage from "./components/BodyDiv/HeaderPage";
import FotterPage from "./components/BodyDiv/FotterPage";
import NavbarPage from "./components/BodyDiv/NavbarPage";
import StripedExample from "./components/BodyDiv/SkillProgressbar";
import ContractMe, { ContactUs } from "./components/ContractMe/ContractMe";
import Main from "./components/Main/Main";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./components/About/About";
import NavbarPage2 from "./components/NavbarPage/NavbarPage2";
import MyPortfolios from "./components/MyPortfolios/MyPortfolios";
import Blog from "./components/Blog/Blog";
import PortfolioLayout from "./components/MyPortfolios/MyPortfolioLayout/PortfolioLayout";
import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import MyportfolioImage from "./components/MyPortfolios/MyportfolioImage";
import { useEffect } from "react";
import { useState } from "react";
import ReactConfetti from "react-confetti";
const queryClient = new QueryClient();

function App() {

	const [confettiStart, setConfettiStart] = useState(true);
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Main></Main>,
			children: [
				{
					path: "/about",
					element: <About> </About>,
				},
				{
					path: "/contractme",
					element: (
						<div>
							<ContractMe></ContractMe>
							<StripedExample></StripedExample>
						</div>
					),
				},
				{
					path: "/mywork",
					element: <MyPortfolios></MyPortfolios>,
				},
				{
					path: "/blog",
					element: <Blog></Blog>,
				},
			],
		},
		{
			path: "/portfoliolayout",
			element: <PortfolioLayout></PortfolioLayout>,
			children: [
				{
					path: "/portfoliolayout/:UsedPhone",
					element: (
						
							<MyportfolioImage></MyportfolioImage>
						
					),
					loader: () => {
						return fetch("portfolios.json");
					},
				},
			],
		},
	]);

	useEffect(() => {
		setTimeout(() => {
			setConfettiStart(false);
		}, 8000);
	}, []);
	return (
		<QueryClientProvider client={queryClient}>
			<div className="App max-w-[1440px] mx-auto">
				{confettiStart && <ReactConfetti />}

				<RouterProvider router={router}></RouterProvider>
			</div>
		</QueryClientProvider>
	);
}

export default App;
