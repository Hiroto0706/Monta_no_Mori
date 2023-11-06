import React from "react";

import "./AdminHome.css";

export default function Login() {
  return (
    <>
      <div className="admin-component">
        <div className="admin-component__inner admin">
          <h2>Admin画面</h2>

          <div className="admin-component__inner__contents">
            <a href="/admin">
              <button>
                {" "}
                <img src="public/image-icon.png" />
                Image
              </button>
            </a>
            <a href="/admin">
              <button>
                {" "}
                <img src="public/image-icon.png" />
                Type
              </button>
            </a>
            <a href="/admin">
              <button>
                {" "}
                <img src="public/image-icon.png" />
                Category
              </button>
            </a>
          </div>

          <button className="logout">
            <img src="public/logout-icon.png" />
            LOGOUT
          </button>
        </div>
      </div>
    </>
  );
}
