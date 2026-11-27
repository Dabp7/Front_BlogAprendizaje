import React from "react";
import "./DashboardPage.css";

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <div className="error-box">
        <h1 className="error-code">404</h1>
        <p className="error-message">Página no encontrada</p>
        <a href="/" className="home-button">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default DashboardPage;
