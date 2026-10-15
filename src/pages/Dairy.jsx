import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi"; // adjust path to where productApi.js lives
import "./Dairy.css";

function Dairy() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [dairyProducts, setDairyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const products = Array.isArray(data)
          ? data.filter((product) => product.category === "Dairy")
          : [];

        setDairyProducts(products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Dairy error:", error);
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
    <div className="dairy-page">
      {message && <div className="toast">✓ {message}</div>}

      <div className="dairy-banner">
        <h1>Dairy Products</h1>
        <p>Fresh and Quality Dairy Products</p>
      </div>

      <div className="dairy-grid">
        {loading && <p>Loading dairy products...</p>}

        {!loading &&
          dairyProducts.map((item) => (
            <div
              className="dairy-card"
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

        {!loading && dairyProducts.length === 0 && (
          <p>No dairy products available.</p>
        )}
      </div>
    </div>
  );
}

export default Dairy;