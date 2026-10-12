import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ProductImage } from '../../components/ui/ProductImage';
import { StarRating } from '../../components/ui/StarRating';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { productsApi } from '../../api/products.api';
import { reviewsApi } from '../../api/reviews.api';
import { Product, Review } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  ShoppingCart, Heart, Zap, Truck, ShieldCheck, 
  RotateCcw, Check, Star, AlertCircle, Building2 
} from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Review form state
  const [isEligibleReviewer, setIsEligibleReviewer] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setIsLoading(true);
      const res = await productsApi.getProductById(id);
      if (res.success && res.data) {
        setProduct(res.data);
        // Load reviews
        const revRes = await reviewsApi.getProductReviews(res.data.sku);
        if (revRes.success && revRes.data) {
          setReviews(revRes.data);
        }

        // Check if verified purchaser (FR-25)
        if (user) {
          const eligRes = await reviewsApi.checkEligibility(user.id, res.data.sku);
          setIsEligibleReviewer(eligRes.data?.eligible || false);
        }
      }
      setIsLoading(false);
    };
    loadData();
  }, [id, user]);

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Product Not Found</h2>
          <Link to="/products">
            <Button size="sm">Browse Products</Button>
          </Link>
        </div>
      </StoreLayout>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stockQty <= 0;
  const isLowStock = product.stockQty > 0 && product.stockQty <= 40;

  // 4 Gallery thumbnails (main, detail, feature, box)
  const galleryKeys = product.images.length >= 4 
    ? product.images.slice(0, 4) 
    : [product.images[0] || 'box', 'detail', 'battery', 'box'];

  const handleAddToCart = async () => {
    await addToCart(product, qty);
  };

  const handleBuyNow = async () => {
    const ok = await addToCart(product, qty);
    if (ok) {
      navigate('/cart');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      error('Please sign in to write a review.');
      return;
    }
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      error('Please fill in both the title and review text.');
      return;
    }

    setIsSubmittingReview(true);
    const res = await reviewsApi.submitReview({
      userId: user.id,
      userName: user.name,
      sku: product.sku,
      productId: product.id,
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim()
    });
    setIsSubmittingReview(false);

    if (res.success && res.data) {
      success('Review submitted successfully! Thank you.');
      setReviews([res.data, ...reviews]);
      setReviewTitle('');
      setReviewComment('');
      setIsEligibleReviewer(false); // only 1 review per product
      // Update local product rating
      const updated = await productsApi.getProductById(product.id);
      if (updated.success && updated.data) {
        setProduct(updated.data);
      }
    } else {
      error(res.error || 'Failed to submit review');
    }
  };

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/store' },
            { label: product.category, path: `/category/${product.category}` },
            { label: product.name }
          ]}
        />

        {/* Product Top Grid matching Fig 8.7 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          {/* Gallery Area (Left 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800 flex items-center justify-center overflow-hidden">
              <ProductImage
                category={product.category}
                productId={product.id}
                imageKey={galleryKeys[selectedImageIdx]}
                perspective={(['main', 'detail', 'feature', 'box'] as const)[selectedImageIdx]}
                size="xl"
                className="w-full max-w-[420px] aspect-square rounded-xl shadow-sm"
              />
            </div>

            {/* 4 Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {galleryKeys.map((imgKey, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`p-1.5 rounded-lg border-2 bg-slate-50 dark:bg-slate-950 transition-all overflow-hidden ${
                    selectedImageIdx === idx ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <ProductImage
                    category={product.category}
                    productId={product.id}
                    imageKey={imgKey}
                    perspective={(['main', 'detail', 'feature', 'box'] as const)[idx]}
                    size="sm"
                    className="w-full aspect-square rounded"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Actions Area (Right 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Brand: <strong className="text-slate-800 dark:text-slate-200">{product.brand}</strong>
                </span>
                <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {product.name}
              </h1>

              {/* Rating & Review summary */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900/40">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                    {product.avgRating.toFixed(1)}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  ({product.reviewCount} customer reviews)
                </button>
              </div>

              {/* Price Row */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-500 text-white">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Inclusive of all taxes (GST 18% applied)</p>

              {/* Stock Indicator */}
              <div className="pt-1">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Low Stock: Only {product.stockQty} units remaining!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> In Stock ({product.stockQty} units available)
                  </span>
                )}
              </div>

              {/* Vendor & Delivery Details */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Fulfilled & Dispatched by: <strong className="text-slate-800 dark:text-slate-200">{product.vendorName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-400" />
                  <span>Delivery Estimate: <strong>3 - 5 business days</strong> (Express available at checkout)</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                  <span>7-Day Return Policy (FR-24 verified)</span>
                </div>
              </div>
            </div>

            {/* Actions: Stepper, Add to Cart, Buy Now, Wishlist */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                  <button
                    disabled={qty <= 1 || isOutOfStock}
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-100">{qty}</span>
                  <button
                    disabled={qty >= product.stockQty || isOutOfStock}
                    onClick={() => setQty(q => Math.min(product.stockQty, q + 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isFavorited 
                      ? 'bg-rose-50 border-rose-200 text-rose-600' 
                      : 'border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                  <span>{isFavorited ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </Button>
                <Button
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info: Description, Specifications, Reviews matching Fig 8.8 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-6 py-3.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'desc' 
                  ? 'border-primary text-primary bg-white dark:bg-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-3.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'specs' 
                  ? 'border-primary text-primary bg-white dark:bg-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'reviews' 
                  ? 'border-primary text-primary bg-white dark:bg-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Ratings & Reviews ({reviews.length})
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>
                {product.features && (
                  <div className="pt-4 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Key Highlights:
                    </h4>
                    <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {product.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <table className="w-full text-xs text-left">
                  <tbody>
                    {product.specifications ? (
                      Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2.5 font-bold text-slate-500 w-1/3">{key}</td>
                          <td className="py-2.5 text-slate-800 dark:text-slate-200">{val}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-2 text-slate-500">Standard manufacturer specifications apply.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Review Header & Rating Aggregation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-center p-6 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
                    <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                      {product.avgRating.toFixed(1)}
                    </p>
                    <div className="flex justify-center my-2">
                      <StarRating rating={product.avgRating} size="md" />
                    </div>
                    <p className="text-xs text-slate-500">Based on {product.reviewCount} customer ratings</p>
                  </div>

                  {/* Write Review Form / Rule Banner (FR-25) */}
                  <div className="md:col-span-2">
                    {isEligibleReviewer ? (
                      <form onSubmit={handleSubmitReview} className="space-y-3 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Write a Verified Review (FR-25)
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 font-medium">Your Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(st => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => setReviewRating(st)}
                                className="p-0.5"
                              >
                                <Star className={`w-5 h-5 ${st <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Headline (e.g. Excellent sound quality)"
                          value={reviewTitle}
                          onChange={e => setReviewTitle(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        />
                        <textarea
                          rows={3}
                          placeholder="Write your honest product feedback..."
                          value={reviewComment}
                          onChange={e => setReviewComment(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        />
                        <Button type="submit" size="sm" disabled={isSubmittingReview}>
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </form>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            Verified Purchaser Rule (SRS FR-25)
                          </p>
                          <p className="text-slate-500 leading-relaxed">
                            Only customers who purchased this product and received a confirmed delivery can submit a review. This guarantees authentic, spam-free ratings for the community.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No customer reviews yet. Be the first verified buyer to share feedback!</p>
                  ) : (
                    reviews.map(rev => (
                      <div key={rev.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StarRating rating={rev.rating} size="sm" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.title}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified Purchase
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};
