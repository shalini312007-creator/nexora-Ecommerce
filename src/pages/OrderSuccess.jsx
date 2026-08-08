import { Link } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess(){

    return(

        <div className="success-page">

            <div className="success-box">

                <h1>🎉 Order Placed Successfully!</h1>

                <p>
                    Thank you for shopping with Nexora.
                </p>

                <p>
                    Your order will be delivered within
                    <strong> 3 - 5 business days.</strong>
                </p>

                <h3>Order ID : NX2026001</h3>

                <Link to="/">
                    <button>
                        Continue Shopping
                    </button>
                </Link>

            </div>

        </div>

    );
}

export default OrderSuccess;