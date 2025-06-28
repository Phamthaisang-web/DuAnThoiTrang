"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";

export interface CartItem {
  _id?: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
  stock?: number;
}

interface CartContextValue {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  updateQuantity: (item: CartItem, newQuantity: number) => void;
  cartCount: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { user, hydrated } = useAuthStore();

  const getStorageKey = () => (user?._id ? `cartItems_${user._id}` : null);

  // Load cart từ localStorage sau khi hydrate
  useEffect(() => {
    if (!hydrated) return;

    const key = getStorageKey();
    if (!key) {
      setCart([]);
      setIsReady(true);
      return;
    }

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (err) {
      console.error("❌ Failed to load cart from localStorage:", err);
    } finally {
      setIsReady(true);
    }
  }, [hydrated, user?._id]);

  // Lưu cart vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (!hydrated || !isReady) return;
    const key = getStorageKey();
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(cart));
      } catch (err) {
        console.error("❌ Failed to save cart:", err);
      }
    }
  }, [cart, hydrated, isReady, user?._id]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      );

      const stockLimit = item.stock ?? Infinity;

      if (index !== -1) {
        const updatedCart = [...prevCart];
        const current = updatedCart[index];

        if (current.quantity + 1 > stockLimit) {
          toast.error(`Chỉ còn ${stockLimit} sản phẩm trong kho!`);
          return prevCart;
        }

        updatedCart[index] = { ...current, quantity: current.quantity + 1 };
        return updatedCart;
      }

      if (item.quantity > stockLimit) {
        toast.error(`Chỉ còn ${stockLimit} sản phẩm trong kho!`);
        return prevCart;
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemToRemove: CartItem) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === itemToRemove.productId &&
            item.size === itemToRemove.size &&
            item.color === itemToRemove.color
          )
      )
    );
  };

  const updateQuantity = (targetItem: CartItem, newQuantity: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.productId === targetItem.productId &&
          item.size === targetItem.size &&
          item.color === targetItem.color
        ) {
          const stockLimit = item.stock ?? Infinity;
          const safeQuantity = Math.min(newQuantity, stockLimit);

          if (newQuantity > stockLimit) {
            toast.error(`Chỉ còn ${stockLimit} sản phẩm trong kho!`);
          }

          return { ...item, quantity: safeQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    const key = getStorageKey();
    if (key) {
      localStorage.removeItem(key);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (!isReady) return null;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
