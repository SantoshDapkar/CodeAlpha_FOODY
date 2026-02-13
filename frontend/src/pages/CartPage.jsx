import React, { useContext } from "react";
import Checkout from "../components/Checkout";
import { StoreContext } from "../context/StoreContext";

const CartPage = () => {
  const { cartItems, totalAmount, userId, address } = useContext(StoreContext);

  return (
    <div>
      <h1>Cart</h1>
      {/* Render cart items */}
      <Checkout
        userId={userId}
        cartItems={cartItems}
        totalAmount={totalAmount}
        address={address}
      />
    </div>
  );
};

export default CartPage;
