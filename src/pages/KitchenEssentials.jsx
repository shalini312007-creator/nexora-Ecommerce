import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./KitchenEssentials.css";

function KitchenEssentials() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
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
        const kitchenProducts = data.filter(
          (product) => product.category === "Kitchen Essentials"
        );

        setProducts(kitchenProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Kitchen error:", error);
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
    <div className="kitchen-page">

      {message && (
        <div className="toast">
          ✓ {message}
        </div>
      )}

      <div className="kitchen-banner">
        <h1>Kitchen Essentials</h1>
        <p>Everything Needed For Your Kitchen</p>
      </div>

      <div className="kitchen-grid">

        {loading && (
          <p>Loading kitchen essentials...</p>
        )}

        {!loading &&
          products.map((item) => (
            <div
              className="kitchen-card"
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

        {!loading && products.length === 0 && (
          <p>No kitchen essentials available.</p>
        )}

      </div>
    </div>
  );
}

export default KitchenEssentials;