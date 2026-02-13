import userModel from "../models/userModel.js";

// add items to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId); // ⭐ FIX: Use || {} to ensure cartData is an object, preventing the crash. ⭐
    let cartData = userData.cartData || {};

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove from cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId); // ⭐ FIX: Use || {} to ensure cartData is an object. ⭐
    let cartData = userData.cartData || {}; // Ensure the item exists in the cart before attempting to modify it

    if (cartData[req.body.itemId]) {
      if (cartData[req.body.itemId] > 1) {
        cartData[req.body.itemId] -= 1;
      } else {
        delete cartData[req.body.itemId];
      }
      await userModel.findByIdAndUpdate(req.body.userId, { cartData });
      res.json({ success: true, message: "Removed from Cart" });
    } else {
      // Optional: If item is not in cart, just return success or a warning
      res.json({ success: true, message: "Item not in cart" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId); // ⭐ FIX APPLIED HERE (Line 43 equivalent): Use || {} to handle null/undefined cart data. ⭐
    let cartData = userData.cartData || {};

    res.json({ success: true, cartData: cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
