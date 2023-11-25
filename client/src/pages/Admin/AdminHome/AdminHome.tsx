import React from "react";

import "./AdminHome.css";

export default function AdminHome() {
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

          <a href="/login" className="logout">
            <img src="/logout-icon.png" />
            LOGOUT
          </a>
        </div>
      </div>
    </>
  );
}
