import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { ProductCard } from '../../components/product/ProductCard';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { productsApi } from '../../api/products.api';
import { Product } from '../../types';
import { Search, PackageX, Sparkles, X } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const doSearch = async () => {
      setIsLoading(true);
      const res = await productsApi.getProducts({
        search: query,
        limit: 48
      });
      if (res.success && res.data) {
        setProducts(res.data.products);
      }
      setIsLoading(false);
    };

    if (query) {
      doSearch();
    } else {
      setProducts([]);
      setIsLoading(false);
    }
  }, [query]);

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/store' },
            { label: 'Search Results' }
          ]}
        />

        {/* Search Query Header matching Fig 8.6 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-6 h-6 text-primary" />
              <span>Results for "{query}"</span>
            </h1>
            <p className="text-xs text-slate-500">
              Found <strong className="text-slate-800 dark:text-slate-200">{products.length}</strong> matching products
            </p>
          </div>

          {query && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Active filter:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-primary border border-blue-200 dark:border-blue-800">
                <span>"{query}"</span>
                <button
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="hover:text-rose-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Results Grid */}
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
          <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <PackageX className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No results found for "{query}"</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Please check your spelling or try searching with more general keywords such as "Headphones", "Shoes", or "Laptop".
            </p>
            <Link
              to="/products"
              className="mt-2 inline-block px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-blue-700 transition-colors"
            >
              Browse All Products
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
