import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PetSupplies.css";

function PetSupplies() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [pets, setPets] = useState([]);
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
        const petProducts = data.filter(
          (product) => product.category === "Pet Supplies"
        );

        setPets(petProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Pet Supplies error:", error);
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
    <div className="pets-page">

      {message && (
        <div className="toast">
          ✓ {message}
        </div>
      )}

      <div className="pets-banner">
        <h1>Pet Supplies</h1>
        <p>Everything Your Pets Need</p>
      </div>

      <div className="pets-grid">

        {loading && (
          <p>Loading pet supplies...</p>
        )}

        {!loading &&
          pets.map((item) => (
            <div
              className="pets-card"
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

        {!loading && pets.length === 0 && (
          <p>No pet supplies available.</p>
        )}

      </div>

    </div>
  );
}

export default PetSupplies;