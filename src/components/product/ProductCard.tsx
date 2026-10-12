import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Check, Star } from 'lucide-react';
import { Product } from '../../types';
import { ProductImage } from '../ui/ProductImage';
import { StarRating } from '../ui/StarRating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, items } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const inCart = items.some(i => i.productId === product.id);
  const isOutOfStock = product.stockQty <= 0;
  const isLowStock = product.stockQty > 0 && product.stockQty <= 20;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[10px] border border-slate-200/80 dark:border-slate-800 hover:border-primary/40 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Top badges: Discount & Wishlist */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {product.discountPercent > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500 text-white shadow-sm">
            {product.discountPercent}% OFF
          </span>
        )}
        {isOutOfStock && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-white shadow-sm">
            Out of Stock
          </span>
        )}
        {isLowStock && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
            Only {product.stockQty} left!
          </span>
        )}
      </div>

      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white text-slate-400 hover:text-rose-500 shadow-sm border border-slate-200/50 dark:border-slate-700 transition-colors"
        aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Real Product Picture Tile */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden p-3 bg-slate-50/50 dark:bg-slate-950/20">
        <ProductImage
          category={product.category}
          productId={product.id}
          src={product.images[0]}
          imageKey={product.images[0]}
          size="xl"
          className="w-full aspect-[4/3] rounded-lg shadow-2xs"
        />
      </Link>

      {/* Card Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
            <span className="uppercase tracking-wider text-primary">{product.category}</span>
            <span>{product.brand}</span>
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.id}`}
            className="text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-primary transition-colors line-clamp-1 mb-1.5"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Star Rating with Count */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <StarRating rating={product.avgRating} size="sm" showText reviewCount={product.reviewCount} />
          </div>

          {/* Price & MRP */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[10px] text-slate-500 ml-auto font-mono">
              {product.sku}
            </span>
          </div>
        </div>

        {/* Action Button: Add to Cart */}
        <Button
          variant={inCart ? 'secondary' : 'primary'}
          size="sm"
          className="w-full"
          disabled={isOutOfStock}
          onClick={() => addToCart(product, 1)}
          icon={inCart ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ShoppingCart className="w-3.5 h-3.5" />}
        >
          {isOutOfStock ? 'Out of Stock' : inCart ? 'Added to Cart' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};
