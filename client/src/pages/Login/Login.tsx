import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [checkPassword, setCheckPassword] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleCheckPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckPassword(event.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password != checkPassword) {
      setIsError(true);
      return;
    }

    const formData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/login",
        formData
      );
      localStorage.setItem("access_token", response.data.access_token);
      navigate("/admin");
    } catch (error) {
      setIsError(true);
      console.error("Login error : ", error);
    }
  };

  return (
    <>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <h2>Login</h2>

        <h3>Username</h3>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => handleUsername(e)}
          required
        />
        <h3>Email</h3>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => handleEmail(e)}
          required
        />
        <h3>Password</h3>
        <input
          type="password"
          name="password"
          value={password}
          required
          onChange={(e) => handlePassword(e)}
        />
        <br />
        <input
          type="password"
          name="checkPassword"
          value={checkPassword}
          className="last-input"
          required
          onChange={(e) => handleCheckPassword(e)}
        />

        {isError && (
          <span className="error-message">
            ※UsernameまたはEmail,Passwordが正しくありません
          </span>
        )}

        <button type="submit">
          <img src="/login-icon.png" />
          LOGIN
        </button>
      </form>
    </>
  );
}
