import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import HomePage from "./pages/homePage/HomePage";
import DashboardPage from "./pages/dashboard/DashboardPage";

function App() {

  return (
    <>
    <div id = "root">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/*" element= {<DashboardPage/>}/>
        </Routes>
    </div>
    </>
  );
}

export default App;