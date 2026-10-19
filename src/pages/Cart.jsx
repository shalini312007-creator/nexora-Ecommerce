
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";

function getSavedCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(savedCart) ? savedCart : [];
  } catch {
    return [];
  }
}

function getPrice(price) {
  if (typeof price === "number") {
    return Number.isFinite(price) ? price : 0;
  }

  const parsedPrice = Number(String(price || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsedPrice) ? parsedPrice : 0;
}

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      setCartItems(getSavedCart());
    };

    loadCart();

    window.addEventListener("cart-wishlist-updated", loadCart);
    window.addEventListener("storage", loadCart);
    window.addEventListener("auth-changed", loadCart);

    return () => {
      window.removeEventListener("cart-wishlist-updated", loadCart);
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("auth-changed", loadCart);
    };
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-wishlist-updated"));
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    const item = { ...updatedCart[index] };

    item.quantity = Math.max(1, Number(item.quantity) || 1) + 1;
    updatedCart[index] = item;

    updateCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    const item = { ...updatedCart[index] };
    const quantity = Math.max(1, Number(item.quantity) || 1);

    if (quantity > 1) {
      item.quantity = quantity - 1;
      updatedCart[index] = item;
    } else {
      updatedCart.splice(index, 1);
    }

    updateCart(updatedCart);
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, itemIndex) => itemIndex !== index);
    updateCart(updatedCart);
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price = getPrice(item.price);
    const quantity = Math.max(1, Number(item.quantity) || 1);

    return total + price * quantity;
  }, 0);

  return (
    <div className="cart-page">
      <h1>🛒 Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>
          <p>Add products to start shopping.</p>
        </div>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div className="cart-card" key={item._id || index}>
              <img src={item.image} alt={item.name || "Product"} />

              <div className="cart-details">
                <h3>{item.name}</h3>
                <h4>₹{getPrice(item.price).toLocaleString("en-IN")}</h4>

                <div className="quantity">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(index)}
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    -
                  </button>

                  <span>{Math.max(1, Number(item.quantity) || 1)}</span>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(index)}
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-total">
            <h2>Total: ₹{totalPrice.toLocaleString("en-IN")}</h2>

            <button
              type="button"
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
