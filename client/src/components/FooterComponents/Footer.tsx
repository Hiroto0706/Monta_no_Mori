import React from "react";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box>
      <AppBar
        component="footer"
        position="static"
        sx={{ backgroundColor: "#424242", p: 4 }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption">©2023 もんたの森🌳</Typography>
          </Box>
        </Container>
      </AppBar>
    </Box>
  );
}
