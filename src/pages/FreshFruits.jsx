import { useState } from "react";
import "./FreshFruits.css";

function FreshFruits() {
  const [message, setMessage] = useState("");
  const fruits = [
    {
      name: "Fresh Apples",
      price: "₹180 / kg",
      image: "https://cdn.pixabay.com/photo/2017/09/26/13/31/apple-2788616_640.jpg"
    },
    {
      name: "Bananas",
      price: "₹60 / dozen",
      image: "https://st3.depositphotos.com/1642482/18878/i/450/depositphotos_188783356-stock-photo-bunch-of-bananas-isolated.jpg"
    },
    {
      name: "Mangoes",
      price: "₹250 / kg",
      image: "https://www.melissas.com/cdn/shop/files/4-pounds-image-of-honey-mangos-fruit-1125637415_512x512.jpg?v=1738768090"
    },
    {
      name: "Oranges",
      price: "₹120 / kg",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRjhRN5VpE0WVB4GFANN07chx0PTwG-aD3ZQ0vZJsryg&s=10"
    },
    {
      name: "Watermelon",
      price: "₹50 / kg",
      image: "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN335-Watermelon-732x549-Thumb.jpg"
    },
    {
      name: "Strawberries",
      price: "₹220 / box",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEsN2tmZUmZ3Pydc3Gn4v16cgjkaWLDzwhPgBKkfjD_w&s=10"
    }
  ];

  const addToCart = (product) => {

    let cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      item => item.name === product.name
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
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

    alert(product.name + " added to cart!");
  };

  return (
    <div className="fruits-page">
      {message && (
        <div className="toast">
          {message}
        </div>
      )}
  

      <div className="fruits-banner">
        <h1>Fresh Fruits</h1>
        <p>
          Farm Fresh Fruits Delivered to Your Doorstep
        </p>
      </div>

      <div className="fruits-grid">

        {fruits.map((item, index) => (
          <div className="fruit-card" key={index}>

            <img
              src={item.image}
              alt={item.name}
            />

            <h3>{item.name}</h3>

            <p>{item.price}</p>

            <button
              onClick={() => addToCart(item)}
            >
              Add to Cart
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default FreshFruits;