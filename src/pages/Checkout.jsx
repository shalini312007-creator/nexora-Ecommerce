import { useState } from "react";
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
    payment: "Cash on Delivery"
  });

  const handleChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value
    });
  };

  const placeOrder = () => {

    if (
      !details.name ||
      !details.email ||
      !details.phone ||
      !details.address ||
      !details.city ||
      !details.state ||
      !details.pincode
    ) {
      alert("Please fill all the details.");
      return;
    }

    emailjs.send(
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
    )
    .then((result) => {

      console.log("SUCCESS!", result.text);

      localStorage.removeItem("cart");

      alert("Order placed successfully!");

      navigate("/order-success");

    })
    .catch((error) => {

      console.log("Status:", error.status);
      console.log("Text:", error.text);
      console.log(error);

      alert("Failed to send confirmation email.");

    });

  };

  return (

    <div className="checkout-page">

      <h1>Checkout</h1>

      <div className="checkout-container">

        <div className="address-box">

          <h2>Delivery Address</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={details.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={details.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={details.phone}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Address"
            value={details.address}
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={details.city}
            onChange={handleChange}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={details.state}
            onChange={handleChange}
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={details.pincode}
            onChange={handleChange}
          />

        </div>

        <div className="payment-box">

          <h2>Payment Method</h2>

          <label>
            <input
              type="radio"
              name="payment"
              value="Cash on Delivery"
              checked={details.payment === "Cash on Delivery"}
              onChange={handleChange}
            />
            Cash on Delivery
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              value="UPI"
              checked={details.payment === "UPI"}
              onChange={handleChange}
            />
            UPI
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              value="Credit / Debit Card"
              checked={details.payment === "Credit / Debit Card"}
              onChange={handleChange}
            />
            Credit / Debit Card
          </label>

          <button
            className="place-btn"
            onClick={placeOrder}
          >
            Place Order
          </button>

        </div>

      </div>

    </div>

  );
}

export default Checkout;