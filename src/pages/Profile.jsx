
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  } catch {
    return null;
  }
}

function Profile() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const logout = () => {
    // Clear the current login session.
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");

    // Notify components such as Navbar that authentication changed.
    window.dispatchEvent(new Event("auth-changed"));

    // Notify components that cart and wishlist counts should refresh.
    window.dispatchEvent(new Event("cart-wishlist-updated"));

    // Save the logout success message for the existing toast system.
    sessionStorage.setItem(
      "nexoraToast",
      JSON.stringify({
        message: "Logged out successfully!",
        type: "success"
      })
    );

    // Return to the homepage without reloading the entire website.
    navigate("/", { replace: true });
  };

  return (
    <div className="profile-page">
      <h1>My Account</h1>

      <h2>Welcome, {user?.name || "User"}</h2>

      <p>
        <strong>Email:</strong>{" "}
        {user?.email || ""}
      </p>

      <button
        className="orders-btn"
        onClick={() => navigate("/my-orders")}
      >
        My Orders
      </button>

      <button
        className="logout-btn"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
