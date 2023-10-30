import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import Header from "./pages/Header/Header.tsx";
import Footer from "./pages/Footer/Footer.tsx";
import Sidebar from "./pages/SidebarComponents/Sidebar.tsx";

import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Header />
    <Sidebar />
    <App />
    <Footer />
  </React.StrictMode>
);
