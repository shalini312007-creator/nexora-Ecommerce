import { useState } from "react";
import "./FashionDresses.css";

function FashionDresses() {
  const [message, setMessage] = useState("");
  const products = [
    {
      name: "Women's Casual Dress",
      price: "₹1,299",
      image: "https://m.media-amazon.com/images/I/81OFbThGbsL._AC_UY1100_.jpg"
    },
    {
      name: "Party Wear Dress",
      price: "₹1,999",
      image: "https://stylady.in/cdn/shop/files/photo_2024-08-01_18-46-09.jpg?v=1723972575"
    },
    {
      name: "Summer Collection",
      price: "₹899",
      image: "https://chidiyaa.com/cdn/shop/files/63_98f49c7b-bc23-4ce2-b4e4-698e1c1124c9.jpg?v=1776066747&width=960"
    },
    {
      name: "Designer Dresses",
      price: "₹2,499",
      image: "https://www.cdnensemble.xyz/pub/media/resized/product/644_964_21825sk71-1.jpg"
    },
    {
      name: "Floral Maxi Dress",
      price: "₹1,799",
      image: "https://assets.ajio.com/medias/sys_master/root/20250110/0prw/6781372b0431850e0d92746e/-1117Wx1400H-701040430-blue-MODEL.jpg"
    },
    {
      name: "Traditional Ethnic Gown",
      price: "₹2,299",
      image: "https://ekantastudio.com/cdn/shop/files/DSC02488_9b3164a8-8a21-4106-a716-89f1cc1038a9.jpg?v=1755498929"
    },
  
    
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
    <div className="fashion-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  

      <div className="fashion-banner">
        <h1>Fashion & Dresses</h1>
        <p>
          Discover the latest trends and styles
        </p>
      </div>

      <div className="fashion-products">

        {products.map((item, index) => (
          <div className="fashion-card" key={index}>

            <img
              src={item.image}
              alt={item.name}
            />

            <h3>{item.name}</h3>

            <p className="price">
              {item.price}
            </p>

            <button onClick={() => addToCart(item)}>
  Add to Cart
</button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default FashionDresses;