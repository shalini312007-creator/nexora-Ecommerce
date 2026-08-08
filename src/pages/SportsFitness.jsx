import { useState } from "react";
import "./SportsFitness.css";

function SportsFitness() {
  const [message, setMessage] = useState("");
  const products = [
    { name:"Dumbbells", price:"₹1,999", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOE5e_RONVicM6nAZoFgIPyUEPIpzR50dloWitbWqJ-g&s=10" },
    { name:"Yoga Mat", price:"₹799", image:"https://static.vecteezy.com/system/resources/thumbnails/028/753/657/small/yoga-mats-and-equipment-in-airy-fitness-studio-background-with-empty-space-for-text-photo.jpg" },
    { name:"Treadmill", price:"₹24,999", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpLvT92-ebd1nCQVMYw2kzF5zGEwFN47SvjqzTzgJ4-bRFH8GvZmT2xl4&s=10" },
    { name:"Football", price:"₹599", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6kw1jJiERRC0Pt3ovryK0bzr0GV394d-ya-x5tuVbMw&s=10" }
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
    <div className="sports-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  

      <div className="sports-banner">
        <h1>Sports & Fitness</h1>
      </div>

      <div className="sports-grid">

        {products.map((item,index)=>(
          <div className="sports-card" key={index}>
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

export default SportsFitness;