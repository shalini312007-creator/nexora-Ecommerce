import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FreshVegetables.css";

function FreshVegetables() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        const vegetableProducts = data.filter(
          (product) => product.category === "Vegetables"
        );

        setVegetables(vegetableProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Vegetables error:", error);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    let cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      (item) => item._id === product._id
    );

    if (existing) {
      existing.quantity += 1;
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

    setMessage(
      product.name + " added to cart!"
    );

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div className="vegetables-page">

      {message && (
        <div className="toast">
          ✓ {message}
        </div>
      )}

      <div className="vegetables-banner">
        <h1>Fresh Vegetables</h1>
        <p>Healthy and Farm Fresh Vegetables</p>
      </div>

      <div className="vegetables-grid">

        {loading && (
          <p>Loading vegetables...</p>
        )}

        {!loading &&
          vegetables.map((item) => (
            <div
              className="vegetable-card"
              key={item._id}
              onClick={() =>
                navigate(`/product/${item._id}`)
              }
            >
              <img
                src={item.image}
                alt={item.name}
              />

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

        {!loading &&
          vegetables.length === 0 && (
            <p>
              No vegetables available.
            </p>
          )}

      </div>

    </div>
  );
}

export default FreshVegetables;