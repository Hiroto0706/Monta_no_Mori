import * as React from "react";

import "./Header.css";

export default function ButtonAppBar() {
  return (
    <header className="header">
      <div className="header__logo">
        <img src="public/monta_no_mori_logo.svg" />
      </div>
      <button className="header__favorite">
        <img src="public/heart-icon.png" />
        <p>お気に入り</p>
      </button>
    </header>
  );
}
