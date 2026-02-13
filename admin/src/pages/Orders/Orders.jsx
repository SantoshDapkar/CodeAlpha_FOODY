import React from "react";
import "./Orders.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const fetchAllOrder = async () => {
    const response = await axios.get(url + "/api/order/list", {
      headers: { token },
    });
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      // Check for explicit "not admin" message from the backend
      if (response.data.message === "You are not admin") {
        toast.error("Access Denied: Admin required.");
        navigate("/");
      } else {
        toast.error("Failed to fetch orders.");
      }
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(
      url + "/api/order/status",
      {
        orderId,
        status: event.target.value,
      },
      { headers: { token } }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchAllOrder();
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    // 1. Check for token/login status
    if (!token) {
      toast.error("Please Login First");
      navigate("/"); // Redirect to home/login page
      return;
    }

    // 2. CRITICAL ADMIN CHECK: If logged in but NOT admin, redirect
    if (!admin) {
      toast.error("Access Denied: Admin required.");
      navigate("/");
      return;
    }

    // 3. If Admin and has token, fetch the data
    fetchAllOrder();
  }, [token, admin, navigate, url]);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => {
          // Guard clause: Skips rendering if user data hasn't been properly populated
          if (!order.userId || typeof order.userId === "string") return null;

          return (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, itemIndex) => {
                    return (
                      item.name +
                      " x " +
                      item.quantity +
                      (itemIndex === order.items.length - 1 ? "" : ", ")
                    );
                  })}
                </p>
                <p className="order-item-name">
                  Customer Name: {order.userId.name}
                </p>
                <div className="order-item-address">
                  <p>Email: {order.userId.email}</p>
                  <p>
                    Phone: <b>{order.address.phone}</b>
                  </p>
                  <p>
                    Address:
                    {order.address.street},{order.address.city},
                    {order.address.state},{order.address.zipcode},
                    {order.address.country}
                  </p>
                </div>
              </div>
              <p>
                <b>Items:</b> {order.items.length}
              </p>
              <p>
                <b>Total: ₹ {order.amount}</b>
              </p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
