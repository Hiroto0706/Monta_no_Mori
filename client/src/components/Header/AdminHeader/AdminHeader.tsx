import { Link } from "react-router-dom";
import "./../Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/admin">
          <img src="/monta_no_mori_admin_logo.svg" />
        </Link>
      </div>
    </header>
  );
}
