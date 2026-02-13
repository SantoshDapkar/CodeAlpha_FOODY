import React, { useState, useContext, useEffect } from "react";
import "./PlaceOrder.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation

const PlaceOrder = () => {
  // Initialize the navigation hook
  const navigate = useNavigate(); // Destructure needed values

  const { getTotalCartAmount, token, cartItems, url } =
    useContext(StoreContext); // ⭐ ACCESS GUARD LOGIC: Ensures user is logged in and cart is not empty ⭐

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]); // ⭐ END ACCESS GUARD LOGIC ⭐
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () =>
    Object.values(data).every((val) => val.trim() !== "");

  const handlePayment = async () => {
    if (getTotalCartAmount() === 0) return alert("Your cart is empty!");
    if (!token) return alert("Please login first!");
    if (!isFormValid()) return alert("Please fill in all delivery details!");

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id || decoded._id;

      if (!userId) {
        console.error(
          "FAILURE: User ID key was null or undefined in the token."
        );
        throw new Error("User ID not found in token");
      }
    } catch (err) {
      console.error("Token Processing Failed. Error details:", err);
      return alert("Please login again.");
    }

    const amountInRupees = getTotalCartAmount() + 2;

    try {
      // 1. Call backend to create Razorpay Order
      const response = await axios.post(
        `${url}/api/order/place`,
        {
          userId,
          items: cartItems,
          amount: amountInRupees,
          address: data,
        },
        { headers: { token } }
      );

      if (!response.data.success) {
        return alert("Failed to place order. Try again.");
      } // 2. Extract Razorpay details from the backend response

      const {
        order_id: razorpayOrderId,
        amount: amountInPaise,
        key_id: key,
        mongoOrderId,
      } = response.data;

      if (typeof window.Razorpay === "undefined") {
        alert("Razorpay script not loaded! Check your index.html.");
        return;
      } // 3. Configure Razorpay options

      const options = {
        key: key,
        amount: amountInPaise,
        currency: "INR",
        name: "Food Delivery",
        description: "Order Payment",
        order_id: razorpayOrderId,

        handler: async (res) => {
          try {
            const verifyResponse = await axios.post(
              `${url}/api/order/verify`,
              {
                mongoOrderId: mongoOrderId,
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
              },
              { headers: { token } }
            );

            if (verifyResponse.data.success) {
              // Alert removed for smoother UX, but kept for debugging if needed
              // alert("Payment Successful! Redirecting to My Orders.");
            } else {
              console.error("Payment verification failed on server."); // alert("Payment verification failed! Redirecting to status check.");
            }

            // ⭐ CRITICAL: Always use the absolute URL returned by the backend ⭐
            // This URL is now configured to be /myorders on success.
            window.location.replace(verifyResponse.data.url);
          } catch (err) {
            console.error(
              "Verification Error: Could not reach backend verification endpoint.",
              err
            );
            alert(
              "A network error occurred during payment verification. Please check your orders."
            );

            // Fallback redirect path on network failure (still use /verify for status check)
            window.location.replace(
              `${url}/verify?success=false&orderId=${mongoOrderId}`
            );
          }
        },

        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone,
        },
        theme: { color: "#007bff" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <form className="place-order" onSubmit={(e) => e.preventDefault()}>
           {" "}
      <div className="place-order-left">
                <p className="title">Delivery Information</p>       {" "}
        <div className="multi-fields">
                   {" "}
          <input
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            placeholder="First Name"
          />
                   {" "}
          <input
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            placeholder="Last Name"
          />
                 {" "}
        </div>
               {" "}
        <input
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          placeholder="Email"
        />
               {" "}
        <input
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          placeholder="Street"
        />
               {" "}
        <div className="multi-fields">
                   {" "}
          <input
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            placeholder="City"
          />
                   {" "}
          <input
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            placeholder="State"
          />
                 {" "}
        </div>
               {" "}
        <div className="multi-fields">
                   {" "}
          <input
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            placeholder="Zip Code"
          />
                   {" "}
          <input
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            placeholder="Country"
          />
                 {" "}
        </div>
               {" "}
        <input
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          placeholder="Phone"
        />
             {" "}
      </div>
           {" "}
      <div className="place-order-right">
               {" "}
        <div className="cart-total">
                    <h2>Cart Totals</h2>         {" "}
          <div className="cart-total-details">
                        <p>Subtotal</p>           {" "}
            <p>
                            <FontAwesomeIcon icon={faIndianRupeeSign} />       
                    {getTotalCartAmount()}           {" "}
            </p>
                     {" "}
          </div>
                   {" "}
          <div className="cart-total-details">
                        <p>Delivery Fee</p>           {" "}
            <p>
                            <FontAwesomeIcon icon={faIndianRupeeSign} />       
                    {getTotalCartAmount() === 0 ? 0 : 2}           {" "}
            </p>
                     {" "}
          </div>
                   {" "}
          <div className="cart-total-details">
                        <b>Total</b>           {" "}
            <b>
                            <FontAwesomeIcon icon={faIndianRupeeSign} />       
                    {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2} 
                       {" "}
            </b>
                     {" "}
          </div>
                   {" "}
          <button type="button" onClick={handlePayment}>
                        PROCEED TO PAYMENT          {" "}
          </button>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </form>
  );
};

export default PlaceOrder;
