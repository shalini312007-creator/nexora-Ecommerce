
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/productApi";
import "./Wishlist.css";

function getSavedWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function getSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2000);
  };

  const saveWishlist = useCallback((items) => {
    const safeItems = Array.isArray(items) ? items : [];

    setWishlist(safeItems);
    localStorage.setItem("wishlist", JSON.stringify(safeItems));

    window.dispatchEvent(new Event("cart-wishlist-updated"));
  }, []);

  useEffect(() => {
    let active = true;

    const loadWishlist = async () => {
      setLoading(true);

      const token = localStorage.getItem("authToken");

      if (!token) {
        if (active) {
          setWishlist(getSavedWishlist());
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Could not load your wishlist. Please try again.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("The server returned an invalid wishlist.");
        }

        if (active) {
          saveWishlist(data);
        }
      } catch (error) {
        console.error("Wishlist loading error:", error);

        if (active) {
          setWishlist([]);
          localStorage.setItem("wishlist", JSON.stringify([]));
          setMessage(error.message || "Unable to load your wishlist.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadWishlist();

    return () => {
      active = false;
    };
  }, [saveWishlist]);

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem("authToken");

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
          throw new Error(data.message || "Failed to remove wishlist item.");
        }

        if (!Array.isArray(data.wishlist)) {
          throw new Error("The server returned an invalid wishlist.");
        }

        saveWishlist(data.wishlist);
        showMessage("Removed from wishlist");
      } catch (error) {
        console.error("Remove wishlist error:", error);
        showMessage(error.message || "Could not remove item.");
      }

      return;
    }

    const updatedWishlist = wishlist.filter(
      (item) => String(item._id) !== String(productId)
    );

    saveWishlist(updatedWishlist);
    showMessage("Removed from wishlist");
  };

  const addToCart = (product) => {
    const cart = getSavedCart();

    const existingIndex = cart.findIndex(
      (item) => String(item._id) === String(product._id)
    );

    if (existingIndex !== -1) {
      const existingItem = { ...cart[existingIndex] };
      existingItem.quantity = Math.max(
        1,
        Number(existingItem.quantity) || 1
      ) + 1;

      cart[existingIndex] = existingItem;
    } else {
      cart.push({
        ...product,
        price:
          typeof product.price === "number"
            ? `₹${product.price}`
            : product.price,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-wishlist-updated"));

    showMessage(`${product.name} added to cart!`);
  };

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

  return (
    <div className="wishlist-page">
      {message && (
        <div className="wishlist-toast" role="status">
          ✓ {message}
        </div>
      )}

      <div className="wishlist-header">
        <div>
          <h1>My Wishlist</h1>
          <p>
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">♡</div>
          <h2>Your Wishlist is Empty</h2>
          <p>Save your favourite products here and access them anytime.</p>

          <button type="button" onClick={() => navigate("/categories")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="wishlist-container">
          {wishlist.map((product) => (
            <div className="wishlist-card" key={product._id}>
              <button
                type="button"
                className="wishlist-remove"
                onClick={() => removeFromWishlist(product._id)}
                title="Remove from wishlist"
                aria-label={`Remove ${product.name} from wishlist`}
              >
                ×
              </button>

              <div
                className="wishlist-image-box"
                onClick={() => navigate(`/product/${product._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    navigate(`/product/${product._id}`);
                  }
                }}
              >
                <img src={product.image} alt={product.name} />
              </div>

              <div className="wishlist-info">
                <p className="wishlist-category">{product.category}</p>

                <h3
                  onClick={() => navigate(`/product/${product._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      navigate(`/product/${product._id}`);
                    }
                  }}
                >
                  {product.name}
                </h3>

                <div className="wishlist-rating">
                  <span>★ 4.5</span>
                  <small> | 128 ratings</small>
                </div>

                <div className="wishlist-price">
                  ₹
                  {String(product.price ?? "").replace(/[^\d.]/g, "")}
                </div>

                <div className="wishlist-actions">
                  <button
                    type="button"
                    className="wishlist-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    🛒 Add to Cart
                  </button>

                  <button
                    type="button"
                    className="wishlist-view-btn"
                    onClick={() => removeFromWishlist(product._id)}
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
