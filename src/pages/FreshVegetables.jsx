import { useState } from "react";
import "./FreshVegetables.css";

function FreshVegetables() {
  const [message, setMessage] = useState("");
  const vegetables = [
    { name: "Tomatoes", price: "₹40/kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJLa2lx2BnMCWYk6Bv_hzFrYemHFURVAHtxDPkxabcwA&s=10" },
    { name: "Carrots", price: "₹60/kg", image: "https://www.trustbasket.com/cdn/shop/articles/Carrot.jpg?v=1688378789" },
    { name: "Potatoes", price: "₹35/kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJg4few-oaxMZCF07YkQNB4VPgRv_RWetgFR_2y5sEYw&s=10" },
    { name: "Onions", price: "₹45/kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJdFIntCS8-Luro9iXtQY4fbr8RrOrRPgqb_prnlhw-A&s=10" },
    {
      name: "Carrot",
      price: "₹40 / kg",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGbWyjIGw66LYx8KkE9p8bH0vGFZ_NFHnApdCABp-R5w&s=10"
    },
    {
      name: "Cauliflower",
      price: "₹35 / piece",
      image: "https://www.starquik.com/cdn/shop/files/1052169_PDP1_908fa9dc-4734-4857-96ec-3e2b36723589.jpg?v=1779259869"
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
    <div className="vegetables-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  

      <div className="vegetables-banner">
        <h1>Fresh Vegetables</h1>
        <p>Healthy and Farm Fresh Vegetables</p>
      </div>

      <div className="vegetables-grid">
        {vegetables.map((item,index)=>(
          <div className="vegetable-card" key={index}>
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

export default FreshVegetables;