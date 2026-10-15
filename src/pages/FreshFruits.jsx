import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FreshFruits.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function FreshFruits() {
  const navigate = useNavigate();

  const [fruits, setFruits] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        const fruitProducts = Array.isArray(data)
          ? data.filter((product) => product.category === "Fruits")
          : [];

        setFruits(fruitProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading fruits:", error);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    let cart = [];

    try {
      const storedCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      cart = Array.isArray(storedCart) ? storedCart : [];
    } catch (error) {
      console.error("Error reading cart:", error);
    }

    const existing = cart.find(
      (item) => item._id === product._id
    );

    if (existing) {
      existing.quantity = (Number(existing.quantity) || 1) + 1;
    } else {
      cart.push({
        ...product,
        price: `₹${product.price}`,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cart-wishlist-updated"));

    setMessage(`${product.name} added to cart!`);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div className="fruits-page">
      {message && <div className="toast">✓ {message}</div>}

      <div className="fruits-banner">
        <h1>Fresh Fruits</h1>
        <p>Farm Fresh Fruits Delivered to Your Doorstep</p>
      </div>

      <div className="fruits-grid">
        {loading && <p>Loading fresh fruits...</p>}

        {!loading &&
          fruits.map((item) => (
            <div
              className="fruit-card"
              key={item._id}
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <img src={item.image} alt={item.name} />

              <h3>{item.name}</h3>

              <p>₹{item.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}

        {!loading && fruits.length === 0 && (
          <p>No fresh fruits available.</p>
        )}
      </div>
    </div>
  );
}

export default FreshFruits;