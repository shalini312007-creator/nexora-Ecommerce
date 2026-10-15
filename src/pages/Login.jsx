import "./login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../api/productApi"; // adjust path to where productApi.js lives

function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type = "success") => {
    sessionStorage.setItem(
      "nexoraToast",
      JSON.stringify({ message, type })
    );

    window.dispatchEvent(new Event("nexora-toast"));
  };

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value
    });
  };

  const loginUser = async () => {
    if (isLoading) return;

    if (!login.email.trim() || !login.password) {
      showToast("Please enter your email and password.", "error");
      return;
    }

    setIsLoading(true);

    // Stop waiting if the backend does not respond in 15 seconds.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: login.email.trim(),
            password: login.password
          }),
          signal: controller.signal
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message || "Login failed. Please try again.",
          "error"
        );
        return;
      }

      if (!data.token || !data.user) {
        showToast("Invalid response from the server.", "error");
        return;
      }

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.setItem("authToken", data.token);

      // Preserve the success message across navigation/reload.
      sessionStorage.setItem(
        "nexoraToast",
        JSON.stringify({
          message: "Login successful!",
          type: "success"
        })
      );

      navigate("/profile");

      // Keep your existing Navbar refresh behavior.
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } catch (error) {
      console.error("Login error:", error);

      if (error.name === "AbortError") {
        showToast(
          "The server is taking too long to respond. Please check your backend and MongoDB connection.",
          "error"
        );
      } else {
        showToast(
          "Cannot connect to the server. Check that your backend is running.",
          "error"
        );
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={login.email}
        onChange={handleChange}
        disabled={isLoading}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={login.password}
        onChange={handleChange}
        disabled={isLoading}
      />

      <button
        type="button"
        onClick={loginUser}
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      <p style={{ marginTop: "20px" }}>
        Don't have an account?
        <Link to="/register"> Register</Link>
      </p>
    </div>
  );
}

export default Login;