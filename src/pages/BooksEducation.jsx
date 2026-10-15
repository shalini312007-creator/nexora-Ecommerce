import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi";
import "./BooksEducation.css";

function BooksEducation() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const bookProducts = Array.isArray(data)
          ? data.filter(
              (product) =>
                product.category === "Books & Education"
            )
          : [];

        setBooks(bookProducts);
      })
      .catch((error) => {
        console.error("Books error:", error);
        setBooks([]);
      })
      .finally(() => {
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
    } catch {
      cart = [];
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
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cart-wishlist-updated"));

    setMessage(product.name + " added to cart!");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div className="books-page">
      {message && (
        <div className="toast">
          ✓ {message}
        </div>
      )}

      <div className="books-banner">
        <h1>Books & Education</h1>
        <p>Learn, Explore and Grow with the Right Resources</p>
      </div>

      <div className="books-grid">
        {loading && (
          <p>Loading books and education products...</p>
        )}

        {!loading &&
          books.map((item) => (
            <div
              className="books-card"
              key={item._id}
              onClick={() =>
                navigate(`/product/${item._id}`)
              }
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

        {!loading && books.length === 0 && (
          <p>No books and education products available.</p>
        )}
      </div>
    </div>
  );
}

export default BooksEducation;