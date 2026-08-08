import { Link } from "react-router-dom";
import "./Specialoffers.css";

function SpecialOffers() {

  const offers = [
    {
      title: "Mega Electronics Sale",
      discount: "Up to 60% OFF",
      desc: "Laptops, Smart TVs & Accessories",
      emoji: "💻",
      link: "/electronics"
    },
    {
      title: "Fashion Fiesta",
      discount: "Flat 50% OFF",
      desc: "Latest Fashion Collection",
      emoji: "👗",
      link: "/fashion-dresses"
    },
    {
      title: "Beauty Bonanza",
      discount: "Buy 2 Get 1 Free",
      desc: "Skincare & Makeup Products",
      emoji: "💄",
      link: "/skincare-beauty"
    },
    {
      title: "Fresh Grocery Deals",
      discount: "Starting at ₹49",
      desc: "Fresh Fruits & Vegetables",
      emoji: "🥦",
      link: "/fresh-fruits"
    }
  ];

  return (
    <section className="offers">

      <h2>🔥 Today's Best Deals</h2>

      <div className="offers-grid">

        {offers.map((offer, index) => (

          <Link
            key={index}
            to={offer.link}
            className="offer-link"
          >

            <div className="offer-card">

              <div className="offer-icon">
                {offer.emoji}
              </div>

              <h3>{offer.title}</h3>

              <h1>{offer.discount}</h1>

              <p>{offer.desc}</p>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
}

export default SpecialOffers;