import React, { useContext } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import classes from "./Cart.module.css";
import { Type } from "../../Utility/action.type";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios from "axios";

function Cart() {
  const [{ basket }] = useContext(DataContext);
  const [, dispatch] = useContext(DataContext);
  const navigate = useNavigate();

  const total = basket.reduce((amount, item) => item.price * item.amount + amount, 0);

  const increment = (item) => dispatch({ type: Type.ADD_TO_BASKET, item });
  const decrement = (id) => dispatch({ type: Type.REMOVE_FROM_BASKET, id });

  const handleCheckout = async () => {
    if (!basket.length) return alert("Cart is empty!");

    try {
      const response = await axios.post("http://localhost:5050/api/payment", {
        amount: total * 100, // cents
      });

      const clientSecret = response.data.clientSecret;
      navigate("/payment", { state: { clientSecret } });
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout.");
    }
  };

  return (
    <LayOut>
      <section className={classes.container}>
        <div className={classes.cart_container}>
          <h2>Hello</h2>
          <h3>Your shopping basket</h3>
          <hr />

          {basket?.length === 0 ? (
            <p>Opps! Your basket is empty</p>
          ) : (
            basket?.map((item, i) => (
              <section className={classes.cart_product} key={i}>
                <ProductCard product={item} renderAdd={false} renderDesc={true} flex={true} />
                <div className={classes.btn_container}>
                  <button className={classes.btn} onClick={() => increment(item)}>
                    <IoIosArrowUp size={20} />
                  </button>
                  <span>{item.amount}</span>
                  <button className={classes.btn} onClick={() => decrement(item.id)}>
                    <IoIosArrowDown size={20} />
                  </button>
                </div>
              </section>
            ))
          )}
        </div>

        {basket?.length !== 0 && (
          <div className={classes.subtotal}>
            <div>
              <p>Your total is: ({basket?.length} item{basket?.length > 1 ? "s" : ""})</p>
              <CurrencyFormat amount={total} />
            </div>
            <span>
              <input type="checkbox" />
              <small>This is a gift wrap</small>
            </span>
            <button onClick={handleCheckout}>Proceed to Payment</button>
          </div>
        )}
      </section>
    </LayOut>
  );
}

export default Cart;
