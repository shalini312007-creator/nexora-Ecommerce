import { useState } from "react";
import "./SkincareBeauty.css";

function SkincareBeauty() {
  const [message, setMessage] = useState("");
  const products = [
    {
      name: "Face Wash",
      price: "₹299",
      image: "https://www.dotandkey.com/cdn/shop/files/Artboard1-175ml_a9d72220-eec0-444b-b1b9-b71cee19dec6.jpg?v=1754919216"
    },
    {
      name: "Moisturizer",
      price: "₹499",
      image: "https://images.healthshots.com/healthshots/en/uploads/2024/04/02162458/best-moisturisers-for-dry-skin-2.jpg"
    },
    {
      name: "Sunscreen",
      price: "₹399",
      image: "https://www.drsheths.com/cdn/shop/files/1_-_Website.jpg?v=1747720115"
    },
    {
      name: "Lipstick",
      price: "₹599",
      image: "https://www.debellecosmetix.com/cdn/shop/files/DeBelle_Long_Lasting_Pink_Lipstick_Vivid_Valerie_800x.jpg?v=1755280268"
    },
    {
      name: "Foundation",
      price: "₹799",
      image: "https://media6.ppl-media.com/tr:h-750,w-750,c-at_max,dpr-2,q-40/static/img/product/344735/ny-bae-3-in-1-primer-foundation-serum-warm-vanilla-01-30-ml-15_1_display_1755183220_196ceb06.jpg"
    },
    {
      name: "Compact Powder",
      price: "₹499",
      image: "https://images-static.nykaa.com/media/catalog/product/0/0/0060d708901030654886-new_6.jpg?tr=w-500"
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
    <div className="beauty-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  

      <div className="beauty-banner">
        <h1>Skincare & Beauty</h1>
        <p>Discover premium beauty and skincare products</p>
      </div>

      <div className="beauty-products">

        {products.map((item, index) => (
          <div className="beauty-card" key={index}>

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

export default SkincareBeauty;