import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingCart } from "lucide-react";
import logoIcon from "../assets/nexora-icon.png";
import "./Navbar.css";

function getStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  /* =========================
     USER + CART + WISHLIST
  ========================= */

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("currentUser")));
    } catch {
      setUser(null);
    }

    const updateCounts = () => {
      setWishlistCount(getStoredArray("wishlist").length);

      const cart = getStoredArray("cart");

      setCartCount(
        cart.reduce(
          (total, item) => total + (Number(item.quantity) || 1),
          0
        )
      );
    };

    updateCounts();

    window.addEventListener("storage", updateCounts);
    window.addEventListener("cart-wishlist-updated", updateCounts);

    return () => {
      window.removeEventListener("storage", updateCounts);
      window.removeEventListener("cart-wishlist-updated", updateCounts);
    };
  }, []);

  /* =========================
     FETCH PRODUCTS
  ========================= */

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Navbar search error:", error);
      });
  }, []);

  /* =========================
     SEARCH SUGGESTIONS
  ========================= */

  useEffect(() => {
    const searchValue = searchText.trim().toLowerCase();

    if (!searchValue) {
      setSuggestions([]);
      return;
    }

    const matches = products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        category.includes(searchValue)
      );
    });

    setSuggestions(matches.slice(0, 5));
  }, [searchText, products]);

  /* =========================
     SEARCH
  ========================= */

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchText.trim();

    if (!query) return;

    setSuggestions([]);

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  /* =========================
     SUGGESTION CLICK
  ========================= */

  const handleSuggestionClick = (product) => {
    setSearchText(product.name);
    setSuggestions([]);

    navigate(
      `/search?q=${encodeURIComponent(product.name)}`
    );
  };

  return (
    <nav className="navbar">

      {/* =========================
          LOGO
      ========================= */}

<Link to="/" className="logo">
  <span className="logo-badge">
    <img src={logoIcon} alt="" className="logo-icon" />
  </span>
  <span className="logo-text-wrap">
    <span className="logo-text">Nexora</span>
    <span className="logo-tagline">Live Better</span>
  </span>
</Link>

      {/* =========================
          NAVIGATION LINKS
      ========================= */}

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
      </ul>

      {/* =========================
          SEARCH BAR
      ========================= */}

      <form
        className="navbar-search"
        onSubmit={handleSearch}
      >
        <div className="search-input-wrapper">

          <input
            type="search"
            placeholder="Search products..."
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            aria-label="Search products"
          />

          {/* SEARCH ICON INSIDE SEARCH BOX */}

          <button
            type="submit"
            className="search-button"
            aria-label="Search"
          >
            <Search size={18} strokeWidth={2} />
          </button>

        </div>

        {/* =========================
            SEARCH SUGGESTIONS
        ========================= */}

        {suggestions.length > 0 && (
          <div className="search-suggestions">

            {suggestions.map((product) => (
              <button
                type="button"
                className="search-suggestion-item"
                key={product._id}
                onClick={() =>
                  handleSuggestionClick(product)
                }
              >
                <img
                  src={product.image}
                  alt=""
                />

                <span className="suggestion-info">
                  <strong>
                    {product.name}
                  </strong>

                  <span>
                    ₹{product.price}
                  </span>
                </span>
              </button>
            ))}

          </div>
        )}
      </form>

      {/* =========================
          NAVBAR ACTIONS
      ========================= */}

      <div className="navbar-actions">

        {/* Wishlist */}

        <Link
          to="/wishlist"
          className="navbar-icon-link wishlist-link"
          aria-label={`Wishlist${
            wishlistCount > 0
              ? `, ${wishlistCount} items`
              : ""
          }`}
          title="Wishlist"
        >
          <Heart size={21} />

          {wishlistCount > 0 && (
            <span className="navbar-badge">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart */}

        <Link
          to="/cart"
          className="navbar-icon-link cart-link"
          aria-label={`Cart${
            cartCount > 0
              ? `, ${cartCount} items`
              : ""
          }`}
        >
          <ShoppingCart size={21} />

          <span className="icon-label">
            Cart
          </span>

          {cartCount > 0 && (
            <span className="navbar-badge">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Login / Profile */}

        <Link
          className="login-btn"
          to={user ? "/profile" : "/login"}
        >
          {user ? user.name : "Login / Register"}
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;