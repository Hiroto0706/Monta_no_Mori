import React from "react";

import "./Login.css";

export default function Login() {
  return (
    <>
      <form className="form">
        <h2>Login</h2>

        <h3>User Name</h3>
        <input type="text" name="username" required />
        <h3>Email</h3>
        <input type="email" name="email" required />
        <h3>Password</h3>
        <input type="password" name="password" required />
        <br />
        <input type="password" name="password" required />

        <button>
          <img src="public/login-icon.png" />
          LOGIN
        </button>
      </form>
    </>
  );
}
