import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi";
import "./FreshVegetables.css";

function FreshVegetables() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const vegetableProducts = Array.isArray(data)
          ? data.filter((product) => product.category === "Vegetables")
          : [];

        setVegetables(vegetableProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Vegetables error:", error);
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
    <div className="vegetables-page">
      {message && <div className="toast">✓ {message}</div>}

      <div className="vegetables-banner">
        <h1>Fresh Vegetables</h1>
        <p>Healthy and Farm Fresh Vegetables</p>
      </div>

      <div className="vegetables-grid">
        {loading && <p>Loading vegetables...</p>}

        {!loading &&
          vegetables.map((item) => (
            <div
              className="vegetable-card"
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

        {!loading && vegetables.length === 0 && (
          <p>No vegetables available.</p>
        )}
      </div>
    </div>
  );
}

export default FreshVegetables;