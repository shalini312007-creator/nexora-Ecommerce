import { useState } from "react";
import "./BooksEducation.css";

function BooksEducation() {
  const [message, setMessage] = useState("");
  const books = [
    { name:"React Guide", price:"₹699", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzyLyPw4J8TM_Nrwg1pG0pjqAyNhSI7pTPxNNKD2C2GQ&s=10" },
    { name:"Java Programming", price:"₹799", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSdKN9H4KbfbWNrFLw0slh3iYy9c4mYGPkwVe7cgrVqQ&s=10" },
    { name:"Data Structures", price:"₹899", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCmVXmjE4FzknQ80RAh_h9LDr1pMUIo913ZjLLp0yDbA&s=10" },
    { name:"Aptitude Book", price:"₹499", image:"https://m.media-amazon.com/images/I/81JPH4BD4DL._AC_UF1000,1000_QL80_.jpg" }
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
    <div className="books-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  

      <div className="books-banner">
        <h1>Books & Education</h1>
      </div>

      <div className="books-grid">

        {books.map((item,index)=>(
          <div className="books-card" key={index}>
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

export default BooksEducation;