import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ToysKids.css";

function ToysKids() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [toys, setToys] = useState([]);
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
        const toyProducts = data.filter(
          (product) => product.category === "Toys & Kids"
        );

        setToys(toyProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Toys & Kids error:", error);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

    localStorage.setItem("cart", JSON.stringify(cart));

    setMessage(product.name + " added to cart!");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div className="toys-page">

      {message && (
        <div className="toast">
          ✓ {message}
        </div>
      )}

      <div className="toys-banner">
        <h1>Toys & Kids</h1>
        <p>Fun, Learning and Happiness for Kids</p>
      </div>

      <div className="toys-grid">

        {loading && (
          <p>Loading toys...</p>
        )}

        {!loading &&
          toys.map((item) => (
            <div
              className="toys-card"
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

        {!loading && toys.length === 0 && (
          <p>No toys and kids products available.</p>
        )}

      </div>

    </div>
  );
}

export default ToysKids;