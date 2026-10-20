
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingCart } from "lucide-react";
import logoIcon from "../assets/nexora-icon.png";
import "./Navbar.css";
import { API_BASE_URL, getProducts } from "../api/productApi";

function getStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  } catch {
    return null;
  }
}

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(getStoredUser);
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const updateLocalCounts = useCallback(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);

    if (!storedUser) {
      setWishlistCount(0);
      setCartCount(0);
      return;
    }

    setWishlistCount(getStoredArray("wishlist").length);

    const cart = getStoredArray("cart");
    setCartCount(
      cart.reduce(
        (total, item) => total + (Number(item.quantity) || 1),
        0
      )
    );
  }, []);

  // Fetch the logged-in user's wishlist directly after login.
  const refreshWishlist = useCallback(async () => {
    const storedUser = getStoredUser();
    const token = localStorage.getItem("authToken");

    setUser(storedUser);

    if (!storedUser || !token) {
      setWishlistCount(0);
      setCartCount(0);
      return;
    }

    updateLocalCounts();

    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Unable to refresh wishlist count.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid wishlist response.");
      }

      // Avoid applying a previous user's response after logout/account change.
      if (
        localStorage.getItem("authToken") !== token ||
        !getStoredUser()
      ) {
        return;
      }

      localStorage.setItem("wishlist", JSON.stringify(data));
      setWishlistCount(data.length);
    } catch (error) {
      console.error("Navbar wishlist error:", error);
      // Keep the locally available count if the request fails.
    }
  }, [updateLocalCounts]);

  useEffect(() => {
    updateLocalCounts();
    refreshWishlist();

    const handleAuthChange = () => {
      updateLocalCounts();
      refreshWishlist();
    };

    const handleStorage = () => {
      updateLocalCounts();

      if (localStorage.getItem("authToken")) {
        refreshWishlist();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cart-wishlist-updated", updateLocalCounts);
    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cart-wishlist-updated", updateLocalCounts);
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, [refreshWishlist, updateLocalCounts]);

  // Load products for search suggestions.
  useEffect(() => {
    let active = true;

    getProducts()
      .then((data) => {
        if (active) {
          setProducts(Array.isArray(data) ? data : []);
        }
      })
      .catch((error) => {
        console.error("Navbar search error:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  // Search suggestions.
  useEffect(() => {
    const searchValue = searchText.trim().toLowerCase();

    if (!searchValue) {
      setSuggestions([]);
      return;
    }

    const matches = products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";

      return name.includes(searchValue) || category.includes(searchValue);
    });

    setSuggestions(matches.slice(0, 5));
  }, [searchText, products]);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchText.trim();
    if (!query) return;

    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSuggestionClick = (product) => {
    setSearchText(product.name);
    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(product.name)}`);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-badge">
          <img src={logoIcon} alt="" className="logo-icon" />
        </span>

        <span className="logo-text-wrap">
          <span className="logo-text">Nexora</span>
          <span className="logo-tagline">Live Better</span>
        </span>
      </Link>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/categories">Categories</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <form className="navbar-search" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <input
            type="search"
            placeholder="Search products..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            aria-label="Search products"
          />

          <button
            type="submit"
            className="search-button"
            aria-label="Search"
          >
            <Search size={18} strokeWidth={2} />
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((product) => (
              <button
                type="button"
                className="search-suggestion-item"
                key={product._id}
                onClick={() => handleSuggestionClick(product)}
              >
                <img src={product.image} alt="" />

                <span className="suggestion-info">
                  <strong>{product.name}</strong>
                  <span>₹{product.price}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="navbar-actions">
        <Link
          to="/wishlist"
          className="navbar-icon-link wishlist-link"
          aria-label={`Wishlist${
            wishlistCount > 0 ? `, ${wishlistCount} items` : ""
          }`}
          title="Wishlist"
        >
          <Heart size={21} />

          {wishlistCount > 0 && (
            <span className="navbar-badge">{wishlistCount}</span>
          )}
        </Link>

        <Link
          to="/cart"
          className="navbar-icon-link cart-link"
          aria-label={`Cart${
            cartCount > 0 ? `, ${cartCount} items` : ""
          }`}
        >
          <ShoppingCart size={21} />
          <span className="icon-label">Cart</span>

          {cartCount > 0 && (
            <span className="navbar-badge">{cartCount}</span>
          )}
        </Link>

        <Link
          className="login-btn"
          to={user ? "/profile" : "/login"}
        >
          {user?.name || "Login / Register"}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
