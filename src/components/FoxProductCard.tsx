import React from 'react';
import { Star, ShoppingCart, ShieldCheck, Zap } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { formatUGX } from '@/src/lib/formatters';

interface FoxProductCardProps {
  product: ProductItem;
  onSelect: (productId: string) => void;
  onQuickAdd: (product: ProductItem) => void;
  aiBadge?: string;
  aiReason?: string;
}

export const FoxProductCard: React.FC<FoxProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  aiBadge,
  aiReason,
}) => {
  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <article 
      className="group relative bg-white dark:bg-[#1a222d] rounded-2xl overflow-hidden shadow-xs hover:shadow-[0_16px_36px_rgba(246,139,30,0.14)] hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between cursor-pointer border border-gray-100/80 dark:border-gray-800/80 hover:border-transparent"
      onClick={() => onSelect(product.id)}
    >
      {/* Top badges: Discount & AI */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-[#f68b1e] text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm tracking-wide">
            -{discountPercent}%
          </span>
        )}
        {aiBadge && (
          <span className="bg-[#131921]/90 backdrop-blur-xs text-amber-300 border border-amber-400/40 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <Zap className="w-2.5 h-2.5 fill-amber-300" />
            {aiBadge}
          </span>
        )}
      </div>

      {/* Official store floating icon badge top right */}
      <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
        <span className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200/50">
          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Official</span>
        </span>
      </div>

      {/* Product Image Stage: neat fit with smooth scale hover animation */}
      <div className="relative w-full aspect-square bg-[#f8fafc] dark:bg-[#131a23] p-4 flex items-center justify-center overflow-hidden transition-colors">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full max-h-full max-w-full object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-110 drop-shadow-sm"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Low stock alert badge */}
        {product.inventoryCount <= 20 && (
          <div className="absolute bottom-2 left-2 z-10 bg-red-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            Only {product.inventoryCount} left in Kampala
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Category */}
          <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-between">
            <span className="truncate">{product.categoryName}</span>
            <span className="text-[10px] text-gray-400">Uganda Express</span>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-[#f68b1e] transition-colors leading-snug">
            {product.title}
          </h3>

          {/* AI Reason callout */}
          {aiReason && (
            <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium line-clamp-1 mt-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              💡 {aiReason}
            </p>
          )}

          {/* Star Rating & Reviews */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
              {product.rating}
            </span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing in Ugandan Shillings (UGX) & Add to Cart button */}
        <div className="pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex items-end justify-between gap-2">
          <div>
            <div className="text-sm sm:text-base font-black text-gray-900 dark:text-white tabular-nums tracking-tight">
              {formatUGX(product.price)}
            </div>
            {product.compareAtPrice && (
              <div className="text-[11px] line-through text-gray-400 tabular-nums">
                {formatUGX(product.compareAtPrice)}
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="flex items-center justify-center gap-1.5 bg-[#f68b1e] hover:bg-[#e07b16] active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            title="Add to shopping cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </article>
  );
};
