import React from 'react';
import "./Checkout.css";
import CheckoutProduct from './CheckoutProduct';
import { useStateValue } from './StateProvider';
import SubTotal from "./SubTotal.js";
import FlipMove from 'react-flip-move'; 
function Checkout() {
    const[{cart, user}, dispatch] = useStateValue();
    return (
        <div className="checkout">
            <div className="checkout__left">
                <img className="checkout__ad"
                     src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
                     alt=""
                     />
                
                <div>
                    <h3>Hello {user?.email}</h3>
                <h2 className="checkout__title">
                    Your shop cart
                </h2>
                
                {cart.map(item => 
                    <CheckoutProduct  
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    price={item.price}
                    rating={item.rating}/>
                    )} 
                
                    
                </div>
                
            </div>
            <div className="checkout__right">
                <SubTotal />
                {/* Sub total */}
            </div>

        </div>
    )
}

export default Checkout
