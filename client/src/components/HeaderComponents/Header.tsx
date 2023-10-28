import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import FavoriteIcon from "@mui/icons-material/Favorite";

import "./Header.css";

export default function ButtonAppBar() {
  return (
    <Box>
      <AppBar position="static" sx={{ bgcolor: "#4caf50" , px: 2, py: 1}}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link className="header_tile" href="/">
            <img src="public/monta_no_mori_logo.svg" />
          </Link>
          <Button size="medium" sx={{ color: "white" , fontSize: 18}}>
            <FavoriteIcon
              sx={{
                width: "25px",
                height: "25px",
                color: "#ffffff",
                pr: 0.75,
              }}
            ></FavoriteIcon>
            お気に入り
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
