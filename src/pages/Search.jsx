import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import "./Search.css";

function Search() {
    const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchText = searchParams.get("q") || "";

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
        const searchResults = data.filter((product) => {
          const name = product.name?.toLowerCase() || "";
          const category = product.category?.toLowerCase() || "";

          return (
            name.includes(searchText.toLowerCase()) ||
            category.includes(searchText.toLowerCase())
          );
        });

        setProducts(searchResults);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Search error:", error);
        setLoading(false);
      });
  }, [searchText]);

  const addToCart = (product) => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = existingCart.find(
      (item) => item._id === product._id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          price: `₹${product.price}`,
          quantity: 1
        }
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="search-page">

      <h1>Search Results</h1>

      <p className="search-heading">
        Results for: <strong>"{searchText}"</strong>
      </p>

      {loading && (
        <p className="search-message">
          Loading products...
        </p>
      )}

      {!loading && products.length === 0 && (
        <p className="search-message">
          No products found.
        </p>
      )}

      <div className="search-grid">

        {products.map((product) => (


<div
  className="search-card"
  key={product._id}
  onClick={() => navigate(`/product/${product._id}`)}
>
            <img
              src={product.image}
              alt={product.name}
            />

            <h3>{product.name}</h3>

            <p className="search-price">
              ₹{product.price}
            </p>

            <p className="search-category">
              {product.category}
            </p>

            <button
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Search;