import React from "react";

import Search from "./../Form/Search/Search";

import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <a href="/">
          <img src="/monta_no_mori_logo.svg" />
        </a>
      </div>
      <Search />
      <a className="header__favorite" href="/favorite">
        <img src="/heart-icon.png" />
        <p>おきにいり</p>
      </a>
    </header>
  );
}
