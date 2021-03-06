import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from './axios';
import React, { useEffect, useState } from 'react'
import CurrencyFormat from 'react-currency-format';
import { Link, useHistory } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import "./Payment.css";
import { getBasketTotal } from './reducer';
import { useStateValue } from './StateProvider';

function Payment() {
    const [{cart, user }, dispatch] = useStateValue();
    const history = useHistory();
    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() => {
        
        // generate the special stripe secret which allows us to charge a customer
        const getClinetSecret = async () => {
                const response = await axios({
                    method:'post',
                     // Stripe expects he total in currencies subunits
                    url:`/payments/create?total=${getBasketTotal(cart) * 100}`
                });
                setClientSecret(response.data.clientSecret);
        }
        getClinetSecret();
    }, [cart])

    console.log('The secret is >> ', clientSecret );
    

    const handleSubmit = async (event) => {
            event.preventDefault(); 
            setProcessing(true); 

            const payload = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            }).then(({paymentIntent}) => {
                // paymentintent = payment confirmation
                
                setSucceeded(true);
                setError(null);
                setProcessing(false);
                history.repalace('/orders');
            })

            
    }

    const handleChange = event =>{

        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");

    }
    return (
        <div className="payment">
            <div className="payment__container">
                { /* payments section - Delivery address*/ }
                <h1>
                    Checkout({<Link to="/checkout">{cart?.length} items </Link>})
                </h1>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3> Delivery address </h3>
                    </div>
                    <div className="payment__address">
                        <p>{user?.email}</p>
                        <p> 123 Clever lane, </p>
                        <p> Sri Lanka </p>
                    </div>
                </div>
                { /* payments section - Review items*/ }
                

                { /* payments section - Payment method*/ }
                <div className="payment__section">
                    <div className="payment__title">
                        <h3> Review item and delivery </h3>
                    </div>
                    <div className="payment__items">
                        {/* All product */}
                        {cart.map(item => (
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image = {item.image}
                                price={item.price}
                                rating={item.rating} 
                            />
                        ))}
                    
                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3> Payment method </h3>
                    </div>
                    <dev className="payment__details">
                        {/* Stripe magic will go */}
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange}/>
                            <div className="payment__priceContainer">
                            <CurrencyFormat 
                                    renderText={(value) => (
                                        <h3> Order Total: {value}</h3>
                                            
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(cart)}
                                    displayType={"text"}
                                    thousandSeperator={true}
                                    prefix={"$"}
                                
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p> Processing </p>  : "Buy Now"} </span>
                                </button>
                            </div>
                            { /* Error*/}
                            {error && <div>{error}</div>}

                        </form>

                     </dev>
                </div>
            </div>
            
        </div>
    )
}

export default Payment
