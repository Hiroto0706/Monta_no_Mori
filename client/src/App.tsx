import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./route";

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
    </BrowserRouter>
  );
}

export default App;
