import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Footer from "./components/Footer/Footer.tsx";

import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Footer />
    </React.StrictMode>
  </Provider>
  // <Provider store={store}>
  //   <React.StrictMode>
  //     <BrowserRouter>
  //       <Routes>
  //         <Route path="/admin/*" element={<AdminHeader />} />
  //         <Route path="/*" element={<Header />} />
  //       </Routes>
  //     </BrowserRouter>
  //     <BrowserRouter>
  //       <Routes>
  //         <Route path="/admin/*" element={<AdminSidebar />} />
  //         <Route path="/*" element={<Sidebar />} />
  //       </Routes>
  //     </BrowserRouter>

  //     <App />

  //     <Footer />
  //   </React.StrictMode>
  // </Provider>
);
