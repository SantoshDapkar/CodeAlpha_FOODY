import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay Client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// placing user order for frontend
const placeOrder = async (req, res) => {
  // The frontend URL will now be correctly read from the .env file (e.g., http://localhost:5174)
  const frontend_url = process.env.FRONTEND_URL;
  const currency = "INR";
  const totalAmount = req.body.amount;
  const amountInPaise = Math.round(totalAmount * 100);

  try {
    // ⭐ ITEM ENRICHMENT LOGIC ⭐
    const itemsData = [];
    let cartData = req.body.items;

    for (const itemId in cartData) {
      if (cartData[itemId] > 0) {
        let itemInfo = await foodModel.findById(itemId);

        if (!itemInfo) {
          console.error(
            `Food item with ID ${itemId} not found! Skipping item.`
          );
          continue;
        }

        let item = {
          itemId: itemId,
          name: itemInfo.name,
          price: itemInfo.price,
          quantity: cartData[itemId],
        };
        itemsData.push(item);
      }
    } // Save the order to the database
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: itemsData,
      amount: totalAmount,
      address: req.body.address,
    });
    await newOrder.save(); // Clear the user's cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} }); // Create a Razorpay Order

    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: newOrder._id.toString(),
      notes: {
        mongoOrderId: newOrder._id.toString(),
        userId: req.body.userId,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      mongoOrderId: newOrder._id.toString(),
    });
  } catch (error) {
    console.log("Razorpay Order Creation Error:", error);
    res.json({ success: false, message: "Error creating payment order" });
  }
};
const verifyOrder = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    mongoOrderId,
  } = req.body;

  // Ensure this URL is pointing to the USER APP (e.g., http://localhost:5173)
  const frontend_url = process.env.FRONTEND_URL;

  try {
    // SECURITY: Perform the cryptographic signature verification
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest === razorpay_signature) {
      // Payment verified, update the MongoDB status.
      await orderModel.findByIdAndUpdate(mongoOrderId, { payment: true });

      // ✅ CORRECTED SUCCESS REDIRECT: 
      // Redirect to the frontend's /verify page with success=true.
      // The frontend's Verify.jsx will then navigate to /myorders.
      res.json({
        success: true,
        message: "Payment Verified Successfully",
        url: `${frontend_url}/verify?success=true&orderId=${mongoOrderId}`, // Sending back to /verify
      });

    } else {
      // Verification failed. Delete the order.
      await orderModel.findByIdAndDelete(mongoOrderId);

      // FAILURE REDIRECT: Already correct.
      res.json({
        success: false,
        message: "Payment Verification Failed",
        url: `${frontend_url}/verify?success=false&orderId=${mongoOrderId}`,
      });
    }
  } catch (error) {
    console.log("Error during payment verification:", error);
    res.json({ success: false, message: "Error during payment verification" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin pannel
const listOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      // Use .populate('userId') to fetch the full user document
      const orders = await orderModel.find({}).populate("userId");

      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
