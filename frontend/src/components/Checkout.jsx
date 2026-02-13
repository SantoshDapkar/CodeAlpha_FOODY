import React, { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext";

const Checkout = () => {
  const { cartItems, food_list, getTotalCartAmount, placeOrder } =
    useContext(StoreContext);
  const [address, setAddress] = useState("");

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    placeOrder(address);
  };

  const cartItemsArray = Object.keys(cartItems).map((id) => {
    const food = food_list.find((f) => f._id === id);
    return {
      ...food,
      quantity: cartItems[id],
    };
  });

  if (cartItemsArray.length === 0) {
    return <h2 className="text-center mt-5">Your cart is empty!</h2>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout</h2>

      <div className="row">
        <div className="col-md-8">
          <h4>Cart Items</h4>
          <ul className="list-group mb-3">
            {cartItemsArray.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="my-0">{item.name}</h6>
                  <small className="text-muted">
                    Quantity: {item.quantity}
                  </small>
                </div>
                <span className="text-muted">
                  ₹{item.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>

          <h5>Total: ₹{getTotalCartAmount()}</h5>

          <div className="mt-4">
            <label className="form-label">Delivery Address</label>
            <textarea
              className="form-control"
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
            />
          </div>

          <button className="btn btn-primary mt-3" onClick={handlePlaceOrder}>
            Place Order & Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
