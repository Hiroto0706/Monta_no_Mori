import React from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";

import "./Login.css";

export default function Login() {
  return (
    <>
      <Card>
        <Container className="card" sx={{ m: 0, s: 2 }}>
          <h1>This is Login Form</h1>
        </Container>
      </Card>
    </>
  );
}
