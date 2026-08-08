import { useState } from "react";
import "./KitchenEssentials.css";

function KitchenEssentials() {
  const [message, setMessage] = useState("");
  const products = [
    { name: "Cookware Set", price: "₹2,999", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR82yBp1KQInAhbtiJU_9SQBe8dO-69wS8JiVrEXtka-g&s=10" },
    { name: "Mixer Grinder", price: "₹3,499", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsgVo6HeVn8BIogpWpyGy73j9tciTocVyUl2cN6dSm5A&s=10" },
    { name: "Storage Containers", price: "₹799", image: "https://5.imimg.com/data5/SELLER/Default/2023/12/369689141/GB/GA/TT/125045987/plastic-airtight-container.jpg" },
    { name: "Non-Stick Pan", price: "₹999", image: "https://media.istockphoto.com/id/2252744305/photo/three-black-non-stick-frying-pans-on-a-wooden-table-showing-different-sizes-of-versatile.jpg?s=612x612&w=0&k=20&c=7cCTenNY6xq6dZAoW6YO9HoYRR4cKUWmn-dmMVuQSxU=" }
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
    <div className="kitchen-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  
      <div className="kitchen-banner">
        <h1>Kitchen Essentials</h1>
        <p>Everything Needed For Your Kitchen</p>
      </div>

      <div className="kitchen-grid">
        {products.map((item,index)=>(
          <div className="kitchen-card" key={index}>
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

export default KitchenEssentials;