import { Link } from "react-router-dom";
import "./Categorycards.css";

function CategoryCards() {

  const categories = [
    {
      name:"Skincare & Beauty",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMOnKA3ZjI-tbXZjIYaxldtdjrtRCaUH_0cXYmUQ1SDlxRqXhAFJLeh2gj&s=10",
      link:"/skincare-beauty"
    },
    {
      name:"Fashion & Dresses",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW-OdMP9F2cuWVb_lgrN-LyG-LA-Hr0OIONC30Cte4xw&s=10",
      link:"/fashion-dresses"
  
    },
    {
      name:"Fresh Fruits",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwaDqIh37KGnDs6dfTOuJSZKUZHOMlR6xq6aNNGjTExA&s=10",
      link:"/fresh-fruits"
    },
    {
      name:"Fresh Vegetables",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDODovUUM_E1DgnB4FaCl34seskzWzKkcuXsT8azRlVg&s=10",
      link:"/fresh-vegetables"

    },
    {
      name:"Snacks & Beverages",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuGc43yt3Wmq1XZuGzh3vuML4WIvdLfia9GiHpO4Qc0A&s=10",
      link:"/snacks-beverages"
    },
    {
      name:"Home Essentials",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ1D9_gW5bBhvD-oPh0lbMbUm6Vwgj2mTZpivaKGaXJQ&s=10",
      link:"/home-essentials"
    }
  ];

  return (
    <section className="categories">

      <h2>Shop By Category</h2>

      <div className="category-grid">

        {categories.map((item,index)=>(

          <div className="card" key={index}>

            <img
              src={item.image}
              alt={item.name}
            />

            <h3>{item.name}</h3>

            {item.link ? (
              <Link to={item.link}>
                <button>Explore</button>
              </Link>
            ) : (
              <button>Explore</button>
            )}

          </div>

        ))}

      </div>

    </section>
  );
}

export default CategoryCards;