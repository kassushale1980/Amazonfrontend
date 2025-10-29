import React, { useContext, useState } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import axios from "axios";
import { Type } from "../../Utility/action.type";
import { useNavigate, useLocation } from "react-router-dom";

function Payment() {
  const [{ basket }] = useContext(DataContext);
  const [, dispatch] = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const clientSecret = location.state?.clientSecret;

  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const total = basket.reduce((amount, item) => item.price * item.amount + amount, 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError(null);

    try {
      const confirmation = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      const paymentIntent = confirmation.paymentIntent;

      if (paymentIntent?.status === "succeeded") {
        // Save order in backend
        await axios.post("http://localhost:5050/api/orders", {
          userId: "demo-user", // replace with logged-in user ID
          orderData: {
            basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created,
          },
        });

        // Clear cart
        dispatch({ type: Type.EMPTY_BASKET });

        // Navigate to success page
        navigate("/orders", { state: { msg: "Payment successful!" } });
      }
    } catch (err) {
      console.error("Payment error:", err);
      setCardError(err.message || "Payment failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <LayOut>
      <div className={classes.payment_header}>Checkout ({basket?.length}) items</div>

      <section className={classes.payment}>
        {/* Review Items */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => (
              <ProductCard key={item.id} product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* Payment Form */}
        <div className={classes.flex}>
          <h3>Payment Method</h3>
          <div className={classes.payment_card_container}>
            <form onSubmit={handlePayment}>
              {cardError && <small style={{ color: "red" }}>{cardError}</small>}
              <CardElement />
              <div className={classes.payment_price}>
                <p>Order Total: <CurrencyFormat amount={total} /></p>
                <button type="submit" disabled={processing}>
                  {processing ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Payment;
