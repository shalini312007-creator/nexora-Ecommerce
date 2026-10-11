import { useState } from "react";
import "./Productcard.css";

function ProductCard({ product, onAddToCart }) {
  const [showMessage, setShowMessage] = useState(false);

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItemIndex = existingCart.findIndex(
      (item) => item._id === product._id
    );

    let updatedCart;

    if (existingItemIndex !== -1) {
      updatedCart = [...existingCart];
      updatedCart[existingItemIndex].quantity += 1;
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

    if (onAddToCart) {
      onAddToCart(product);
    }

    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  return (
    <>
      <div className="product-card">

        <img
          src={product.image}
          alt={product.name}
        />

        <h3>{product.name}</h3>

        <p>₹{product.price}</p>

        <p>{product.category}</p>

        <button onClick={handleAddToCart}>
          Add To Cart
        </button>

      </div>

      {showMessage && (
        <div className="cart-popup">
          ✓ {product.name} added to cart!
        </div>
      )}
    </>
  );
}

export default ProductCard;