import { useState } from "react";
import "./SnacksBeverages.css";

function SnacksBeverages() {
  const [message, setMessage] = useState("");
  const items = [
    { name:"Cookies", price:"₹99", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAnxK7DKDjAjFmJR3M6NyH5CNhZkQipHKfqT9fJa-rHRzOYQfPxRMP52Ft&s=10" },
    { name:"Potato Chips", price:"₹50", image:"https://m.media-amazon.com/images/I/514xVUdk6ML._AC_UF894,1000_QL80_.jpg" },
    { name:"Cold Drink", price:"₹40", image:"https://static.wixstatic.com/media/8f1abd_80bf432a005041b59c2a7fa1960ce71e~mv2.jpeg/v1/fill/w_744,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/8f1abd_80bf432a005041b59c2a7fa1960ce71e~mv2.jpeg" },
    { name:"Fruit Juice", price:"₹120", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTuDDatcm9EunRWTU2xS9CN0IJIokHfpndLYGYnEOG7Q&s=10" },
    {
      name: "Popcorn",
      price: "₹70",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOrLeId_gBREzZIkNesj-gPIMeQKMcH4LR2QrTnJlqUg&s=10"
    },
    {
      name: "Green Tea",
      price: "₹199",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRFg-0PN3MjuLD8p4RJK5GiCszI9GjCb7Y91L_uCubCC7dNSmxGOmb-aLH&s=10"
    }
  ];
  const addToCart = (product) => {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    const existing = cart.find(
      item => item.name === product.name
    );
  
    if(existing){
      existing.quantity += 1;
    }else{
      cart.push({
        ...product,
        quantity:1
      });
    }
  
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
    setMessage(product.name + " added to cart!");

setTimeout(() => {
  setMessage("");
}, 2000);
  };
  return (
    <div className="snacks-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  

      <div className="snacks-banner">
        <h1>Snacks & Beverages</h1>
        <p>Delicious Snacks and Refreshing Drinks</p>
      </div>

      <div className="snacks-grid">

        {items.map((item,index)=>(
          <div className="snack-card" key={index}>
            <img src={item.image} alt={item.name}/>
            <h3>{item.name}</h3>
            <p>{item.price}</p>
            <button onClick={() => addToCart(item)}>
  Add to Cart
</button>
          </div>
        ))}

      </div>

    </div>
  );
}

export default SnacksBeverages;