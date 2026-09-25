import React from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { ProductItem } from '@/lib/types';

interface ProductCardProps {
  product: ProductItem;
  onSelect: (productId: string) => void;
  onQuickAdd: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
}) => {
  return (
    <article className="group flex flex-col bg-neutral-900/40 border border-neutral-900 hover:border-neutral-800 rounded-lg overflow-hidden transition-all duration-200">
      {/* 4:3 Image Container with single-elevation depth */}
      <div 
        onClick={() => onSelect(product.id)}
        className="relative aspect-[4/3] bg-neutral-900 overflow-hidden cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        
        {/* Subtle quick view affordance */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 p-2 rounded-md text-neutral-200">
          <Eye className="w-4 h-4" />
        </div>

        {/* Low inventory alert tag */}
        {product.inventoryCount <= 10 && (
          <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 px-2 py-1 rounded text-[10px] font-mono text-amber-400">
            {product.inventoryCount} in stock
          </div>
        )}
      </div>

      {/* Card Content with Zero-Pill Unboxed Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata with dot separators */}
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>{product.categoryName}</span>
            <div className="flex items-center gap-1 text-neutral-300">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(2)}</span>
            </div>
          </div>

          <h3 
            onClick={() => onSelect(product.id)}
            className="text-sm font-semibold text-neutral-100 group-hover:text-white transition-colors cursor-pointer line-clamp-1"
          >
            {product.title}
          </h3>

          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Bag */}
        <div className="pt-3 border-t border-neutral-900/80 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium font-mono tabular-nums text-neutral-100">
              ${product.price.toFixed(2)}
            </div>
            {product.compareAtPrice && (
              <div className="text-xs line-through text-neutral-600 font-mono tabular-nums">
                ${product.compareAtPrice.toFixed(2)}
              </div>
            )}
          </div>

          <button
            onClick={() => onQuickAdd(product)}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>
    </article>
  );
};
