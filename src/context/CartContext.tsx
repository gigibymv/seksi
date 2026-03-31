import React, { createContext, useContext, useState, useCallback } from "react";
import { Product } from "@/data/products";

export type Size = string;

export interface CartItem {
  product: Product;
  size: Size;
  quantity: number;
  variantId?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: Size, variantId?: string) => void;
  removeFromCart: (productId: string, size: Size) => void;
  updateQuantity: (productId: string, size: Size, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, size: Size, variantId?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1, variantId }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: Size) => {
    setItems((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: string, size: Size, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
