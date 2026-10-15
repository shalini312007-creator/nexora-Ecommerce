import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi"; // adjust path to where productApi.js lives
import "./KitchenEssentials.css";

function KitchenEssentials() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const kitchenProducts = Array.isArray(data)
          ? data.filter((product) => product.category === "Kitchen Essentials")
          : [];

        setProducts(kitchenProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Kitchen error:", error);
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
    <div className="kitchen-page">
      {message && <div className="toast">✓ {message}</div>}

      <div className="kitchen-banner">
        <h1>Kitchen Essentials</h1>
        <p>Everything Needed For Your Kitchen</p>
      </div>

      <div className="kitchen-grid">
        {loading && <p>Loading kitchen essentials...</p>}

        {!loading &&
          products.map((item) => (
            <div
              className="kitchen-card"
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
          <p>No kitchen essentials available.</p>
        )}
      </div>
    </div>
  );
}

export default KitchenEssentials;