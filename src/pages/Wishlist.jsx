import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/productApi"; // adjust path to where productApi.js lives
import "./Wishlist.css";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD WISHLIST
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    // Logged-in user → MongoDB
    if (token) {
      fetch(`${API_BASE_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to get wishlist");
          }

          return response.json();
        })
        .then((data) => {
          setWishlist(data);

          // Keep localStorage in sync
          localStorage.setItem(
            "wishlist",
            JSON.stringify(data)
          );

          setLoading(false);
        })
        .catch((error) => {
          console.error("Wishlist loading error:", error);

          // Fallback to localStorage
          const savedWishlist =
            JSON.parse(localStorage.getItem("wishlist")) || [];

          setWishlist(savedWishlist);
          setLoading(false);
        });

      return;
    }

    // Not logged in → localStorage
    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(savedWishlist);
    setLoading(false);
  }, []);

  // =========================
  // REMOVE FROM WISHLIST
  // =========================
  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem("authToken");

    // =========================
    // LOGGED-IN USER
    // =========================
    if (token) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/wishlist/${productId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to remove wishlist item"
          );
        }

        // Backend returns updated wishlist
        setWishlist(data.wishlist);

        // Keep localStorage in sync
        localStorage.setItem(
          "wishlist",
          JSON.stringify(data.wishlist)
        );

        setMessage("Removed from wishlist");

        setTimeout(() => {
          setMessage("");
        }, 2000);
      } catch (error) {
        console.error("Remove wishlist error:", error);

        setMessage(error.message);

        setTimeout(() => {
          setMessage("");
        }, 2000);
      }

      return;
    }

    // =========================
    // NOT LOGGED IN
    // =========================
    const updatedWishlist = wishlist.filter(
      (item) => String(item._id) !== String(productId)
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    setMessage("Removed from wishlist");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (product) => {
    let cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(
      (item) => item._id === product._id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        price: `₹${product.price}`,
        quantity: 1
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(new Event("cart-wishlist-updated"));

    setMessage(`${product.name} added to cart!`);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
        </div>

        <div className="wishlist-empty">
          <h2>Loading Wishlist...</h2>
        </div>
      </div>
    );
  }

  // =========================
  // EMPTY WISHLIST
  // =========================
  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">

        <div className="wishlist-header">
          <h1>My Wishlist</h1>
        </div>

        <div className="wishlist-empty">

          <div className="wishlist-empty-icon">
            ♡
          </div>

          <h2>Your Wishlist is Empty</h2>

          <p>
            Save your favourite products here and
            access them anytime.
          </p>

          <button
            onClick={() => navigate("/categories")}
          >
            Continue Shopping
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // WISHLIST PAGE
  // =========================
  return (
    <div className="wishlist-page">

      {/* Green Toast */}
      {message && (
        <div className="wishlist-toast">
          ✓ {message}
        </div>
      )}

      <div className="wishlist-header">

        <div>
          <h1>My Wishlist</h1>

          <p>
            {wishlist.length}{" "}
            {wishlist.length === 1
              ? "item"
              : "items"}{" "}
            saved
          </p>
        </div>

      </div>

      <div className="wishlist-container">

        {wishlist.map((product) => (

          <div
            className="wishlist-card"
            key={product._id}
          >

            {/* Remove X */}
            <button
              className="wishlist-remove"
              onClick={() =>
                removeFromWishlist(product._id)
              }
              title="Remove from wishlist"
            >
              ×
            </button>

            {/* Product Image */}
            <div
              className="wishlist-image-box"
              onClick={() =>
                navigate(
                  `/product/${product._id}`
                )
              }
            >
              <img
                src={product.image}
                alt={product.name}
              />
            </div>

            {/* Product Information */}
            <div className="wishlist-info">

              <p className="wishlist-category">
                {product.category}
              </p>

              <h3
                onClick={() =>
                  navigate(
                    `/product/${product._id}`
                  )
                }
              >
                {product.name}
              </h3>

              <div className="wishlist-rating">
                <span>★ 4.5</span>
                <small>
                  {" "}
                  | 128 ratings
                </small>
              </div>

              <div className="wishlist-price">
                ₹{product.price}
              </div>

              <div className="wishlist-actions">

                {/* Add To Cart */}
                <button
                  className="wishlist-cart-btn"
                  onClick={() =>
                    addToCart(product)
                  }
                >
                  🛒 Add to Cart
                </button>

                {/* Remove From Wishlist */}
                <button
                  className="wishlist-view-btn"
                  onClick={() =>
                    removeFromWishlist(product._id)
                  }
                >
                  Remove from Wishlist
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Wishlist;