import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi";
import "./Electronics.css";

function Electronics() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const electronicsProducts = Array.isArray(data)
          ? data.filter((product) => product.category === "Electronics")
          : [];

        setProducts(electronicsProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Electronics error:", error);
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
    <div className="electronics-page">
      {message && <div className="toast">✓ {message}</div>}

      <div className="electronics-banner">
        <h1>Electronics</h1>
        <p>Latest Electronic Devices & Accessories</p>
      </div>

      <div className="electronics-grid">
        {loading && <p>Loading electronics...</p>}

        {!loading &&
          products.map((item) => (
            <div
              className="electronics-card"
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

        {!loading && products.length === 0 && (
          <p>No electronics available.</p>
        )}
      </div>
    </div>
  );
}

export default Electronics;