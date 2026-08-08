import { useState } from "react";
import "./Furniture.css";

function Furniture() {
  const [message, setMessage] = useState("");
  const products = [
    {
      name: "Sofa Set",
      price: "₹24,999",
      image: "https://www.estre.in/cdn/shop/files/2-min_d2bc49bf-1893-4118-bab5-8d0848d4d3fb.jpg?v=1743762905"
    },
    {
      name: "Dining Table",
      price: "₹15,999",
      image: "https://rukminim2.flixcart.com/image/480/480/xif0q/dining-set/i/w/i/144-78-cream-72-39-0-rosewood-sheesham-20-rectangle-43-18-99-06-original-imahbh4jq3bywf4a.jpeg?q=90"
    },
    {
      name: "Wooden Chair",
      price: "₹3,999",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlo24vHdcWC0mpl2LEaSU5d6gL4p1D8NV7atmjTQs0_933hxRtSVUVI7Q&s=10"
    },
    {
      name: "Bed Frame",
      price: "₹18,999",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRicLmOaWG4CzXHq5aSxz7CBXdkY4Mt3HS94V7BkgTntQ&s=10"
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
    <div className="furniture-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  

      <div className="furniture-banner">
        <h1>Furniture</h1>
        <p>Modern Furniture for Every Home</p>
      </div>

      <div className="furniture-grid">

        {products.map((item,index)=>(
          <div className="furniture-card" key={index}>

            <img src={item.image} alt={item.name} />

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

export default Furniture;