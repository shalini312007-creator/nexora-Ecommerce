import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SkincareBeauty.css";

function SkincareBeauty() {
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
        const skincareProducts = data.filter(
          (product) => product.category === "Skincare"
        );

        setProducts(skincareProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Skincare error:", error);
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
    <div className="beauty-page">

      {message && (
        <div className="toast">
          ✓ {message}
        </div>
      )}

      <div className="beauty-banner">
        <h1>Skincare & Beauty</h1>
        <p>Discover premium beauty and skincare products</p>
      </div>

      <div className="beauty-products">

        {loading && <p>Loading beauty products...</p>}

        {!loading &&
          products.map((item) => (
            <div
              className="beauty-card"
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
          <p>No beauty products available.</p>
        )}

      </div>
    </div>
  );
}

export default SkincareBeauty;