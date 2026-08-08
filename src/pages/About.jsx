import "./about.css";

function About() {
  return (
    <div className="about-page">

      <div className="about-banner">
        <h1>About Nexora</h1>
        <p>
          Your One-Stop Destination for Fashion, Beauty,
          Groceries, and Daily Essentials
        </p>
      </div>

      <section className="about-section">
        <div className="about-content">
          <h2>Who We Are</h2>

          <p>
            Nexora is a modern e-commerce platform designed
            to provide customers with a seamless shopping
            experience. From skincare and fashion to fresh
            groceries and home essentials, we bring everything
            together in one convenient place.
          </p>
        </div>

        <img
          src="https://thumbs.dreamstime.com/b/lawyer-stood-handshake-client-to-congratulate-confirm-agreement-law-firm-262012023.jpg"
          alt="Shopping"
        />
      </section>

      <section className="mission-section">

        <div className="mission-card">
          <h3>🚚 Fast Delivery</h3>
          <p>
            Quick and reliable delivery services to your doorstep.
          </p>
        </div>

        <div className="mission-card">
          <h3>⭐ Quality Products</h3>
          <p>
            Carefully selected products from trusted brands.
          </p>
        </div>

        <div className="mission-card">
          <h3>🔒 Secure Shopping</h3>
          <p>
            Safe transactions and protected customer data.
          </p>
        </div>

        <div className="mission-card">
          <h3>↩ Easy Returns</h3>
          <p>
            Hassle-free return and refund policies.
          </p>
        </div>

      </section>

      <section className="vision-section">

        <h2>Our Vision</h2>

        <p>
          To become the most trusted online marketplace by
          delivering quality products, exceptional customer
          service, and a smooth shopping experience for everyone.
        </p>

      </section>

    </div>
  );
}

export default About;