import React, { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import "./AdminHome.css";
import axios from "axios";

export default function AdminHome() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    console.log("君ログインしてないなぇ！1");
    navigate("/login");
  };

  useEffect(() => {
    IsLoggedIn(localStorage.getItem("access_token"), navigate);
  }, [navigate]);

  return (
    <>
      <div className="admin-component">
        <div className="admin-component__inner admin">
          <h2>Admin Home</h2>

          <div className="admin-component__inner__contents">
            <a href="/admin/image">
              <img src="/image-icon.png" />
              Image
            </a>
            <a href="/admin/type">
              <img src="/image-icon.png" />
              Type
            </a>
            <a href="/admin/category">
              <img src="/image-icon.png" />
              Category
            </a>
          </div>

          <div className="logout" onClick={() => logout()}>
            <img src="/logout-icon.png" />
            LOGOUT
          </div>
        </div>
      </div>
    </>
  );
}

export const IsLoggedIn = async (
  accessToken: string | null,
  navigate: NavigateFunction
) => {
  if (accessToken === null) {
    navigate("/login");
    return;
  }

  const formData = new FormData();
  formData.append("accessToken", accessToken);

  try {
    await axios.post("http://localhost:8080/api/v1/login/verify", formData);
  } catch (error) {
    console.error(error);
    navigate("/login");
  }
};
