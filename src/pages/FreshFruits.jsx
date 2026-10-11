import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FreshFruits.css";

function FreshFruits() {
  const navigate = useNavigate();

  const [fruits, setFruits] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        const fruitProducts = data.filter(
          (product) => product.category === "Fruits"
        );

        setFruits(fruitProducts);
      })
      .catch((error) => {
        console.error("Error loading fruits:", error);
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

    setMessage(product.name + " added to cart!");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div className="fruits-page">

      {message && (
        <div className="toast">
          ✓ {message}
        </div>
      )}

      <div className="fruits-banner">
        <h1>Fresh Fruits</h1>
        <p>
          Farm Fresh Fruits Delivered to Your Doorstep
        </p>
      </div>

      <div className="fruits-grid">

        {fruits.map((item) => (
          <div
            className="fruit-card"
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

      </div>

    </div>
  );
}

export default FreshFruits;