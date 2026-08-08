import { useState } from "react";
import "./MobilesGadgets.css";

function MobilesGadgets() {
  const [message, setMessage] = useState("");
  const products = [
    {
      name: "iPhone 16",
      price: "₹79,999",
      image: "https://www.imagineonline.store/cdn/shop/files/iPhone_16_White_PDP_Image_Position_1__en-IN_059f5925-d6d3-4695-8e84-bc550ef50e5b.jpg?v=1759209804"
    },
    {
      name: "Samsung Galaxy",
      price: "₹59,999",
      image: "https://www.myg.in/images/detailed/130/Samsung-Galaxy-A37-5G-Awesome-Lavender-12GB-256GB-Front-Back-View_uumv-ow.webp"
    },
    {
      name: "Wireless Earbuds",
      price: "₹2,999",
      image: "https://hips.hearstapps.com/hmg-prod/images/wireless-earbuds-001-6792869accae0.jpg?crop=0.587xw:0.782xh;0.199xw,0.179xh&resize=640:*"
    },
    {
      name: "Power Bank",
      price: "₹1,499",
      image: "https://vlebazaar.in/image/cache/catalog/Xiaomi-Pocket-Power-Bank-10000mAh-225W-with-Built-in-Cable-Super-Fast-Ch/Xiaomi-Pocket-Power-Bank-10000mAh-225W-with-Built-in-Cable-Super-Fast-Charging-P-1000x1000h.jpg"
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
    <div className="mobile-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  

      <div className="mobile-banner">
        <h1>Mobiles & Gadgets</h1>
        <p>Latest Smartphones and Accessories</p>
      </div>

      <div className="mobile-grid">

        {products.map((item,index)=>(
          <div className="mobile-card" key={index}>

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

export default MobilesGadgets;