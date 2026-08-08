import "./home.css";

import Hero from "../components/Hero";
import CategoryCards from "../components/Categorycards";
import SpecialOffers from "../components/Specialoffers";
import WhyChooseUs from "../components/Whychooseus";

function Home() {
  return (
    <div className="home">

      <Hero />

      <CategoryCards />

      <SpecialOffers />

      <WhyChooseUs />

    </div>
  );
}

export default Home;