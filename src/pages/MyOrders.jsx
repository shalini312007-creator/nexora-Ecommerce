import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/productApi"; // adjust path to where productApi.js lives
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        const currentUser = JSON.parse(
          localStorage.getItem("currentUser") || "null"
        );
        const token = localStorage.getItem("authToken");

        if (!currentUser?.id || !token) {
          setError("Please login to view your orders.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error(
              "Your login session has expired. Please log in again."
            );
          }

          throw new Error("Failed to load orders.");
        }

        const data = await response.json();

        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        console.error("Orders error:", err);

        if (!cancelled) {
          setError(
            err.message || "Unable to load your orders."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatOrderDate = (date) => {
    if (!date) return "Date unavailable";

    const orderDate = new Date(date);

    if (Number.isNaN(orderDate.getTime())) {
      return "Date unavailable";
    }

    return orderDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getPrice = (price) => {
    if (typeof price === "number") return price;

    if (typeof price === "string") {
      return parseFloat(price.replace(/[^\d.]/g, "")) || 0;
    }

    return 0;
  };

  if (loading) {
    return (
      <div className="my-orders-page">
        <h1>My Orders</h1>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <h1>My Orders</h1>

      {error && (
        <p className="orders-error" role="alert">
          {error}
        </p>
      )}

      {!error && orders.length === 0 && (
        <div className="no-orders">
          <h2>No Orders Yet</h2>
          <p>Your placed orders will appear here.</p>
        </div>
      )}

      <div className="orders-container">
        {orders.map((order) => {
          const totalItems =
            order.items?.reduce(
              (total, item) =>
                total + (Number(item.quantity) || 0),
              0
            ) || 0;

          const deliveryCharge =
            order.delivery === "Express Delivery" ? 50 : 0;

          const productTotal =
            Number(order.totalAmount || 0) - deliveryCharge;

          return (
            <div className="order-card" key={order._id}>
              {/* Order header */}
              <div className="order-header">
                <div>
                  <h2>Order</h2>

                  <p>Order ID: {order._id}</p>

                  <p>
                    Order Date: {formatOrderDate(order.createdAt)}
                  </p>
                </div>

                <span className="order-status">
                  {order.status || "Placed"}
                </span>
              </div>

              {/* Order items */}
              <div className="order-items">
                {order.items?.map((item, index) => {
                  const itemPrice = getPrice(item.price);
                  const quantity = Number(item.quantity) || 0;

                  return (
                    <div
                      className="order-item"
                      key={item.productId || item._id || index}
                    >
                      <img
                        src={item.image}
                        alt={item.name || "Product"}
                      />

                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p>Price: ₹{itemPrice}</p>
                        <p>Quantity: {quantity}</p>
                      </div>

                      <strong>₹{itemPrice * quantity}</strong>
                    </div>
                  );
                })}
              </div>

              {/* Item count */}
              <div className="delivery-option">
                <h3>Order Items</h3>
                <p>
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>

              {/* Delivery address */}
              <div className="delivery-address">
                <h3>Delivery Address</h3>

                {order.deliveryAddress ? (
                  <>
                    <p>
                      <strong>{order.deliveryAddress.name}</strong>
                    </p>

                    <p>{order.deliveryAddress.address}</p>

                    <p>
                      {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.state} -{" "}
                      {order.deliveryAddress.pincode}
                    </p>

                    <p>
                      Phone: {order.deliveryAddress.phone}
                    </p>
                  </>
                ) : (
                  <p>Delivery address unavailable.</p>
                )}
              </div>

              {/* Delivery option */}
              <div className="delivery-option">
                <h3>Delivery Option</h3>
                <p>{order.delivery || "Standard Delivery"}</p>
              </div>

              {/* Payment method */}
              {order.paymentMethod && (
                <div className="delivery-option">
                  <h3>Payment Method</h3>
                  <p>{order.paymentMethod}</p>
                </div>
              )}

              {/* Order summary */}
              <div className="order-summary">
                <h3>Order Summary</h3>

                <div className="summary-row">
                  <span>Products</span>
                  <span>₹{productTotal}</span>
                </div>

                <div className="summary-row">
                  <span>Delivery</span>
                  <span>
                    {deliveryCharge > 0
                      ? `₹${deliveryCharge}`
                      : "Free"}
                  </span>
                </div>

                <div className="summary-total">
                  <strong>Total</strong>
                  <strong>₹{Number(order.totalAmount || 0)}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;