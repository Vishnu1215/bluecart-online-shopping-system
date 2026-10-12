import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { ProductCard } from '../../components/product/ProductCard';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { productsApi } from '../../api/products.api';
import { Product, ProductCategory } from '../../types';
import { Sparkles, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<'popularity' | 'price_asc' | 'price_desc' | 'rating'>('popularity');

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      const res = await productsApi.getProducts({
        category: category,
        sortBy: sort,
        limit: 24
      });
      if (res.success && res.data) {
        setProducts(res.data.products);
      }
      setIsLoading(false);
    };
    fetchCategory();
  }, [category, sort]);

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/store' },
            { label: 'Categories', path: '/products' },
            { label: category || 'Category' }
          ]}
        />

        {/* Category Header Banner matching Fig 8.5 */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest bg-white/10 px-2.5 py-0.5 rounded-full">
              Category Department
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {category} Equipment & Devices
            </h1>
            <p className="text-xs text-blue-200">
              Browse top rated {category} with verified authentic manufacturer warranties.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-blue-200">Sort:</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as any)}
              className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-white font-medium"
            >
              <option value="popularity" className="text-slate-900">Popularity</option>
              <option value="price_asc" className="text-slate-900">Price: Low to High</option>
              <option value="price_desc" className="text-slate-900">Price: High to Low</option>
              <option value="rating" className="text-slate-900">Rating</option>
            </select>
          </div>
        </div>

        {/* Product Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 space-y-3">
                <Skeleton className="h-44 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 p-8">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No products found in this category.</p>
            <Link to="/products" className="mt-3 inline-block text-xs font-bold text-primary hover:underline">
              View all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
};
