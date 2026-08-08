import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const logout = () => {

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");

    alert("Logged out successfully!");

    navigate("/");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (

    <div className="profile-page">

      <h1>My Account</h1>

      <h2>Welcome, {user?.name}</h2>

      <p><strong>Email:</strong> {user?.email}</p>

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