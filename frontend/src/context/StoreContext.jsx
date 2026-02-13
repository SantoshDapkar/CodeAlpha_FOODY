import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const url = "https://food-delivery-website-backend-bc8f.onrender.com";

  // Add item to cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("Failed to add to cart:", err);
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const prevCount = prev[itemId] || 0;
      if (prevCount <= 1) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: prevCount - 1 };
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("Failed to remove from cart:", err);
      }
    }
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const item = food_list.find((f) => f._id === id);
      return item ? sum + item.price * qty : sum;
    }, 0);
  };

  // Fetch food list
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);

      // ⭐ UPDATED FIX: Normalize category to lowercase and trim whitespace ⭐
      const normalizedFoodList = res.data.data.map(item => ({
        ...item,
        category: item.category ? item.category.toLowerCase().trim() : '',
      }));

      setFoodList(normalizedFoodList || []);
    } catch (err) {
      console.error("Failed to fetch food list:", err);
    }
  };

  // Load cart data from backend
  const loadCartData = async (savedToken) => {
    try {
      const res = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token: savedToken } }
      );
      setCartItems(res.data.cartData || {});
    } catch (err) {
      console.error("Failed to load cart data:", err);
      setCartItems({});
    }
  };

  // Load token and data on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    };
    loadData();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;