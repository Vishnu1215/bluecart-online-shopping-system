import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { cartApi } from '../api/cart.api';
import { PricingBreakdown, calculateOrderPricing } from '../services/pricing.service';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  pricing: PricingBreakdown;
  couponCode?: string;
  isLoading: boolean;
  addToCart: (product: Product, qty?: number) => Promise<boolean>;
  updateQty: (productId: string, qty: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const defaultPricing: PricingBreakdown = {
  subtotal: 0,
  couponDiscount: 0,
  discountedSubtotal: 0,
  taxAmount: 0,
  shippingCost: 0,
  grandTotal: 0,
  freeShippingApplied: false,
  itemCount: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | undefined>(undefined);
  const [pricing, setPricing] = useState<PricingBreakdown>(defaultPricing);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentUserId = user?.id || 'guest_user';

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await cartApi.getCart(currentUserId);
      if (res.success && res.data) {
        setItems(res.data.cart.items || []);
        setCouponCode(res.data.cart.couponCode);
        setPricing(res.data.pricing);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product: Product, qty: number = 1): Promise<boolean> => {
    try {
      const res = await cartApi.addItem(currentUserId, {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        image: product.images[0] || 'box',
        vendorId: product.vendorId
      }, qty);

      if (res.success && res.data) {
        setItems(res.data.cart.items);
        setPricing(res.data.pricing);
        success(`Added "${product.name}" to cart!`);
        return true;
      } else {
        error(res.error || 'Failed to add item to cart');
        return false;
      }
    } catch (err: any) {
      error(err.message || 'Error adding item to cart');
      return false;
    }
  };

  const updateQty = async (productId: string, qty: number): Promise<boolean> => {
    try {
      const res = await cartApi.updateItemQty(currentUserId, productId, qty);
      if (res.success && res.data) {
        setItems(res.data.cart.items);
        setPricing(res.data.pricing);
        return true;
      } else {
        error(res.error || 'Could not update quantity');
        return false;
      }
    } catch (err: any) {
      error(err.message || 'Error updating quantity');
      return false;
    }
  };

  const removeFromCart = async (productId: string): Promise<boolean> => {
    try {
      const res = await cartApi.removeItem(currentUserId, productId);
      if (res.success && res.data) {
        setItems(res.data.cart.items);
        setPricing(res.data.pricing);
        success('Item removed from cart');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await cartApi.applyCoupon(currentUserId, code);
      if (res.success && res.data) {
        setCouponCode(res.data.cart.couponCode);
        setPricing(res.data.pricing);
        success(res.message || 'Coupon applied!');
        return { success: true, message: res.message || 'Coupon applied' };
      } else {
        error(res.error || 'Invalid coupon code');
        return { success: false, message: res.error || 'Invalid coupon code' };
      }
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = async () => {
    try {
      const res = await cartApi.removeCoupon(currentUserId);
      if (res.success && res.data) {
        setCouponCode(undefined);
        setPricing(res.data.pricing);
        success('Coupon removed');
      }
    } catch {
      // ignore
    }
  };

  const clearCart = async () => {
    await cartApi.clearCart(currentUserId);
    setItems([]);
    setCouponCode(undefined);
    setPricing(defaultPricing);
  };

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        pricing,
        couponCode,
        isLoading,
        addToCart,
        updateQty,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        clearCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
