import { useState } from "react";
import "./HomeEssentials.css";

function HomeEssentials() {
  const [message, setMessage] = useState("");
  const products = [
    { name:"Cleaning Spray", price:"₹199", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTJeO3qkbgAB0yYc4EzscEq-6w1PPUZoy3cNvTe0on0U7GpIY5766I7gdb&s=10" },
    { name:"Detergent", price:"₹249", image:"https://images.mamaearth.in/catalog/product/1/_/1_8tchd77b6aamgryq.jpg?format=auto&height=600" },
    { name:"Storage Box", price:"₹499", image:"https://primepick.co.in/cdn/shop/files/423.jpg?v=1765435557" },
    { name:"Kitchen Organizer", price:"₹799", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMhQSx07JO-CuTZzc9h-CgGqfSRPda7n-epLd6jfMo0LSiUxIzFm4nrLQ1&s=10" },
    {
      name: "Air Freshener",
      price: "₹249",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD5GR8cUeH1DQkaC4L3LC8LQwkef2MesfqAJR26aDlFaLIYi2EBggN5eQ&s=10"
    },
    {
      name: "Storage Basket",
      price: "₹399",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN_pG4F7hHVjPjScMYp8ARUNaKKtTqVmwAjcBB66lt1w&s=10"
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
    <div className="home-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  

      <div className="home-banner">
        <h1>Home Essentials</h1>
        <p>Everything Your Home Needs</p>
      </div>

      <div className="home-grid">

        {products.map((item,index)=>(
          <div className="home-card" key={index}>
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

export default HomeEssentials;