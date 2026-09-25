import React from 'react';
import { 
  RotateCcw, Check, Star, SlidersHorizontal, 
  Sparkles, Zap, ShieldCheck, Tag
} from 'lucide-react';
import { FilterState, ProductCategory } from '@/lib/types';
import { formatUGX, formatShortUGX } from '@/src/lib/formatters';

interface FoxFilterSidebarProps {
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  categories: ProductCategory[];
  allTags: string[];
  totalResults: number;
}

export const FoxFilterSidebar: React.FC<FoxFilterSidebarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  categories,
  allTags,
  totalResults,
}) => {
  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-6 shadow-xs h-fit text-xs font-sans">
      
      {/* Title & Reset */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#f68b1e]" />
            <span>Filters</span>
          </h3>
          <span className="text-[11px] text-gray-500">{totalResults} products found</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[#f68b1e] hover:underline font-semibold text-[11px] cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Category Selection */}
      <div className="space-y-2.5">
        <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
          Categories
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onUpdateFilters({ category: cat.id })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                filters.category === cat.id
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-[#f68b1e] font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span>{cat.name}</span>
              {filters.category === cat.id && <Check className="w-3.5 h-3.5 text-[#f68b1e]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter Slider in UGX */}
      <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
            Price Range (UGX)
          </h4>
          <span className="font-black text-[#f68b1e] tabular-nums text-[11px]">
            {formatShortUGX(filters.minPrice)} – {formatShortUGX(filters.maxPrice)}
          </span>
        </div>
        
        <input
          type="range"
          min="50000"
          max="6000000"
          step="50000"
          value={filters.maxPrice}
          onChange={(e) => onUpdateFilters({ maxPrice: Number(e.target.value) })}
          className="w-full accent-[#f68b1e] bg-gray-200 dark:bg-gray-700 h-1.5 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>Min: UGX 50K</span>
          <span>Max: UGX 6.0M</span>
        </div>

        {/* Quick UGX Price Buttons */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={() => onUpdateFilters({ minPrice: 50000, maxPrice: 300000 })}
            className="py-1 px-2 text-[10px] rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#f68b1e] hover:text-[#f68b1e] cursor-pointer"
          >
            Under 300K
          </button>
          <button
            onClick={() => onUpdateFilters({ minPrice: 300000, maxPrice: 1000000 })}
            className="py-1 px-2 text-[10px] rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#f68b1e] hover:text-[#f68b1e] cursor-pointer"
          >
            300K – 1.0M
          </button>
          <button
            onClick={() => onUpdateFilters({ minPrice: 1000000, maxPrice: 3500000 })}
            className="py-1 px-2 text-[10px] rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#f68b1e] hover:text-[#f68b1e] cursor-pointer"
          >
            1.0M – 3.5M
          </button>
          <button
            onClick={() => onUpdateFilters({ minPrice: 3500000, maxPrice: 6000000 })}
            className="py-1 px-2 text-[10px] rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#f68b1e] hover:text-[#f68b1e] cursor-pointer"
          >
            3.5M & Above
          </button>
        </div>
      </div>

      {/* Customer Ratings Filter */}
      <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
          Customer Ratings
        </h4>
        <div className="space-y-1">
          {[
            { val: 4.8, label: '4.8 Stars & Up' },
            { val: 4.5, label: '4.5 Stars & Up' },
            { val: 4.0, label: '4.0 Stars & Up' },
            { val: 0, label: 'All Ratings' },
          ].map((r) => (
            <button
              key={r.val}
              onClick={() => onUpdateFilters({ minRating: r.val })}
              className={`w-full text-left px-2 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs ${
                filters.minRating === r.val
                  ? 'text-[#f68b1e] font-bold bg-orange-50/50 dark:bg-orange-950/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      r.val > 0 && i < Math.floor(r.val)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px]">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* In-Stock & Verified Filter */}
      <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
          Availability & Service
        </h4>
        <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onUpdateFilters({ inStockOnly: e.target.checked })}
            className="w-3.5 h-3.5 accent-[#f68b1e] rounded"
          />
          <span>In Kampala Warehouse Only</span>
        </label>
      </div>

      {/* Product Tags / Brands */}
      {allTags.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
            Tags & Deals
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {allTags.slice(0, 8).map((tag) => {
              const isSelected = filters.tags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => {
                    const next = isSelected
                      ? filters.tags.filter((t) => t !== tag)
                      : [...filters.tags, tag];
                    onUpdateFilters({ tags: next });
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#f68b1e] text-white font-bold'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Trust & Guarantee Callout */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 rounded-xl p-3 text-emerald-800 dark:text-emerald-300 text-[11px] space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Buyer Protection Uganda</span>
        </div>
        <p className="text-[10px] text-gray-600 dark:text-gray-400">
          All orders eligible for money-back refund & free returns in Kampala.
        </p>
      </div>

    </aside>
  );
};
