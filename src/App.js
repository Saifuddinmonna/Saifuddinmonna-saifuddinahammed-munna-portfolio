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

function App() {
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
	]);
	return (
		<div className="App">
			<RouterProvider router={router}></RouterProvider>
		</div>
	);
}

export default App;
