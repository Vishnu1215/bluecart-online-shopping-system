import React from 'react';
import { Link } from 'react-router-dom';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ProductCard } from '../../components/product/ProductCard';
import { Button } from '../../components/ui/Button';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts } = useWishlist();

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/store' }, { label: 'My Wishlist' }]} />

        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <span>My Wishlist ({wishlistProducts.length})</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Saved items you want to buy later</p>
          </div>

          <Link to="/products">
            <Button size="sm" variant="outline">Continue Shopping</Button>
          </Link>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <Heart className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Save your favorite items by tapping the heart icon on any product tile.
            </p>
            <Link to="/products">
              <Button size="sm">Discover Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlistProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
};
