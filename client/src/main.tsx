import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Header from "./components/Header/Header.tsx";
import AdminHeader from "./components/Header/AdminHeader/AdminHeader.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Sidebar from "./components/Sidebar/UserSidebar/Sidebar.tsx";
import AdminSidebar from "./components/Sidebar/AdminSidebar/AdminSidebar.tsx";

import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminHeader />} />
          <Route path="/*" element={<Header />} />
        </Routes>
      </BrowserRouter>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminSidebar />} />
          <Route path="/*" element={<Sidebar />} />
        </Routes>
      </BrowserRouter>

      <App />

      <Footer />
    </React.StrictMode>
  </Provider>
);
