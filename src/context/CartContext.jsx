import { createContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((course) => {
    setCartItems((prev) => {
      if (prev.find((item) => item._id === course._id)) {
        toast.error("Course already in cart");
        return prev;
      }
      toast.success("Added to cart!");
      return [...prev, course];
    });
  }, []);

  const removeFromCart = useCallback((courseId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== courseId));
    toast.success("Removed from cart");
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("cart");
  }, []);

  const isInCart = useCallback(
    (courseId) => cartItems.some((item) => item._id === courseId),
    [cartItems]
  );

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        cartTotal,
        cartCount: cartItems.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};