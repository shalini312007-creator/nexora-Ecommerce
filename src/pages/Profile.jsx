import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");

    // Save logout message
    sessionStorage.setItem(
      "nexoraToast",
      JSON.stringify({
        message: "Logged out successfully!",
        type: "success"
      })
    );

    // Go to home
    navigate("/");

    // Refresh so Navbar updates
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="profile-page">

      <h1>My Account</h1>

      <h2>
        Welcome, {user?.name}
      </h2>

      <p>
        <strong>Email:</strong>{" "}
        {user?.email}
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