import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./Checkout.css";

const API_BASE_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const EMAIL_SERVICE_ID = "service_7cp9b49";
const EMAIL_TEMPLATE_ID = "template_dur2sn2";
const EMAIL_PUBLIC_KEY = "FjfopWTtheTG-NIEi0";

// Get a product ID from different possible cart formats.
function getProductId(item) {
  const id =
    item?.productId?._id ||
    item?.product?._id ||
    item?.productId?.id ||
    item?.productId ||
    item?._id ||
    item?.id;

  return id ? String(id) : "";
}

// Get a valid product price.
function getProductPrice(item) {
  const candidates = [
    item?.price,
    item?.product?.price,
    item?.productId?.price,
    item?.unitPrice,
    item?.sellingPrice,
    item?.salePrice,
  ];

  for (const value of candidates) {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0
    ) {
      return Number(value);
    }
  }

  return null;
}

function getQuantity(item) {
  const quantity = Number(item?.quantity);
  return Number.isInteger(quantity) && quantity > 0
    ? quantity
    : 1;
}

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  // Prevent the empty-cart message from appearing
  // before localStorage and product data have loaded.
  const [cartLoading, setCartLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "Cash on Delivery",
    delivery: "Standard Delivery",
  });

  useEffect(() => {
    let active = true;

    async function loadCartAndProducts() {
      let savedCart = [];

      try {
        const parsed = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        savedCart = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Unable to read cart:", error);
      }

      try {
        const user = JSON.parse(
          localStorage.getItem("currentUser") || "null"
        );

        if (active && user) {
          setDetails((previous) => ({
            ...previous,
            name: user.name || "",
            email: user.email || "",
          }));
        }
      } catch (error) {
        console.error("Unable to read user details:", error);
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error("Could not fetch products.");
        }

        const data = await response.json();

        const products = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : [];

        const productMap = new Map();

        products.forEach((product) => {
          const id = String(product._id || product.id || "");

          if (id) {
            productMap.set(id, product);
          }
        });

        savedCart = savedCart.map((item) => {
          const productId = getProductId(item);
          const product = productMap.get(productId);

          if (!product) {
            console.warn(
              "Cart product was not found in MongoDB:",
              productId,
              item
            );

            return item;
          }

          const cartPrice = getProductPrice(item);
          const databasePrice = getProductPrice(product);

          return {
            ...product,
            ...item,

            // Keep the MongoDB product ID.
            _id: product._id || item._id,
            productId: product._id || productId,

            name: item.name || item.title || product.name,
            image: item.image || product.image,

            // Prefer the latest database price.
            price:
              databasePrice !== null
                ? databasePrice
                : cartPrice,
          };
        });
      } catch (error) {
        console.error(
          "Unable to refresh product prices:",
          error
        );
      } finally {
        // Always finish loading, even if the API fails.
        if (active) {
          setCart(savedCart);
          setCartLoading(false);
        }
      }
    }

    loadCartAndProducts();

    return () => {
      active = false;
    };
  }, []);

  const productSubtotal = cart.reduce((total, item) => {
    const price = getProductPrice(item);

    return (
      total +
      (price === null ? 0 : price * getQuantity(item))
    );
  }, 0);

  const hasMissingPrices = cart.some(
    (item) => getProductPrice(item) === null
  );

  const deliveryCharge =
    details.delivery === "Express Delivery" ? 50 : 0;

  const totalAmount = productSubtotal + deliveryCharge;

  function showPopup(message) {
    setToast(message);
    setTimeout(() => setToast(""), 4000);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setDetails((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function getAuthToken() {
    return (
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      ""
    );
  }

  function getCurrentUser() {
    try {
      return JSON.parse(
        localStorage.getItem("currentUser") || "null"
      );
    } catch {
      return null;
    }
  }

  function getOrderItems() {
    return cart.map((item) => ({
      productId: getProductId(item),
      quantity: getQuantity(item),
    }));
  }

  function validateCheckout() {
    const requiredFields = [
      ["name", "Please enter your full name."],
      ["email", "Please enter your email address."],
      ["phone", "Please enter your phone number."],
      ["address", "Please enter your delivery address."],
      ["city", "Please enter your city."],
      ["state", "Please enter your state."],
      ["pincode", "Please enter your PIN code."],
    ];

    for (const [field, message] of requiredFields) {
      if (!String(details[field] || "").trim()) {
        showPopup(message);
        return false;
      }
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        details.email.trim()
      )
    ) {
      showPopup("Please enter a valid email address.");
      return false;
    }

    if (!/^[0-9]{6}$/.test(details.pincode.trim())) {
      showPopup("Please enter a valid 6-digit PIN code.");
      return false;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(details.phone.trim())) {
      showPopup("Please enter a valid phone number.");
      return false;
    }

    if (!cart.length) {
      showPopup("Your cart is empty.");
      return false;
    }

    if (hasMissingPrices) {
      showPopup(
        "A product price could not be loaded. Please remove it from your cart and add it again."
      );
      return false;
    }

    if (cart.some((item) => !getProductId(item))) {
      showPopup(
        "A cart item is missing its product ID. Please remove it and add it again."
      );
      return false;
    }

    return true;
  }

  async function apiRequest(path, options = {}) {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "The request could not be completed."
      );
    }

    return data;
  }

  function getDeliveryAddress() {
    return {
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      address: details.address.trim(),
      city: details.city.trim(),
      state: details.state.trim(),
      pincode: details.pincode.trim(),
    };
  }

  async function sendConfirmationEmail(orderId, amount) {
    try {
      await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        {
          to_name: details.name.trim(),
          to_email: details.email.trim(),
          email: details.email.trim(),
          order_id: orderId || "Nexora order",
          total_amount: Number(amount).toFixed(2),
          payment_method: details.payment,
          delivery_method: details.delivery,
          delivery_address: [
            details.address.trim(),
            details.city.trim(),
            details.state.trim(),
            details.pincode.trim(),
          ].join(", "),
        },
        EMAIL_PUBLIC_KEY
      );
    } catch (error) {
      console.error("Confirmation email failed:", error);
    }
  }

  function finishCheckout() {
    localStorage.setItem("cart", JSON.stringify([]));
    setCart([]);

    window.dispatchEvent(
      new Event("cart-wishlist-updated")
    );

    window.dispatchEvent(new Event("storage"));
  }

  async function placeCashOnDeliveryOrder(orderItems) {
    const result = await apiRequest("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        items: orderItems,
        deliveryAddress: getDeliveryAddress(),
        delivery: details.delivery,
        paymentMethod: "Cash on Delivery",
      }),
    });

    const order = result.order || result;

    await sendConfirmationEmail(
      order._id || result.orderId,
      Number(order.totalAmount ?? totalAmount)
    );

    finishCheckout();

    showPopup("Your order has been placed successfully!");

    setTimeout(() => navigate("/order-success"), 700);
  }

  function loadRazorpay() {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;
      script.onload = () => resolve(Boolean(window.Razorpay));
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }

  async function placeOnlinePaymentOrder(orderItems) {
    const loaded = await loadRazorpay();

    if (!loaded) {
      throw new Error(
        "Payment checkout could not be loaded. Please try again."
      );
    }

    const created = await apiRequest(
      "/api/payment/create-order",
      {
        method: "POST",
        body: JSON.stringify({
          items: orderItems,
          deliveryAddress: getDeliveryAddress(),
          delivery: details.delivery,
          paymentMethod: details.payment,
        }),
      }
    );

    if (!created.order?.id || !created.key) {
      throw new Error("Unable to create the payment order.");
    }

    if (!created.nexoraOrderId) {
      throw new Error(
        "The server did not return the Nexora order ID. Please contact support."
      );
    }

    return new Promise((resolve, reject) => {
      let paymentFinished = false;

      const razorpay = new window.Razorpay({
        key: created.key,
        amount: created.order.amount,
        currency: created.order.currency || "INR",
        name: "Nexora",
        description: "Nexora purchase",
        order_id: created.order.id,

        prefill: {
          name: details.name.trim(),
          email: details.email.trim(),
          contact: details.phone.trim(),
        },

        theme: {
          color: "#16803c",
        },

        handler: async (paymentResponse) => {
          if (paymentFinished) return;
          paymentFinished = true;

          try {
            const verification = await apiRequest(
              "/api/payment/verify",
              {
                method: "POST",
                body: JSON.stringify({
                  nexoraOrderId: created.nexoraOrderId,
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,
                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,
                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
              }
            );

            if (!verification.verified) {
              throw new Error(
                "The server could not confirm your payment."
              );
            }

            await sendConfirmationEmail(
              verification.order?._id ||
                created.nexoraOrderId,
              Number(created.order.amount) / 100
            );

            finishCheckout();

            showPopup(
              "Payment successful! Your order has been placed."
            );

            setTimeout(
              () => navigate("/order-success"),
              700
            );

            resolve(verification);
          } catch (error) {
            showPopup(
              "Payment confirmation failed. Please contact support before trying to pay again."
            );

            reject(error);
          }
        },

        modal: {
          ondismiss: () => {
            if (paymentFinished) return;

            paymentFinished = true;

            reject(
              new Error(
                "Payment cancelled. Your cart has been kept."
              )
            );
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        if (paymentFinished) return;

        paymentFinished = true;

        reject(
          new Error(
            response?.error?.description ||
              "Payment failed. Your cart has been kept."
          )
        );
      });

      razorpay.open();
    });
  }

  async function placeOrder(event) {
    event.preventDefault();

    if (loading || cartLoading || !validateCheckout()) {
      return;
    }

    const user = getCurrentUser();

    if (!user || !getAuthToken()) {
      showPopup(
        "Please log in again before placing your order."
      );

      setTimeout(() => navigate("/login"), 900);
      return;
    }

    const orderItems = getOrderItems();

    setLoading(true);

    try {
      if (details.payment === "Cash on Delivery") {
        await placeCashOnDeliveryOrder(orderItems);
      } else if (
        details.payment === "UPI" ||
        details.payment === "Credit / Debit Card"
      ) {
        await placeOnlinePaymentOrder(orderItems);
      } else {
        throw new Error("Please select a valid payment method.");
      }
    } catch (error) {
      console.error("Checkout failed:", error);

      showPopup(
        error.message || "Unable to place your order."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-page">
      {toast && (
        <div className="checkout-toast" role="status">
          {toast}
        </div>
      )}

      <div className="checkout-container">
        <h1>Checkout</h1>

        {cartLoading ? (
          <div className="empty-cart">
            <p>Loading your cart...</p>
          </div>
        ) : !cart.length ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>

            <button
              type="button"
              className="place-btn"
              onClick={() => navigate("/categories")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <form onSubmit={placeOrder}>
            <div className="checkout-content">
              <section className="address-box">
                <h2>Delivery Address</h2>

                <label htmlFor="checkout-name">
                  Full Name
                </label>
                <input
                  id="checkout-name"
                  name="name"
                  value={details.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />

                <label htmlFor="checkout-email">
                  Email Address
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  name="email"
                  value={details.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />

                <label htmlFor="checkout-phone">
                  Phone Number
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  name="phone"
                  value={details.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />

                <label htmlFor="checkout-address">
                  Address
                </label>
                <textarea
                  id="checkout-address"
                  name="address"
                  value={details.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                  rows="3"
                  required
                />

                <label htmlFor="checkout-city">City</label>
                <input
                  id="checkout-city"
                  name="city"
                  value={details.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  required
                />

                <label htmlFor="checkout-state">State</label>
                <input
                  id="checkout-state"
                  name="state"
                  value={details.state}
                  onChange={handleChange}
                  autoComplete="address-level1"
                  required
                />

                <label htmlFor="checkout-pincode">
                  PIN Code
                </label>
                <input
                  id="checkout-pincode"
                  name="pincode"
                  value={details.pincode}
                  onChange={handleChange}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength="6"
                  required
                />
              </section>

              <div className="checkout-side">
                <section className="delivery-box">
                  <h2>Delivery Method</h2>

                  <label className="checkout-option">
                    <input
                      type="radio"
                      name="delivery"
                      value="Standard Delivery"
                      checked={
                        details.delivery === "Standard Delivery"
                      }
                      onChange={handleChange}
                    />

                    <span>
                      <strong>Standard Delivery</strong>
                      <span>Free delivery</span>
                    </span>
                  </label>

                  <label className="checkout-option">
                    <input
                      type="radio"
                      name="delivery"
                      value="Express Delivery"
                      checked={
                        details.delivery === "Express Delivery"
                      }
                      onChange={handleChange}
                    />

                    <span>
                      <strong>Express Delivery</strong>
                      <span>Additional ₹50</span>
                    </span>
                  </label>
                </section>

                <section className="payment-box">
                  <h2>Payment Method</h2>

                  {[
                    "Cash on Delivery",
                    "UPI",
                    "Credit / Debit Card",
                  ].map((method) => (
                    <label
                      className="checkout-option"
                      key={method}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={details.payment === method}
                        onChange={handleChange}
                      />

                      <span>{method}</span>
                    </label>
                  ))}

                  <p className="payment-note">
                    Online payments are securely processed
                    through Razorpay.
                  </p>
                </section>

                <section className="order-summary">
                  <h2>Order Summary</h2>

                  {cart.map((item, index) => {
                    const price = getProductPrice(item);
                    const quantity = getQuantity(item);

                    return (
                      <div
                        className="checkout-summary-item"
                        key={getProductId(item) || index}
                      >
                        <span>
                          {item.name ||
                            item.title ||
                            "Product"}{" "}
                          × {quantity}
                        </span>

                        <span>
                          {price === null
                            ? "Price unavailable"
                            : `₹${(
                                price * quantity
                              ).toFixed(2)}`}
                        </span>
                      </div>
                    );
                  })}

                  <div className="checkout-summary-row">
                    <span>Subtotal</span>
                    <span>
                      ₹{productSubtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="checkout-summary-row">
                    <span>Delivery</span>
                    <span>
                      {deliveryCharge === 0
                        ? "Free"
                        : `₹${deliveryCharge.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="checkout-summary-row checkout-total">
                    <strong>Total</strong>
                    <strong>
                      ₹{totalAmount.toFixed(2)}
                    </strong>
                  </div>

                  <button
                    type="submit"
                    className="place-btn"
                    disabled={
                      loading ||
                      cartLoading ||
                      hasMissingPrices
                    }
                  >
                    {loading
                      ? "Processing..."
                      : details.payment === "Cash on Delivery"
                      ? "Place Order"
                      : "Pay Securely"}
                  </button>

                  <button
                    type="button"
                    className="continue-shopping-btn"
                    onClick={() => navigate("/cart")}
                    disabled={loading}
                  >
                    Back to Cart
                  </button>
                </section>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Checkout;
