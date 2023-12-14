import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <h1 style={{ padding: "2rem", margin: 0 }}>404 NotFound</h1>
      <Link to="/" style={{ padding: "0rem 2rem", margin: 0 }}>
        ほーむにもどる
      </Link>
    </>
  );
}
