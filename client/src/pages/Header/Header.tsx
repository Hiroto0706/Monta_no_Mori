import * as React from "react";

import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <a href="">
          <img src="public/monta_no_mori_logo.svg" />
        </a>
      </div>
      <button className="header__favorite">
        <img src="public/heart-icon.png" />
        <p>Favorite</p>
      </button>
    </header>
  );
}
