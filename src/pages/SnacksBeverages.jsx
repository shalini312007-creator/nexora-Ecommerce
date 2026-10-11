import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SnacksBeverages.css";

function SnacksBeverages() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
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
        const snacksProducts = data.filter(
          (product) => product.category === "Snacks"
        );

        setItems(snacksProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Snacks error:", error);
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
    <div className="snacks-page">

      {message && (
        <div className="toast">
          ✓ {message}
        </div>
      )}

      <div className="snacks-banner">
        <h1>Snacks & Beverages</h1>
        <p>Delicious Snacks and Refreshing Drinks</p>
      </div>

      <div className="snacks-grid">

        {loading && (
          <p>Loading snacks and beverages...</p>
        )}

        {!loading &&
          items.map((item) => (
            <div
              className="snack-card"
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

        {!loading && items.length === 0 && (
          <p>No snacks and beverages available.</p>
        )}

      </div>
    </div>
  );
}

export default SnacksBeverages;