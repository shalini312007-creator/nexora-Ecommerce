import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";

function Cart() {

  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    updateCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];

    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    } else {
      updatedCart.splice(index, 1);
    }

    updateCart(updatedCart);
  };

  const removeItem = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    updateCart(updatedCart);
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, "")) || 0;
    return total + price * item.quantity;
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

            <div className="cart-card" key={index}>

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-details">

                <h3>{item.name}</h3>

                <h4>{item.price}</h4>

                <div className="quantity">

                  <button onClick={() => decreaseQuantity(index)}>
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseQuantity(index)}>
                    +
                  </button>

                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

          <div className="cart-total">

            <h2>Total: ₹{totalPrice}</h2>

            <button
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