import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./route";
import Container from "@mui/material/Container";

import "./main.css";

// import axios from 'axios'

function App() {
  return (
    <BrowserRouter>
      <Container className="contents" maxWidth="xl">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.name}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
