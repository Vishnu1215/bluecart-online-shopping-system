import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { ProductImage } from '../../components/ui/ProductImage';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { 
  Trash2, Heart, ArrowRight, ShoppingBag, 
  Tag, ShieldCheck, Check, AlertCircle 
} from 'lucide-react';

export const ShoppingCartPage: React.FC = () => {
  const { items, pricing, couponCode, updateQty, removeFromCart, applyCoupon, removeCoupon } = useCart();
  const { toggleWishlist } = useWishlist();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponError(null);
    setIsApplyingCoupon(true);
    const res = await applyCoupon(couponInput.trim());
    setIsApplyingCoupon(false);

    if (res.success) {
      success(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleMoveToWishlist = (item: any) => {
    toggleWishlist({
      id: item.productId,
      sku: item.sku,
      name: item.name,
      price: item.price,
      mrp: item.mrp,
      category: 'Audio',
      brand: 'Generic',
      description: '',
      stockQty: 50,
      images: [item.image],
      isActive: true,
      avgRating: 4.5,
      reviewCount: 1,
      vendorId: item.vendorId,
      vendorName: 'Vendor'
    } as any);
    removeFromCart(item.productId);
    success(`Moved "${item.name}" to wishlist.`);
  };

  if (items.length === 0) {
    return (
      <StoreLayout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Discover high-quality products across all categories!
          </p>
          <div className="pt-2">
            <Link to="/products">
              <Button>Explore Products</Button>
            </Link>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/store' }, { label: 'Shopping Cart' }]} />

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Shopping Cart ({items.reduce((s, i) => s + i.qty, 0)} items)
        </h1>

        {/* Layout: Items Table (Left 8 cols) + Order Summary (Right 4 cols) matching Fig 8.9 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map(item => (
                <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800 shrink-0">
                      <ProductImage
                        src={item.image}
                        imageKey={item.image}
                        productId={item.productId}
                        size="sm"
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <Link to={`/product/${item.productId}`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {item.sku}</p>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">
                        ₹{item.price.toLocaleString('en-IN')}{' '}
                        {item.mrp > item.price && (
                          <span className="text-slate-400 font-normal line-through ml-1 text-[11px]">
                            ₹{item.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                      <button
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-slate-800 dark:text-slate-100">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                        title="Move to Wishlist"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Free Shipping Alert banner */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs text-primary font-medium">
              <span>{pricing.freeShippingApplied ? '🎉 You unlocked FREE Standard Shipping!' : `Add ₹${Math.max(0, 5000 - pricing.subtotal).toLocaleString('en-IN')} more for Free Shipping.`}</span>
              <Link to="/products" className="underline font-bold">Shop More</Link>
            </div>
          </div>

          {/* Order Summary Card matching Fig 8.9 */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Order Summary</h3>

            {/* Coupon Code Input */}
            <div>
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-primary" /> Apply Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SAVE10"
                    value={couponInput}
                    onChange={e => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError(null);
                    }}
                    className="flex-1 uppercase font-mono text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button type="submit" size="sm" variant="outline" disabled={isApplyingCoupon}>
                    Apply
                  </Button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {couponError}
                  </p>
                )}
                {couponCode && (
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-800">
                    <span className="font-bold">Code applied: {couponCode}</span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-rose-600 hover:underline font-semibold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>₹{pricing.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {pricing.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-₹{pricing.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated GST (18%)</span>
                <span>₹{pricing.taxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span>{pricing.freeShippingApplied ? <strong className="text-emerald-600">FREE</strong> : `₹${pricing.shippingCost}`}</span>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between text-base font-extrabold text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span>₹{pricing.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Button
              onClick={() => navigate('/checkout/address')}
              size="lg"
              className="w-full flex items-center justify-center gap-2 text-sm font-bold shadow-md"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};
