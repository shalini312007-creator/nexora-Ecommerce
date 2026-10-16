import "./Register.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../api/productApi";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

    setErrorMessage("");
  };

  const registerUser = async () => {
    if (!user.name.trim() || !user.email.trim() || !user.password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          name: user.name.trim(),
          email: user.email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message || "Registration failed. Please try again."
        );
        return;
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);

      setErrorMessage(
        "Unable to connect to the server. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const continueToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-page">
      <h1>Create Account</h1>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={user.name}
        onChange={handleChange}
        autoComplete="name"
        disabled={loading}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleChange}
        autoComplete="email"
        disabled={loading}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={user.password}
        onChange={handleChange}
        autoComplete="new-password"
        disabled={loading}
      />

      {errorMessage && (
        <p
          role="alert"
          style={{
            color: "#dc2626",
            margin: "10px 0",
            fontSize: "14px",
          }}
        >
          {errorMessage}
        </p>
      )}

      <button onClick={registerUser} disabled={loading}>
        {loading ? "Creating Account..." : "Register"}
      </button>

      <p style={{ marginTop: "20px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>

      {showSuccess && (
        <div
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSuccess(false);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 9999,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-success-title"
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "35px 28px",
              width: "100%",
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "#dcfce7",
                color: "#16a34a",
                fontSize: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              ✓
            </div>

            <h2
              id="register-success-title"
              style={{
                color: "#111827",
                margin: "0 0 12px",
                fontSize: "25px",
              }}
            >
              Registration Successful!
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "15px",
                lineHeight: 1.6,
                marginBottom: "25px",
              }}
            >
              Welcome to Nexora, {user.name.trim()}! Your account has been
              created successfully. You can now log in to your account.
            </p>

            <button
              onClick={continueToLogin}
              style={{
                width: "100%",
                padding: "13px 20px",
                border: "none",
                borderRadius: "9px",
                background: "#2563eb",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;