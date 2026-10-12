import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { db } from '../db/localStorageDb';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { success } = useToast();
  const storageKey = `bluecart_wishlist_${user?.id || 'guest'}`;

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : ['prd_aurora', 'prd_stridex'];
    } catch {
      return ['prd_aurora', 'prd_stridex'];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(wishlistIds));
  }, [wishlistIds, storageKey]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistIds.includes(productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlistIds(prev => prev.filter(id => id !== product.id));
      success(`Removed "${product.name}" from your wishlist.`);
    } else {
      setWishlistIds(prev => [...prev, product.id]);
      success(`Saved "${product.name}" to your wishlist!`);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds(prev => prev.filter(id => id !== productId));
  };

  // Hydrate full products
  const allProducts = db.get('products') || [];
  const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id) && p.isActive);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
