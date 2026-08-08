import "./login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value
    });
  };

  const loginUser = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("No account found. Please register first.");
      return;
    }

    if (
      user.email === login.email &&
      user.password === login.password
    ) {

      // Save login details
      localStorage.setItem("loggedIn", "true");

      localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
      );

      alert("Login Successful!");

      // Go to profile
      navigate("/profile");

      // Refresh so Navbar updates
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } else {

      alert("Invalid Email or Password");

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
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={login.password}
        onChange={handleChange}
      />

      <button onClick={loginUser}>
        Login
      </button>

      <p style={{ marginTop: "20px" }}>
        Don't have an account?
        <Link to="/register"> Register</Link>
      </p>

    </div>

  );
}

export default Login;