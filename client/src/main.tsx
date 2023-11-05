import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Sidebar from "./components/SidebarComponents/Sidebar/Sidebar.tsx";
import AdminSidebar from "./components/SidebarComponents/AdminSidebar/AdminSidebar.tsx";

import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Header />

    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminSidebar />} />
        <Route path="/*" element={<Sidebar />} />
      </Routes>
    </BrowserRouter>

    <App />

    <Footer />
  </React.StrictMode>
);
