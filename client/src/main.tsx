import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import Header from "./components/HeaderComponents/Header";
import Footer from "./components/FooterComponents/Footer";
import Sidebar from "./components/SidebarComponents/Sidebar";

import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Header />
    <Sidebar />
    <App />
    <Footer />
  </React.StrictMode>
);
