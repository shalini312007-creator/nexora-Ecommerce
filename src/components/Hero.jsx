import { useNavigate } from "react-router-dom";
import "./Hero.css";

function Hero() {

  const navigate = useNavigate();

  return (
    <section className="hero">

      <div className="hero-content">

        <h1>
          Everything You NEED
        </h1>

        <p>
          Shop Fashion, Beauty,
          Groceries, and Daily Essentials
        </p>

        <button
          className="shop-btn"
          onClick={() => navigate("/categories")}
        >
          Shop Now
        </button>

      </div>

    </section>
  );
}

export default Hero;