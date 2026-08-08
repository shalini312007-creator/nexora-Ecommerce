import "./Productcard.css";

function ProductCard() {
  return (
    <section className="products">

      <h2>Featured Products</h2>

      <div className="product-grid">

        <div className="product-card">
          <img
            src="https://via.placeholder.com/200"
            alt="product"
          />

          <h3>Face Wash</h3>

          <p>₹299</p>

          <p>⭐4.5</p>

          <button>Add To Cart</button>
        </div>

      </div>

    </section>
  );
}

export default ProductCard;