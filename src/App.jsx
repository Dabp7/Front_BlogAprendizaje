import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import DashboardPage from "./pages/dashboard/DashboardPage";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
}
