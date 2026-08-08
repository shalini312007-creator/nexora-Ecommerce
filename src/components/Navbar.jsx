import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <nav className="navbar">

      <h2 className="logo">
        <Link to="/">Nexora</Link>
      </h2>

      <ul className="nav-links">

        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/categories">Categories</Link>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>

        <li>
          <Link to="/cart">🛒 Cart</Link>
        </li>

      </ul>

      {user ? (

        <button className="login-btn">
          <Link to="/profile">
            👤 {user.name}
          </Link>
        </button>

      ) : (

        <button className="login-btn">
          <Link to="/login">
            Login / Register
          </Link>
        </button>

      )}

    </nav>
  );
}

export default Navbar;