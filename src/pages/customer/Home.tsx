import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { ProductCard } from '../../components/product/ProductCard';
import { productsApi } from '../../api/products.api';
import { Product, ProductCategory } from '../../types';
import { 
  Sparkles, ArrowRight, ShieldCheck, Truck, Clock, 
  RotateCcw, Zap, Headphones, Smartphone, Laptop, 
  Watch, Footprints, Camera, ShoppingBag 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

const categoryIcons: Array<{ name: ProductCategory; icon: any; color: string }> = [
  { name: 'Mobiles', icon: Smartphone, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40' },
  { name: 'Computers', icon: Laptop, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40' },
  { name: 'Audio', icon: Headphones, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40' },
  { name: 'Wearables', icon: Watch, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40' },
  { name: 'Footwear', icon: Footprints, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40' },
  { name: 'Cameras', icon: Camera, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40' },
  { name: 'Bags', icon: ShoppingBag, color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40' },
];

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeatured = async () => {
      const res = await productsApi.getProducts({ limit: 8, sortBy: 'popularity' });
      if (res.success && res.data) {
        setFeaturedProducts(res.data.products);
      }
      setIsLoading(false);
    };
    loadFeatured();
  }, []);

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        {/* 1. Hero Banner matching Fig 8.3 */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white p-8 md:p-12 shadow-lg">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-amber-300">
              <Sparkles className="w-3.5 h-3.5" /> Festive Sale — Up to 40% Off
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Everything you need, delivered to your door.
            </h1>
            <p className="text-sm md:text-base text-blue-100 font-normal leading-relaxed">
              Explore authentic products from verified distributors with verified-buyer ratings, instant coupons, and free delivery on orders above ₹5,000.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold border-none shadow-md">
                  Shop Now <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/category/Audio">
                <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10">
                  Explore Audio
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute right-12 bottom-6 opacity-20 pointer-events-none">
            <ShoppingBag className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* 2. Value Props Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-primary">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Fast Delivery</p>
              <p className="text-[11px] text-slate-500">Express in 1-2 days</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Verified Vendors</p>
              <p className="text-[11px] text-slate-500">100% Genuine Items</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">7-Day Easy Returns</p>
              <p className="text-[11px] text-slate-500">Hassle-free doorstep pickup</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Secure Checkout</p>
              <p className="text-[11px] text-slate-500">Zero card storage (PCI-DSS)</p>
            </div>
          </div>
        </div>

        {/* 3. Category Shortcuts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Shop by Category
            </h2>
            <Link to="/products" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {categoryIcons.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => navigate(`/category/${cat.name}`)}
                  className="flex flex-col items-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-primary/50 hover:shadow-md transition-all group text-center"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform ${cat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Featured Products Grid matching Fig 8.3 */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Featured Products
              </h2>
              <p className="text-xs text-slate-500">Popular items picked for you</p>
            </div>
            <Link to="/products" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              Explore All Products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 space-y-3">
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
};
