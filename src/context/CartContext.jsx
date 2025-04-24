import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Cargar carrito desde localStorage al inicializar
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Persistir carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    if (quantity < 1) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { 
          ...product, 
          quantity,
          addedAt: new Date().toISOString() 
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  // Calcular métricas del carrito
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  const uniqueItems = cart.length;

  return (
    <CartContext.Provider 
      value={{ 
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        totalItems,
        totalPrice,
        uniqueItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};