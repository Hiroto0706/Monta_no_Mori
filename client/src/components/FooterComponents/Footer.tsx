import React from "react";

import AppBar from "@mui/material/AppBar";

import "./Footer.css";

const Footer = () => {
  return (
    <>
      <AppBar
        component="footer"
        position="static"
        sx={{ bgcolor: "transparent", color: "#646464" }}
        elevation={0}
      >
        <span>&copy; 2023 もんたの森</span>
      </AppBar>
    </>
  );
};

export default Footer;
