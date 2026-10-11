import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MobilesGadgets.css";

function MobilesGadgets() {
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
        const mobileProducts = data.filter(
          (product) => product.category === "Mobiles & Gadgets"
        );

        setProducts(mobileProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Mobiles error:", error);
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
    <div className="mobile-page">

      {message && (
        <div className="toast">
          ✓ {message}
        </div>
      )}

      <div className="mobile-banner">
        <h1>Mobiles & Gadgets</h1>
        <p>Latest Smartphones and Accessories</p>
      </div>

      <div className="mobile-grid">

        {loading && (
          <p>Loading mobiles and gadgets...</p>
        )}

        {!loading &&
          products.map((item) => (
            <div
              className="mobile-card"
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
          <p>No mobiles and gadgets available.</p>
        )}

      </div>
    </div>
  );
}

export default MobilesGadgets;