import { useState } from "react";
import "./Electronics.css";

function Electronics() {
  const [message, setMessage] = useState("");
  const products = [
    {
      name: "Laptop",
      price: "₹55,999",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2QgzOcNrJS09f_xO1b5wEc94uC4jFXSUi9NwF3mGGWg&s=10"
    },
    {
      name: "Smart TV",
      price: "₹39,999",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi9CHcaouZgh58u5Yr_9I95A6vDQ5aTxZ-oCBISP8B_A&s=10"
    },
    {
      name: "Bluetooth Speaker",
      price: "₹2,499",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvD9jlvU3rGhus-hZAOyjflbV3Q-_wafAZ4332BCYyug&s=10"
    },
    {
      name: "Smart Watch",
      price: "₹4,999",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3QPxUQE1rJEucfaixl_fkE1K03M8-IzXNfPkE6pgtRw&s"
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
    <div className="electronics-page">
  
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  
      <div className="electronics-banner">
        <h1>Electronics</h1>
        <p>Latest Electronic Devices & Accessories</p>
      </div>

      <div className="electronics-grid">

        {products.map((item,index)=>(
          <div className="electronics-card" key={index}>

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

export default Electronics