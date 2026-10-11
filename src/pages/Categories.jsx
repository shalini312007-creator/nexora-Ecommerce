import { Link } from "react-router-dom";
import "./categories.css";

function Categories() {

  const departments = [
    {
      title: "Electronics",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaDUAljfXhyDi2MueGNRBUOI5YKJ2A47nFWzd7wgoxeFLbEHtFZ4rZUGO0&s=10",
      desc: "Smartphones, Laptops, Headphones & Accessories",
      link: "/electronics"
    },
    {
      title: "Mobiles & Gadgets",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgkDA529fHLOgtXlGg7oWTbCaV-NSd3_si4dlazRVuag&s=10",
      desc: "Latest Mobile Phones and Smart Devices",
      link: "/mobiles-gadgets"
    },
    {
      title: "Furniture",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfPOWYyI0qtfF0W9yMDIhacS29C2dIShZHw6ztC8ldJA&s=10",
      desc: "Modern Furniture for Home & Office",
      link: "/furniture"
    },
    {
      title: "Kitchen Essentials",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHSeCygpgL27jAn3VaGJNNfSTx0zsF6BkIQMCquEFp3Q&s=10",
      desc: "Cookware, Appliances and Storage",
      link: "/kitchen-essentials"
    },
    {
      title: "Sports & Fitness",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9NotOltEFHnFDFLMRJk7JeVWl-ACA5ufnT3Msp_D_5Q&s=10",
      desc: "Gym Equipment and Fitness Accessories",
      link: "/sports-fitness"
    },
    {
      title: "Books & Education",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_PLJz4hAH3gWB-1xJlEGsEDZ8Jz8MjCZbHH2DioEcNA&s=10",
      desc: "Academic, Fiction and Professional Books",
      link: "/books-education"
    },
    {
      title: "Toys & Kids",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMCJ60Fdr7H-qnzThnQUQ19vpnlxoArMz5E5rVJyDxWzzMq6Sj8Kh5DL4&s=10",
      desc: "Fun Toys and Learning Products",
      link: "/toys-kids"
    },
    {
      title: "Pet Supplies",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH3Q5xuPryptW8t_l4EwNSvnfNyWnQnIHSn6c6998rng&s=10",
      desc: "Food, Toys and Accessories for Pets",
      link: "/pet-supplies"
    },
    {
      title: "Dairy Products",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b",
      desc: "Fresh Milk, Paneer, Cheese, Curd & Butter",
      link: "/dairy"
    }
  ];

  return (
    <div className="categories-page">

      <div className="category-header">
        <h1>Explore Departments</h1>
        <p>
          Browse products across multiple shopping departments
        </p>
      </div>

      <div className="department-grid">

        {departments.map((item, index) => (
          <div className="department-card" key={index}>

            <img
              src={item.image}
              alt={item.title}
            />

            <div className="department-content">

              <h3>{item.title}</h3>

              <p>{item.desc}</p>

              <Link to={item.link}>
                <button className="view-btn">
                  View Collection
                </button>
              </Link>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Categories;