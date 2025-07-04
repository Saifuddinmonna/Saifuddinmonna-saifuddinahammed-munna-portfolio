import { Routes, Route } from "react-router-dom";
import PortfolioLayout from "./MyPortfolioLayout/PortfolioLayout";
import MyPortfoliosForHomePage from "./MyPortfoliosForHomePage";
import PortfolioDetailsPage from "./PortfolioDetailsPage";

export default function PortfolioRoutes() {
  return (
    <Routes>
      <Route path="/portfolio" element={<PortfolioLayout />}>
        <Route index element={<MyPortfoliosForHomePage />} />
        <Route path=":id" element={<PortfolioDetailsPage />} />
      </Route>
    </Routes>
  );
}
