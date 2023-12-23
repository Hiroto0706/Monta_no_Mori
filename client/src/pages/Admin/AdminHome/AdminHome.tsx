import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import "./AdminHome.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminHome() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
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
            <Link to="/admin/image">
              <img src="/image-icon-0.png" />
              Image
            </Link>
            <Link to="/admin/type">
              <img src="/type-icon-0.png" />
              Type
            </Link>
            <Link to="/admin/category">
              <img src="/category-icon-0.png" />
              Category
            </Link>
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
    await axios.post(import.meta.env.VITE_BASE_API + "login/verify", formData);
  } catch (error) {
    console.error(error);
    navigate("/login");
  }
};
