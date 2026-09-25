import React from 'react';
import { X, RotateCcw, Check, Star } from 'lucide-react';
import { FilterState, ProductCategory } from '@/lib/types';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  categories: ProductCategory[];
  allTags: string[];
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
  categories,
  allTags,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/70 backdrop-blur-xs transition-opacity">
      <div 
        className="w-full max-w-md bg-neutral-950 border-l border-neutral-900 h-full flex flex-col shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-900 flex items-center justify-between sticky top-0 bg-neutral-950/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-sm font-semibold text-neutral-100 uppercase tracking-wider font-mono">
              Attribute Filters
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">Refine specifications & collection parameters</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-6 space-y-8 flex-1">
          {/* Category Filter */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
              Category
            </label>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onUpdateFilters({ category: cat.id })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors cursor-pointer text-left ${
                    filters.category === cat.id
                      ? 'bg-neutral-900 text-neutral-100 font-medium border border-neutral-800'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  {filters.category === cat.id && <Check className="w-3.5 h-3.5 text-neutral-200" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
                Price Cap
              </label>
              <span className="text-xs font-mono tabular-nums text-neutral-200">
                ${filters.minPrice} – ${filters.maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="700"
              step="25"
              value={filters.maxPrice}
              onChange={(e) => onUpdateFilters({ maxPrice: Number(e.target.value) })}
              className="w-full accent-neutral-200 bg-neutral-900 h-1.5 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>$50</span>
              <span>$350</span>
              <span>$700</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
              Minimum Rating
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 4.0, 4.5, 4.8].map((rating) => (
                <button
                  key={rating}
                  onClick={() => onUpdateFilters({ minRating: rating })}
                  className={`py-1.5 px-2 rounded border text-xs font-mono transition-colors cursor-pointer ${
                    filters.minRating === rating
                      ? 'bg-neutral-900 border-neutral-700 text-neutral-100'
                      : 'border-neutral-900 text-neutral-400 hover:border-neutral-800'
                  }`}
                >
                  {rating === 0 ? 'All' : `${rating}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Only Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-b border-neutral-900">
            <div>
              <span className="text-xs font-medium text-neutral-200 block">In-Stock Artifacts Only</span>
              <span className="text-[11px] text-neutral-500">Hide units in assembly or pre-order</span>
            </div>
            <button
              onClick={() => onUpdateFilters({ inStockOnly: !filters.inStockOnly })}
              className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                filters.inStockOnly ? 'bg-neutral-200' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-neutral-950 absolute top-1 transition-transform ${
                  filters.inStockOnly ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
              Material & Spec Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const isSelected = filters.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      const newTags = isSelected
                        ? filters.tags.filter((t) => t !== tag)
                        : [...filters.tags, tag];
                      onUpdateFilters({ tags: newTags });
                    }}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-800 text-neutral-100 border border-neutral-700 font-medium'
                        : 'bg-neutral-900/60 text-neutral-400 border border-neutral-900 hover:border-neutral-800'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-neutral-900 bg-neutral-950 flex items-center gap-3">
          <button
            onClick={onResetFilters}
            className="flex items-center justify-center gap-2 p-2.5 rounded-md border border-neutral-800 text-neutral-400 hover:text-white text-xs transition-colors cursor-pointer"
            title="Reset all filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold py-2.5 rounded-md text-xs transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
