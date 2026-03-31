import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/data/products";

export type Size = string;

export interface CartItem {
  product: Product;
  size: Size;
  quantity: number;
  variantLabel?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: Size, variantLabel?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: Size, variantLabel?: string) => void;
  updateQuantity: (productId: string, size: Size, quantity: number, variantLabel?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("seksi_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("seksi_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, size: Size, variantLabel?: string, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.size === size && item.variantLabel === variantLabel);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size && item.variantLabel === variantLabel
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, size, quantity, variantLabel }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: Size, variantLabel?: string) => {
    setItems((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size && item.variantLabel === variantLabel)));
  }, []);

  const updateQuantity = useCallback((productId: string, size: Size, quantity: number, variantLabel?: string) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size && item.variantLabel === variantLabel)));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size && item.variantLabel === variantLabel ? { ...item, quantity } : item
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
