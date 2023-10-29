import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
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
