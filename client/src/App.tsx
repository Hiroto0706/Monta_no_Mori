import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./route";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

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
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            maxWidth: "85vh",
            minWidth: "70vh",
          }}
        >
          <img
            src="public/monta_no_mori_footer.png"
            alt="もんたの森のフッターイメージ"
          />
        </Box>
      </Container>
    </BrowserRouter>
  );
}

export default App;
