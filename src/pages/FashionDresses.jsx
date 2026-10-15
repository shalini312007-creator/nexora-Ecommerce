import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FashionDresses.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function FashionDresses() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
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
        const fashionProducts = Array.isArray(data)
          ? data.filter((product) => product.category === "Fashion")
          : [];

        setProducts(fashionProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fashion error:", error);
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
    <div className="fashion-page">
      {message && <div className="toast">✓ {message}</div>}

      <div className="fashion-banner">
        <h1>Fashion & Dresses</h1>
        <p>Discover the latest trends and styles</p>
      </div>

      <div className="fashion-products">
        {loading && <p>Loading fashion products...</p>}

        {!loading &&
          products.map((item) => (
            <div
              className="fashion-card"
              key={item._id}
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <img src={item.image} alt={item.name} />

              <h3>{item.name}</h3>

              <p className="price">₹{item.price}</p>

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
          <p>No fashion products available.</p>
        )}
      </div>
    </div>
  );
}

export default FashionDresses;