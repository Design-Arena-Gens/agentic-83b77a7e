import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (cake, quantity = 1, customMessage = '', customDesignUrl = '') => {
    const existingItem = cartItems.find(item => item.id === cake.id);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === cake.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...cake, quantity, customMessage, customDesignUrl }]);
    }
  };

  const removeFromCart = (cakeId) => {
    setCartItems(cartItems.filter(item => item.id !== cakeId));
  };

  const updateQuantity = (cakeId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cakeId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === cakeId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
