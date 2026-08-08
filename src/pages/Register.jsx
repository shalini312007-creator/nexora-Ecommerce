import "./Register.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const registerUser = () => {

    if (
      !user.name ||
      !user.email ||
      !user.password
    ) {
      alert("Please fill all fields.");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    alert("Registration Successful!");

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
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={user.password}
        onChange={handleChange}
      />

      <button onClick={registerUser}>
        Register
      </button>

      <p style={{marginTop:"20px"}}>
        Already have an account?
        <Link to="/login"> Login</Link>
      </p>

    </div>

  );
}

export default Register;