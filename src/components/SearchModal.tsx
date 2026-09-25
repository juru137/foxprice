import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Star } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { formatUGX } from '@/src/lib/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onSelectProduct: (productId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.categoryName?.toLowerCase().includes(q)
        );
      })
    : products.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm transition-opacity font-sans">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-gray-100 dark:border-gray-800 flex items-center px-4 py-3.5 bg-gray-50 dark:bg-gray-800/60">
          <Search className="w-4 h-4 text-[#f68b1e] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Samsung, LG TVs, Air Fryers, Nike Sneakers in Uganda..."
            className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            {query.trim() ? `Search Results (${filtered.length})` : 'Popular Flash Searches in Uganda'}
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">
              No products found matching &quot;{query}&quot;. Try searching for &quot;Samsung&quot; or &quot;TV&quot;.
            </div>
          ) : (
            filtered.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  onSelectProduct(product.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#f8fafc] dark:bg-gray-900 overflow-hidden border border-gray-100 dark:border-gray-800 shrink-0 p-1 flex items-center justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#f68b1e] transition-colors line-clamp-1">
                      {product.title}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                      <span>{product.categoryName}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        <span>{product.rating}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs font-black text-gray-900 dark:text-white tabular-nums">
                    {formatUGX(product.price)}
                  </div>
                  <CornerDownLeft className="w-3.5 h-3.5 text-[#f68b1e] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between text-[11px] text-gray-400">
          <span>Official FoxPrice Uganda Search</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
