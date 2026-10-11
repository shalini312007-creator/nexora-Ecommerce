import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "Cash on Delivery",
    delivery: "Standard Delivery"
  });

  const [message, setMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);

  // Load cart for order summary
  useEffect(() => {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCartItems(cart);

    // Automatically start Checkout from the top
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value
    });
  };

  const showPopup = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // Calculate product subtotal
  const productSubtotal = cartItems.reduce(
    (total, item) => {
      const price =
        typeof item.price === "number"
          ? item.price
          : parseInt(
              String(item.price).replace(/[^\d]/g, "")
            ) || 0;

      return total + price * (item.quantity || 1);
    },
    0
  );

  const deliveryCharge =
    details.delivery === "Express Delivery"
      ? 50
      : 0;

  const finalTotal =
    productSubtotal + deliveryCharge;

  // Save order in MongoDB
  const saveOrder = async (
    orderItems,
    totalAmount,
    currentUser,
    paymentDetails = {}
  ) => {
    const response = await fetch(
      "http://localhost:5000/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            "authToken"
          )}`
        },
        body: JSON.stringify({
          userId: currentUser.id,
          items: orderItems,
          totalAmount: totalAmount,

          deliveryAddress: {
            name: details.name,
            email: details.email,
            phone: details.phone,
            address: details.address,
            city: details.city,
            state: details.state,
            pincode: details.pincode
          },

          delivery: details.delivery,

          ...paymentDetails
        })
      }
    );

    return response;
  };

  // Send confirmation email
  const sendConfirmationEmail = () => {
    return emailjs.send(
      "service_7cp9b49",
      "template_dur2sn2",
      {
        name: details.name,
        email: details.email,
        phone: details.phone,
        address: details.address,
        city: details.city,
        state: details.state,
        pincode: details.pincode,
        payment: details.payment
      },
      "FjfopWTtheTG-NIEi"
    );
  };

  // Load Razorpay Checkout
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const placeOrder = async () => {
    // Validate address details
    if (
      !details.name ||
      !details.email ||
      !details.phone ||
      !details.address ||
      !details.city ||
      !details.state ||
      !details.pincode
    ) {
      showPopup("Please fill all the details.");
      return;
    }

    try {
      // Check login
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
      );

      if (!currentUser || !currentUser.id) {
        showPopup(
          "Please login before placing an order."
        );

        setTimeout(() => {
          navigate("/login");
        }, 2500);

        return;
      }

      // Get latest cart
      const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

      if (cart.length === 0) {
        showPopup("Your cart is empty.");

        setTimeout(() => {
          navigate("/cart");
        }, 2500);

        return;
      }

      // Prepare order items
      const orderItems = cart.map((item) => ({
        productId: item._id || item.productId,

        name: item.name,

        price:
          typeof item.price === "number"
            ? item.price
            : parseInt(
                String(item.price).replace(/[^\d]/g, "")
              ) || 0,

        quantity: item.quantity || 1,

        image: item.image
      }));

      // Calculate total
      let totalAmount = orderItems.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      );

      // Express delivery charge
      if (
        details.delivery === "Express Delivery"
      ) {
        totalAmount += 50;
      }

      // ==========================================
      // CASH ON DELIVERY
      // ==========================================

      if (
        details.payment === "Cash on Delivery"
      ) {
        const orderResponse = await saveOrder(
          orderItems,
          totalAmount,
          currentUser,
          {
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Pending"
          }
        );

        const orderData =
          await orderResponse.json();

        if (!orderResponse.ok) {
          showPopup(
            orderData.message ||
              "Failed to place order."
          );

          return;
        }

        console.log(
          "COD Order saved:",
          orderData
        );

        // Send confirmation email
        try {
          await sendConfirmationEmail();

          console.log(
            "Confirmation email sent."
          );
        } catch (emailError) {
          console.log(
            "Email error:",
            emailError
          );
        }

        // Clear cart
        localStorage.removeItem("cart");

        // Existing green popup
        showPopup(
          "✓ Order placed successfully!"
        );

        setTimeout(() => {
          navigate("/order-success");
        }, 2500);

        return;
      }

      // ==========================================
      // RAZORPAY PAYMENT
      // ==========================================

      showPopup(
        "Opening secure payment..."
      );

      // Load Razorpay
      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {
        showPopup(
          "Unable to load Razorpay. Please try again."
        );

        return;
      }

      // Create Razorpay order
      const paymentOrderResponse =
        await fetch(
          "http://localhost:5000/api/payment/create-order",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",

              Authorization: `Bearer ${localStorage.getItem(
                "authToken"
              )}`
            },

            body: JSON.stringify({
              amount: totalAmount
            })
          }
        );

      const paymentOrderData =
        await paymentOrderResponse.json();

      if (!paymentOrderResponse.ok) {
        showPopup(
          paymentOrderData.message ||
            "Unable to create payment."
        );

        return;
      }

      const razorpayOrder =
        paymentOrderData.order;

      // Razorpay checkout options
      const options = {
        key: paymentOrderData.key,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "Nexora",

        description:
          "Nexora E-Commerce Order",

        order_id: razorpayOrder.id,

        prefill: {
          name: details.name,

          email: details.email,

          contact: details.phone
        },

        theme: {
          color: "#28a745"
        },

        handler: async function (
          paymentResponse
        ) {
          try {
            showPopup(
              "Verifying payment..."
            );

            // Verify Razorpay payment
            const verifyResponse =
              await fetch(
                "http://localhost:5000/api/payment/verify",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",

                    Authorization: `Bearer ${localStorage.getItem(
                      "authToken"
                    )}`
                  },

                  body: JSON.stringify({
                    razorpay_order_id:
                      paymentResponse.razorpay_order_id,

                    razorpay_payment_id:
                      paymentResponse.razorpay_payment_id,

                    razorpay_signature:
                      paymentResponse.razorpay_signature
                  })
                }
              );

            const verifyData =
              await verifyResponse.json();

            if (
              !verifyResponse.ok ||
              !verifyData.verified
            ) {
              showPopup(
                "Payment verification failed."
              );

              return;
            }

            // Payment verified
            showPopup(
              "Payment successful! Saving order..."
            );

            // Save order only AFTER payment verification
            const orderResponse =
              await saveOrder(
                orderItems,
                totalAmount,
                currentUser,
                {
                  paymentMethod:
                    details.payment,

                  paymentStatus:
                    "Paid",

                  razorpayOrderId:
                    paymentResponse.razorpay_order_id,

                  razorpayPaymentId:
                    paymentResponse.razorpay_payment_id
                }
              );

            const orderData =
              await orderResponse.json();

            if (!orderResponse.ok) {
              showPopup(
                orderData.message ||
                  "Payment successful but order could not be saved."
              );

              return;
            }

            console.log(
              "Online order saved:",
              orderData
            );

            // Send confirmation email
            try {
              await sendConfirmationEmail();

              console.log(
                "Confirmation email sent."
              );
            } catch (emailError) {
              console.log(
                "Email could not be sent:",
                emailError
              );
            }

            // Clear cart only after successful order
            localStorage.removeItem("cart");

            // Existing green popup
            showPopup(
              "✓ Order placed successfully!"
            );

            setTimeout(() => {
              navigate("/order-success");
            }, 2500);
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            showPopup(
              "Payment verification failed. Please contact support."
            );
          }
        },

        modal: {
          ondismiss: function () {
            showPopup(
              "Payment cancelled. Your cart is still saved."
            );
          }
        }
      };

      // Open Razorpay
      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment failed:",
            response.error
          );

          showPopup(
            "Payment failed. Your cart is still saved."
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Order error:",
        error
      );

      showPopup(
        "Unable to connect to server. Please make sure the backend is running."
      );
    }
  };

  return (
    <div className="checkout-page">

      {message && (
        <div className="checkout-toast">
          {message}
        </div>
      )}

      <h1>Checkout</h1>

      <div className="checkout-container">

        {/* ========================= */}
        {/* LEFT - DELIVERY ADDRESS */}
        {/* ========================= */}

        <div className="address-box">

          <div className="checkout-title">
            <span className="checkout-icon">
              📍
            </span>

            <div>
              <h2>Delivery Address</h2>

              <p>
                Enter your delivery details
              </p>
            </div>
          </div>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={details.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={details.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={details.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>

            <textarea
              name="address"
              placeholder="House / Street / Area"
              value={details.address}
              onChange={handleChange}
            />
          </div>

          <div className="two-column-fields">

            <div className="form-group">
              <label>City</label>

              <input
                type="text"
                name="city"
                placeholder="City"
                value={details.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>State</label>

              <input
                type="text"
                name="state"
                placeholder="State"
                value={details.state}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="form-group">
            <label>Pincode</label>

            <input
              type="text"
              name="pincode"
              placeholder="6-digit pincode"
              value={details.pincode}
              onChange={handleChange}
            />
          </div>

        </div>


        {/* ========================= */}
        {/* RIGHT SIDE */}
        {/* ========================= */}

        <div className="checkout-right">

          {/* PAYMENT METHOD */}

          <div className="checkout-section">

            <div className="checkout-title">

              <span className="checkout-icon">
                💳
              </span>

              <div>
                <h2>Payment Method</h2>

                <p>
                  Choose your preferred payment
                </p>
              </div>

            </div>


            <label
              className={`payment-option ${
                details.payment ===
                "Cash on Delivery"
                  ? "selected"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={
                  details.payment ===
                  "Cash on Delivery"
                }
                onChange={handleChange}
              />

              <div className="option-content">

                <strong>
                  Cash on Delivery
                </strong>

                <span>
                  Pay when your order arrives
                </span>

              </div>

            </label>


            <label
              className={`payment-option ${
                details.payment === "UPI"
                  ? "selected"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={
                  details.payment === "UPI"
                }
                onChange={handleChange}
              />

              <div className="option-content">

                <strong>
                  UPI
                </strong>

                <span>
                  Pay securely using UPI
                </span>

              </div>

            </label>


            <label
              className={`payment-option ${
                details.payment ===
                "Credit / Debit Card"
                  ? "selected"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="payment"
                value="Credit / Debit Card"
                checked={
                  details.payment ===
                  "Credit / Debit Card"
                }
                onChange={handleChange}
              />

              <div className="option-content">

                <strong>
                  Credit / Debit Card
                </strong>

                <span>
                  Secure payment through Razorpay
                </span>

              </div>

            </label>

          </div>


          {/* DELIVERY OPTION */}

          <div className="checkout-section">

            <div className="checkout-title">

              <span className="checkout-icon">
                🚚
              </span>

              <div>
                <h2>Delivery Option</h2>

                <p>
                  Select your preferred delivery speed
                </p>
              </div>

            </div>


            <label
              className={`delivery-option ${
                details.delivery ===
                "Standard Delivery"
                  ? "selected"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="delivery"
                value="Standard Delivery"
                checked={
                  details.delivery ===
                  "Standard Delivery"
                }
                onChange={handleChange}
              />

              <div className="option-content">

                <strong>
                  Standard Delivery
                </strong>

                <span>
                  Reliable delivery
                </span>

              </div>

              <b className="free-price">
                FREE
              </b>

            </label>


            <label
              className={`delivery-option ${
                details.delivery ===
                "Express Delivery"
                  ? "selected"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="delivery"
                value="Express Delivery"
                checked={
                  details.delivery ===
                  "Express Delivery"
                }
                onChange={handleChange}
              />

              <div className="option-content">

                <strong>
                  Express Delivery
                </strong>

                <span>
                  Faster delivery
                </span>

              </div>

              <b>
                ₹50
              </b>

            </label>

          </div>


          {/* ORDER SUMMARY */}

          <div className="checkout-section summary-box">

            <div className="checkout-title">

              <span className="checkout-icon">
                🧾
              </span>

              <div>
                <h2>Order Summary</h2>

                <p>
                  Review your order before placing it
                </p>
              </div>

            </div>


            <div className="summary-row">

              <span>
                Products
              </span>

              <span>
                ₹{productSubtotal}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span>
                {deliveryCharge === 0
                  ? "Free"
                  : `₹${deliveryCharge}`}
              </span>

            </div>


            <div className="summary-total">

              <strong>
                Total Amount
              </strong>

              <strong>
                ₹{finalTotal}
              </strong>

            </div>


            <button
              className="place-btn"
              onClick={placeOrder}
            >
              Place Order
            </button>

            <p className="secure-note">
              🔒 Your payment and personal information
              are securely protected.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;