import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/admin");
  };

  return (
    <>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <h2>Login</h2>

        <h3>Email</h3>
        <input type="email" name="email" required />
        <h3>Password</h3>
        <input type="password" name="password" required />
        <br />
        <input type="password" name="password" required />

        <button type="submit">
          <img src="/login-icon.png" />
          LOGIN
        </button>
      </form>
    </>
  );
}
