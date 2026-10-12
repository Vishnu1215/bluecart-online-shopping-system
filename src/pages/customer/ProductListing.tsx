import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { ProductCard } from '../../components/product/ProductCard';
import { FilterPanel } from '../../components/product/FilterPanel';
import { Pagination } from '../../components/ui/Pagination';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { productsApi } from '../../api/products.api';
import { Product } from '../../types';
import { SlidersHorizontal, ArrowUpDown, Search, PackageX } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export const ProductListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters from query or defaults
  const category = searchParams.get('category') || 'All';
  const sort = (searchParams.get('sort') || 'popularity') as any;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const minPrice = parseInt(searchParams.get('minPrice') || '0', 10);
  const maxPrice = parseInt(searchParams.get('maxPrice') || '100000', 10);
  const minRating = parseFloat(searchParams.get('minRating') || '0');
  const inStockOnly = searchParams.get('inStock') === 'true';

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchFiltered = async () => {
      setIsLoading(true);
      const res = await productsApi.getProducts({
        category: category !== 'All' ? category : undefined,
        minPrice,
        maxPrice,
        minRating,
        inStockOnly,
        sortBy: sort,
        page,
        limit: 12
      });

      if (res.success && res.data) {
        setProducts(res.data.products);
        setTotalCount(res.data.total);
        setTotalPages(res.data.totalPages);
      }
      setIsLoading(false);
    };

    fetchFiltered();
  }, [category, sort, page, minPrice, maxPrice, minRating, inStockOnly]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'All' || value === '0') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1'); // reset page on filter change
    setSearchParams(next);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Home', path: '/store' }, { label: 'All Products' }]} />

        {/* Header & Controls Strip matching Fig 8.4 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {category !== 'All' ? `${category} Products` : 'All Products'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing <strong className="text-slate-800 dark:text-slate-200">{products.length}</strong> of{' '}
              <strong className="text-slate-800 dark:text-slate-200">{totalCount}</strong> products
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sort}
                onChange={e => updateParam('sort', e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="popularity">Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Layout: Sidebar Filter + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Panel */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20">
              <FilterPanel
                selectedCategory={category}
                onSelectCategory={cat => updateParam('category', cat)}
                priceRange={[minPrice, maxPrice]}
                onPriceChange={([min, max]) => {
                  const next = new URLSearchParams(searchParams);
                  next.set('minPrice', min.toString());
                  next.set('maxPrice', max.toString());
                  next.set('page', '1');
                  setSearchParams(next);
                }}
                minRating={minRating}
                onRatingChange={r => updateParam('minRating', r.toString())}
                inStockOnly={inStockOnly}
                onInStockChange={stk => updateParam('inStock', stk ? 'true' : null)}
                onResetFilters={handleReset}
              />
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-8">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 space-y-3">
                    <Skeleton className="h-44 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full rounded-md" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <PackageX className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No products match your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting the category, price range, or rating filters to see more results.
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-blue-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {products.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center pt-6">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={newPage => {
                        const next = new URLSearchParams(searchParams);
                        next.set('page', newPage.toString());
                        setSearchParams(next);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};
