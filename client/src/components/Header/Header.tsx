import { Link } from "react-router-dom";
import Search from "./../Form/Search/Search";

import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">
          <img src="/monta_no_mori_logo.svg" />
        </Link>
      </div>
      <Search />
      <Link className="header__favorite" to="/favorite">
        <img src="/heart-icon.png" />
        <p>おきにいり</p>
      </Link>
    </header>
  );
}
