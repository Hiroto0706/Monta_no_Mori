import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./route";

import "./App.css";

// import axios from 'axios'

function App() {
  const [name] = useState("Hiroto Kadota");

  return (
    <BrowserRouter>
      <h1>Hello World, {name}</h1>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.name}
            path={route.path}
            element={<route.component />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
