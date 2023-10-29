import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./route";
// import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";

import "./main.css";

// import axios from 'axios'

function App() {
  return (
    <BrowserRouter>
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
      {/* <div className="bg-image">
        <img
          src="public/monta_no_mori_footer.png"
          alt="もんたの森のフッターイメージ"
        />
      </div> */}
    </BrowserRouter>
  );
}

export default App;
