import React from 'react';
import { ProductCategory } from '../../types';
import { Star, Filter, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  onResetFilters: () => void;
}

const allCategories: ProductCategory[] = [
  'Audio', 'Mobiles', 'Computers', 'Wearables', 'Footwear', 'Cameras', 'Bags'
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange,
  inStockOnly,
  onInStockChange,
  onResetFilters
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[10px] border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <Filter className="w-4 h-4 text-primary" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category selection */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
          Category
        </h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-primary">
            <input
              type="radio"
              name="filter_cat"
              checked={selectedCategory === 'All'}
              onChange={() => onSelectCategory('All')}
              className="text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <span>All Categories</span>
          </label>
          {allCategories.map(cat => (
            <label key={cat} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-primary">
              <input
                type="radio"
                name="filter_cat"
                checked={selectedCategory === cat}
                onChange={() => onSelectCategory(cat)}
                className="text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Price Range
          </h4>
          <span className="text-xs font-semibold text-primary">
            ₹{priceRange[0].toLocaleString('en-IN')} – ₹{priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={100000}
          step={500}
          value={priceRange[1]}
          onChange={e => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-primary h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
          <span>₹500</span>
          <span>₹1,00,000+</span>
        </div>
      </div>

      {/* Customer Rating */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
          Customer Rating
        </h4>
        <div className="space-y-2">
          {[4, 3, 0].map(ratingVal => (
            <label key={ratingVal} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-primary">
              <input
                type="radio"
                name="filter_rating"
                checked={minRating === ratingVal}
                onChange={() => onRatingChange(ratingVal)}
                className="text-primary focus:ring-primary h-3.5 w-3.5"
              />
              {ratingVal > 0 ? (
                <span className="flex items-center gap-1 font-medium">
                  {ratingVal}★ & above
                  <span className="text-amber-400 flex items-center">
                    {Array.from({ length: ratingVal }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </span>
                </span>
              ) : (
                <span>All Ratings</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* In-Stock Only */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            In-Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => onInStockChange(e.target.checked)}
            className="rounded text-primary focus:ring-primary h-4 w-4"
          />
        </label>
      </div>
    </div>
  );
};
