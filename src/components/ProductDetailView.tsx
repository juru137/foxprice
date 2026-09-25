import React, { useState } from 'react';
import { 
  ArrowLeft, Star, Shield, Truck, RotateCcw, 
  Check, Heart, Plus, Minus, ShoppingBag, Share2 
} from 'lucide-react';
import { ProductItem, ProductVariant } from '@/lib/types';

interface ProductDetailViewProps {
  product: ProductItem;
  onBack: () => void;
  onAddToCart: (product: ProductItem, variant: ProductVariant | undefined, quantity: number) => void;
  onInstantCheckout: (product: ProductItem, variant: ProductVariant | undefined, quantity: number) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onAddToCart,
  onInstantCheckout,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'shipping'>('specs');

  const activeVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentStock = activeVariant ? activeVariant.inventoryCount : product.inventoryCount;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Catalog</span>
      </button>

      {/* Main Grid: Gallery & Purchase Module */}
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-neutral-900 bg-neutral-900 shadow-2xl">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden border transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-neutral-200 ring-2 ring-neutral-700 opacity-100'
                      : 'border-neutral-900 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Product view" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Tabs for Specifications & Reviews */}
          <div className="pt-10 border-t border-neutral-900 space-y-6">
            <div className="flex items-center gap-6 border-b border-neutral-900 pb-3 text-xs font-mono">
              <button
                onClick={() => setActiveTab('specs')}
                className={`transition-colors cursor-pointer ${
                  activeTab === 'specs' ? 'text-neutral-100 font-semibold border-b-2 border-neutral-100 pb-3 -mb-3.5' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Technical Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`transition-colors cursor-pointer ${
                  activeTab === 'reviews' ? 'text-neutral-100 font-semibold border-b-2 border-neutral-100 pb-3 -mb-3.5' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Verified Reviews ({product.reviews?.length || product.reviewCount})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`transition-colors cursor-pointer ${
                  activeTab === 'shipping' ? 'text-neutral-100 font-semibold border-b-2 border-neutral-100 pb-3 -mb-3.5' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Dispatch & Warranty
              </button>
            </div>

            {activeTab === 'specs' && (
              <div className="space-y-3 text-xs text-neutral-400 font-mono leading-relaxed">
                <div className="flex justify-between py-2 border-b border-neutral-900">
                  <span className="text-neutral-500">Master SKU</span>
                  <span className="text-neutral-200">{product.sku || 'KIN-STD-001'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-900">
                  <span className="text-neutral-500">Material Purity</span>
                  <span className="text-neutral-200">Aerospace Grade 6063-T6 / High-fired Stoneware</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-900">
                  <span className="text-neutral-500">Machining Tolerance</span>
                  <span className="text-neutral-200">±0.015mm CNC Continuous 5-Axis</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-neutral-500">Packaging</span>
                  <span className="text-neutral-200">100% Recycled Rigid Kraft with Custom Molded Foam</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-lg bg-neutral-900/40 border border-neutral-900 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-200">{rev.userName}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                        <Check className="w-3 h-3" />
                        <span>Verified Customer Dispatch</span>
                      </div>
                      <h4 className="font-medium text-neutral-200">{rev.title}</h4>
                      <p className="text-neutral-400 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 font-mono">No reviews recorded yet for this batch.</p>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 text-xs text-neutral-400 leading-relaxed">
                <p>
                  Every piece is hand-inspected in our workshop and sealed in tamper-evident anti-static barrier wrapping.
                </p>
                <p>
                  Orders dispatch within 24 hours via DHL Express Worldwide or FedEx Priority Air.
                  Complimentary worldwide shipping is automatically applied to orders exceeding $300.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500 uppercase tracking-wider">{product.categoryName}</span>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {currentStock} units remaining
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-100">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="text-2xl font-semibold font-mono tabular-nums text-neutral-100">
                ${currentPrice.toFixed(2)}
              </div>
              {product.compareAtPrice && (
                <div className="text-sm line-through text-neutral-600 font-mono tabular-nums">
                  ${product.compareAtPrice.toFixed(2)}
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-neutral-400 ml-auto font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(2)}</span>
                <span>({product.reviewCount})</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-900 pt-4">
            {product.description}
          </p>

          {/* Dynamic Variant Selection Matrix */}
          {product.variants.length > 0 && (
            <div className="space-y-3 border-t border-neutral-900 pt-4">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
                Select Finish & Configuration
              </label>
              <div className="space-y-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-md border text-left text-xs transition-colors cursor-pointer ${
                      selectedVariantId === v.id
                        ? 'border-neutral-200 bg-neutral-900 text-neutral-100'
                        : 'border-neutral-900 bg-neutral-950/40 text-neutral-400 hover:border-neutral-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-neutral-200">{v.title}</div>
                      <div className="text-neutral-500 font-mono text-[11px] mt-0.5">SKU: {v.sku}</div>
                    </div>
                    <div className="font-mono tabular-nums text-neutral-200 font-medium">
                      ${v.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls & Purchase Buttons */}
          <div className="space-y-3 pt-4 border-t border-neutral-900">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-neutral-800 bg-neutral-900 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-mono font-medium text-neutral-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="p-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => onAddToCart(product, activeVariant, quantity)}
                className="flex-1 flex items-center justify-center gap-2 bg-neutral-100 hover:bg-white text-neutral-950 px-5 py-3 rounded-md text-xs font-semibold transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag · ${(currentPrice * quantity).toFixed(2)}</span>
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-md border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-red-900/60 bg-red-950/20 text-red-400'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
                title="Save artifact to wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-400' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => onInstantCheckout(product, activeVariant, quantity)}
              className="w-full text-center bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
            >
              Express Checkout with 1-Click Dispatch
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-neutral-900 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-neutral-500" />
              <span>Express Insured Air Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-neutral-500" />
              <span>30-Day Studio Return Right</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neutral-500" />
              <span>5-Year Billet Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-neutral-500" />
              <span>Numbered Production Run</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
