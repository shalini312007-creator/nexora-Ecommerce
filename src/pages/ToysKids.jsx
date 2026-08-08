import { useState } from "react";
import "./ToysKids.css";

function ToysKids() {
  const [message, setMessage] = useState("");
  const toys = [
    { name:"Teddy Bear", price:"₹799", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsXgRLxKTyvZITWWiSQlawIUb5QE26BPIxBrw9fMQ9fSE29qJVjZiTNRQ&s=10"},
    { name:"Toy Car", price:"₹499", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGdOuLvl4RzUbbhqbBqEgiFEWqQiEciRtpYKz-wHbl7A&s=10" },
    { name:"Building Blocks", price:"₹999", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgOWwHG1ArRkyt6xJ6YCtaCxRDsK-GANayFLVIvqK2iQ&s=10" },
    { name:"Doll Set", price:"₹899", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXuo4X4ld-2QtH33mX8x_uDcjlMGV2fZq54EjGBXtwnyoYtxkzJ75Fmday&s=10" }
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
    <div className="toys-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  
      <div className="toys-banner">
        <h1>Toys & Kids</h1>
      </div>

      <div className="toys-grid">
        {toys.map((item,index)=>(
          <div className="toys-card" key={index}>
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

export default ToysKids;