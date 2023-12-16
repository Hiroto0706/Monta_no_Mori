import { useState } from "react";
import { Link } from "react-router-dom";
import Search from "./../Form/Search/Search";
import HeaderMenu from "./HeaderMenu/HeaderMenu";

import "./Header.css";

export default function Header() {
  const [toggleOpenMenu, setToggleOpenMenu] = useState(false);

  const handleToggleOpenMenu = () => {
    setToggleOpenMenu(!toggleOpenMenu);
  };

  return (
    <>
      <header className="header">
        <div className="header__logo">
          <Link to="/" onClick={() => setToggleOpenMenu(false)}>
            <img src="/monta_no_mori_logo.svg" />
          </Link>
        </div>
        <Search />
        <Link className="header__favorite" to="/favorite">
          <img src="/heart-icon.png" />
          <p>おきにいり</p>
        </Link>
        <div
          className={`header__hamburger-menu ${
            toggleOpenMenu ? "is-open" : ""
          }`}
          onClick={() => handleToggleOpenMenu()}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </header>
      {toggleOpenMenu && (
        <HeaderMenu closeHeader={() => handleToggleOpenMenu()} />
      )}
    </>
  );
}
