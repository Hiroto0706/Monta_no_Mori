import { Routes, Route } from "react-router-dom";
import routes from "./route";

import Header from "./components/Header/Header.tsx";
import AdminHeader from "./components/Header/AdminHeader/AdminHeader.tsx";
import Sidebar from "./components/Sidebar/UserSidebar/Sidebar.tsx";
import AdminSidebar from "./components/Sidebar/AdminSidebar/AdminSidebar.tsx";

import "./main.css";

// import axios from 'axios'

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin/*" element={<AdminHeader />} />
        <Route path="/*" element={<Header />} />
      </Routes>

      <Routes>
        <Route path="/admin/*" element={<AdminSidebar />} />
        <Route path="/*" element={<Sidebar />} />
      </Routes>

      <div className="contents">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.name}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </div>
    </>
  );
}

export default App;
