import { useState } from "react";
import "./PetSupplies.css";

function PetSupplies() {
  const [message, setMessage] = useState("");
  const pets = [
    { name:"Dog Food", price:"₹899", image:"https://img.magnific.com/free-photo/healthy-fresh-pet-food-ingredients-dark-surface_1150-42077.jpg" },
    { name:"Pet Toy", price:"₹299", image:"https://static.vecteezy.com/system/resources/thumbnails/040/873/620/small/ai-generated-joyful-dog-playing-with-toys-in-a-cozy-living-room-setting-creating-a-warm-and-inviting-atmosphere-photo.jpeg" },
    { name:"Cat Food", price:"₹699", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFfCzqenNvh3kwxAR--DnvDTj1tcaUPlQ0omW3i411UQ&s=10" },
    { name:"Pet Bed", price:"₹1,499", image:"https://m.media-amazon.com/images/I/81H7u8LhG7L._AC_UF1000,1000_QL80_.jpg" }
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
    <div className="pets-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  

      <div className="pets-banner">
        <h1>Pet Supplies</h1>
      </div>

      <div className="pets-grid">

        {pets.map((item,index)=>(
          <div className="pets-card" key={index}>
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

export default PetSupplies;