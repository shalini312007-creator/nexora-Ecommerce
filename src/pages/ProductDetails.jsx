import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL, getProducts } from "../api/productApi"; // adjust path to where productApi.js lives
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    getProducts()
      .then((data) => {
        const foundProduct = Array.isArray(data)
          ? data.find((item) => String(item._id) === String(id))
          : null;

        setProduct(foundProduct || null);

        // Check wishlist
        if (foundProduct) {
          const token = localStorage.getItem("authToken");

          // If logged in, check MongoDB wishlist
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
              .then((wishlistProducts) => {
                const alreadyWishlisted = wishlistProducts.some(
                  (item) =>
                    String(item._id) === String(foundProduct._id)
                );

                setIsWishlisted(alreadyWishlisted);
              })
              .catch((error) => {
                console.error("Wishlist check error:", error);

                // Fallback to localStorage
                const savedWishlist =
                  JSON.parse(localStorage.getItem("wishlist")) || [];

                const alreadyWishlisted = savedWishlist.some(
                  (item) =>
                    String(item._id) === String(foundProduct._id)
                );

                setIsWishlisted(alreadyWishlisted);
              });
          } else {
            // Not logged in → localStorage
            const savedWishlist =
              JSON.parse(localStorage.getItem("wishlist")) || [];

            const alreadyWishlisted = savedWishlist.some(
              (item) =>
                String(item._id) === String(foundProduct._id)
            );

            setIsWishlisted(alreadyWishlisted);
          }
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Product details error:", error);
        setLoading(false);
      });
  }, [id]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = () => {
    if (!product) return;

    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = existingCart.find(
      (item) => item._id === product._id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          price: `₹${product.price}`,
          quantity: 1
        }
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cart-wishlist-updated"));

    setMessage(`${product.name} added to cart!`);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  // =========================
  // BUY NOW
  // =========================
  const buyNow = () => {
    addToCart();

    setTimeout(() => {
      navigate("/cart");
    }, 300);
  };

  // =========================
  // WISHLIST
  // =========================
  const toggleWishlist = async () => {
    if (!product) return;

    const token = localStorage.getItem("authToken");

    // ==========================================
    // LOGGED-IN USER → MONGODB WISHLIST
    // ==========================================
    if (token) {
      try {
        // REMOVE FROM MONGODB
        if (isWishlisted) {
          const response = await fetch(
            `${API_BASE_URL}/api/wishlist/${product._id}`,
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

          setIsWishlisted(false);
          setMessage(`${product.name} removed from wishlist!`);

          // Also remove from localStorage
          const savedWishlist =
            JSON.parse(localStorage.getItem("wishlist")) || [];

          const updatedWishlist = savedWishlist.filter(
            (item) =>
              String(item._id) !== String(product._id)
          );

          localStorage.setItem(
            "wishlist",
            JSON.stringify(updatedWishlist)
          );
        }

        // ADD TO MONGODB
        else {
          const response = await fetch(
            `${API_BASE_URL}/api/wishlist`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                productId: product._id
              })
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to add wishlist item"
            );
          }

          setIsWishlisted(true);
          setMessage(`${product.name} added to wishlist!`);

          // Also keep localStorage in sync
          const savedWishlist =
            JSON.parse(localStorage.getItem("wishlist")) || [];

          const alreadyExists = savedWishlist.some(
            (item) =>
              String(item._id) === String(product._id)
          );

          if (!alreadyExists) {
            savedWishlist.push(product);

            localStorage.setItem(
              "wishlist",
              JSON.stringify(savedWishlist)
            );
          }
        }
      } catch (error) {
        console.error("Wishlist error:", error);

        setMessage(error.message);

        setTimeout(() => {
          setMessage("");
        }, 2000);
      }

      setTimeout(() => {
        setMessage("");
      }, 2000);

      return;
    }

    // ==========================================
    // NOT LOGGED IN → LOCAL STORAGE
    // ==========================================

    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const alreadyExists = savedWishlist.some(
      (item) =>
        String(item._id) === String(product._id)
    );

    let updatedWishlist;

    if (alreadyExists) {
      updatedWishlist = savedWishlist.filter(
        (item) =>
          String(item._id) !== String(product._id)
      );

      setIsWishlisted(false);
      setMessage(`${product.name} removed from wishlist!`);
    } else {
      updatedWishlist = [
        ...savedWishlist,
        product
      ];

      setIsWishlisted(true);
      setMessage(`${product.name} added to wishlist!`);
    }

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="product-details-page">
        <div className="product-details-message">
          Loading product...
        </div>
      </div>
    );
  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================
  if (!product) {
    return (
      <div className="product-details-page">
        <div className="product-details-message">
          <h2>Product not found</h2>

          <button onClick={() => navigate("/search")}>
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================
  return (
    <div className="product-details-page">

      {/* Green Toast */}
      {message && (
        <div className="product-toast">
          ✓ {message}
        </div>
      )}

      <div className="product-details-container">

        {/* Product Image */}
        <div className="product-image-section">

          <div className="product-image-box">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

        </div>

        {/* Product Information */}
        <div className="product-info-section">

          <p className="product-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <div className="product-rating">
            ★★★★★
            <span> 4.5</span>
          </div>

          <div className="product-price">
            ₹{product.price}
          </div>

          {/* Wishlist Button */}
          <button
            className={`wishlist-product-btn ${
              isWishlisted ? "wishlisted" : ""
            }`}
            onClick={toggleWishlist}
          >
            {isWishlisted
              ? "♥ Remove from Wishlist"
              : "♡ Add to Wishlist"}
          </button>

          <div className="product-divider"></div>

          <div className="product-description">

            <h3>Product Details</h3>

            <p>
              Shop this product from Nexora. We provide quality
              products across multiple categories with convenient
              delivery and secure checkout.
            </p>

          </div>

          <div className="product-actions">

            <button
              className="add-cart-btn"
              onClick={addToCart}
            >
              🛒 Add to Cart
            </button>

            <button
              className="buy-now-btn"
              onClick={buyNow}
            >
              Buy Now
            </button>

          </div>

          <div className="product-features">

            <div className="feature-item">

              <span>🚚</span>

              <div>
                <strong>Fast Delivery</strong>
                <p>Quick delivery to your doorstep</p>
              </div>

            </div>

            <div className="feature-item">

              <span>🔒</span>

              <div>
                <strong>Secure Payment</strong>
                <p>Safe and secure checkout</p>
              </div>

            </div>

            <div className="feature-item">

              <span>✓</span>

              <div>
                <strong>Quality Products</strong>
                <p>Products from trusted categories</p>
              </div>

            </div>

          </div>

        </div>
      </div>

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

    </div>
  );
}

export default ProductDetails;