import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  // We assume 'admin' and 'navigate' are available in the context or imported if needed
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  // 1. Define fetchOrders outside useEffect so it is callable
  const fetchOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  // 2. Update handleOrderAction to call fetchOrders
  const handleOrderAction = (order) => {
    if (order.status === "Delivered") {
      console.log("Re-order functionality would go here for order:", order._id);
    } else {
      // When user clicks 'Track Order', we want to check the server immediately.
      console.log(`Checking latest status for order: ${order._id}`);
      fetchOrders(); // ⭐️ CRITICAL ADDITION: Calls the refresh function ⭐️
    }
  };

  useEffect(() => {
    // Fetch orders immediately when the component mounts
    if (token) {
      fetchOrders();
    }

    // NOTE: If you implemented the Polling solution, that code would go here
    // (e.g., setting up the setInterval and cleanup)

  }, [token, url]); // Dependency array

  return (
    <div className="my-orders">
      <h2>Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="Parcel icon" />
              <p>
                {order.items.map((item, itemIndex) => {
                  return (
                    item.name +
                    " X " +
                    item.quantity +
                    (itemIndex === order.items.length - 1 ? "" : ", ")
                  );
                })}
              </p>
              <p>₹{order.amount.toFixed(2)}</p>
              <p>Items: {order.items.length}</p>
              <p>{new Date(order.date).toLocaleDateString()}</p>
              <p>
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>
              <button onClick={() => handleOrderAction(order)}>
                {/* The text is determined by the *current* status */}
                {order.status === "Delivered" ? "Re-order" : "Track Order"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;