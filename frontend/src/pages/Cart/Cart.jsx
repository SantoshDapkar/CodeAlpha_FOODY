import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
  const { cartItems, food_list, removeFromCart,getTotalCartAmount,url} = useContext(StoreContext);

  const navigate =useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <br />
        <hr />

        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>
                    <FontAwesomeIcon icon={faIndianRupeeSign} /> {item.price}
                  </p>
                  <p>{cartItems[item._id]}</p>
                  <p>
                    <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                    {item.price * cartItems[item._id]}
                  </p>
                  <p id="icon" onClick={() => removeFromCart(item._id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </p>
                </div>
                <hr />
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>

      <div className="cart-bottom">

        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>
                {" "}
                <FontAwesomeIcon icon={faIndianRupeeSign} />
                {getTotalCartAmount()}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>
                {" "}
                <FontAwesomeIcon icon={faIndianRupeeSign} />
                {getTotalCartAmount()===0?0:2}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {" "}
                <FontAwesomeIcon icon={faIndianRupeeSign} />
                {getTotalCartAmount()===0?0:getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
