import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi";// adjust path to where productApi.js lives
import "./PetSupplies.css";

function PetSupplies() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const petProducts = Array.isArray(data)
          ? data.filter((product) => product.category === "Pet Supplies")
          : [];

        setPets(petProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Pet Supplies error:", error);
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
    <div className="pets-page">
      {message && <div className="toast">✓ {message}</div>}

      <div className="pets-banner">
        <h1>Pet Supplies</h1>
        <p>Everything Your Pets Need</p>
      </div>

      <div className="pets-grid">
        {loading && <p>Loading pet supplies...</p>}

        {!loading &&
          pets.map((item) => (
            <div
              className="pets-card"
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

        {!loading && pets.length === 0 && (
          <p>No pet supplies available.</p>
        )}
      </div>
    </div>
  );
}

export default PetSupplies;