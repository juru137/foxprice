import React, { useState } from 'react';
import { 
  ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, 
  Check, Heart, Plus, Minus, ShoppingCart, Zap, 
  MapPin, Clock, Sparkles, ChevronLeft, ChevronRight,
  PhoneCall, Smartphone
} from 'lucide-react';
import { ProductItem, ProductVariant } from '@/lib/types';
import { generateAIRecommendations } from '@/lib/aiRecommendations';
import { formatUGX } from '@/src/lib/formatters';
import { FoxProductCard } from './FoxProductCard';

interface FoxProductDetailViewProps {
  product: ProductItem;
  allProducts: ProductItem[];
  viewHistory: string[];
  onBack: () => void;
  onAddToCart: (product: ProductItem, variant: ProductVariant | undefined, quantity: number) => void;
  onInstantBuy: (product: ProductItem, variant: ProductVariant | undefined, quantity: number) => void;
  onSelectProduct: (productId: string) => void;
}

export const FoxProductDetailView: React.FC<FoxProductDetailViewProps> = ({
  product,
  allProducts,
  viewHistory,
  onBack,
  onAddToCart,
  onInstantBuy,
  onSelectProduct,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Guarantee at least 4 images for the 4 bottom thumbnail slider
  const galleryImages = React.useMemo(() => {
    const list = [...(product.images || [])];
    while (list.length < 4) {
      list.push(product.images[0] || '/src/assets/images/foxprice_deals_hero_1790375933912.jpg');
    }
    return list.slice(0, 4);
  }, [product.images]);

  const activeVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const comparePrice = activeVariant?.compareAtPrice || product.compareAtPrice;
  const currentStock = activeVariant ? activeVariant.inventoryCount : product.inventoryCount;
  const discountPercent = comparePrice ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100) : 0;
  const savings = comparePrice ? comparePrice - currentPrice : 0;

  // Slide navigation handlers
  const handlePrevImage = () => {
    setSlideDirection('left');
    setSelectedImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSlideDirection('right');
    setSelectedImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleSelectThumbnail = (index: number) => {
    setSlideDirection(index > selectedImageIndex ? 'right' : 'left');
    setSelectedImageIndex(index);
  };

  // Real-time AI recommendations based on currently viewed item
  const { recommendations, insights } = generateAIRecommendations(
    product.id,
    viewHistory,
    allProducts
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 font-sans">
      {/* Breadcrumb row */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2 truncate">
          <button 
            onClick={onBack} 
            className="hover:text-[#f68b1e] cursor-pointer flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Deals
          </button>
          <span>/</span>
          <span className="hover:text-[#f68b1e] cursor-pointer">{product.categoryName}</span>
          <span>/</span>
          <span className="text-gray-800 dark:text-gray-200 font-medium truncate max-w-xs">{product.title}</span>
        </div>

        {/* Uganda Free Delivery indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/50">
          <Truck className="w-3.5 h-3.5" />
          <span>Express Delivery to Kampala & Entebbe</span>
        </div>
      </div>

      {/* Main PDP Grid (Amazon / Jumia High Conversion 3-Column Module) */}
      <div className="grid lg:grid-cols-12 gap-8 bg-white dark:bg-[#1a222d] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        
        {/* Gallery Column (5 cols) with 4 smaller images on bottom and smooth slide main preview */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Slide Frame */}
          <div className="relative aspect-square bg-[#f8fafc] dark:bg-[#131a23] rounded-2xl p-6 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-800/80 group">
            
            {/* Discount Badge */}
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-20 bg-[#f68b1e] text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                SAVE {discountPercent}%
              </span>
            )}

            {/* Slide Index Pill */}
            <span className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-full">
              {selectedImageIndex + 1} / {galleryImages.length}
            </span>

            {/* Slide Left Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-3 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-[#f68b1e] hover:text-white shadow-md flex items-center justify-center text-gray-700 dark:text-gray-200 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Sliding Image */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                key={selectedImageIndex}
                src={galleryImages[selectedImageIndex]}
                alt={`${product.title} angle ${selectedImageIndex + 1}`}
                className="max-h-full max-w-full object-contain transition-all duration-300 ease-out transform animate-in fade-in zoom-in-95 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Slide Right Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-3 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-[#f68b1e] hover:text-white shadow-md flex items-center justify-center text-gray-700 dark:text-gray-200 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Four Images on Bottom (Smaller Thumbnails for Sliding) */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Product Angles & Views (Click to Slide):
            </span>
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectThumbnail(idx)}
                  className={`relative aspect-square rounded-xl p-2 bg-[#f8fafc] dark:bg-[#131a23] overflow-hidden transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    selectedImageIndex === idx
                      ? 'border-2 border-[#f68b1e] ring-4 ring-[#f68b1e]/15 shadow-md scale-102 bg-white'
                      : 'border border-gray-200 dark:border-gray-800 hover:border-gray-400 opacity-70 hover:opacity-100'
                  }`}
                  title={`View angle ${idx + 1}`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className="max-h-full max-w-full object-contain transition-transform hover:scale-110" 
                  />
                  {selectedImageIndex === idx && (
                    <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#f68b1e]"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Authentic FoxPrice Guarantee for Uganda */}
          <div className="bg-orange-50/50 dark:bg-[#151c24] rounded-xl p-4 border border-orange-100 dark:border-gray-800 space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-[#f68b1e]" />
              <span>100% Genuine Guaranteed in Uganda</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Brand new, sealed in original factory box with manufacturer warranty. Eligible for 7-day free returns in Kampala & Entebbe.
            </p>
          </div>
        </div>

        {/* Center Product Details & Variant Configuration (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-[#f68b1e] uppercase tracking-wider">
                Official Store · {product.categoryName}
              </span>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <span className="text-[11px] text-gray-500 font-mono">SKU: {product.sku}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Ratings & reviews badge */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-gray-800 dark:text-gray-200">{product.rating}</span>
            <span className="text-gray-400">|</span>
            <span className="text-[#f68b1e] hover:underline cursor-pointer font-medium">
              {product.reviewCount} customer reviews
            </span>
          </div>

          {/* Price Block in Ugandan Shillings (UGX) */}
          <div className="p-4 bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-xl space-y-1.5">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-[#f68b1e] tabular-nums tracking-tight">
                {formatUGX(currentPrice)}
              </span>
              {comparePrice && (
                <span className="text-sm sm:text-base line-through text-gray-400 tabular-nums">
                  {formatUGX(comparePrice)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                You save {formatUGX(savings)} ({discountPercent}% OFF)
              </div>
            )}
            <p className="text-[11px] text-gray-500 dark:text-gray-400 pt-1 border-t border-orange-100 dark:border-orange-950/60">
              All prices include Uganda Value Added Tax (VAT 18%). Zero hidden import charges.
            </p>
          </div>

          {/* Variants Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
                Select Option / Model:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      selectedVariantId === v.id
                        ? 'border-[#f68b1e] bg-orange-50/40 dark:bg-orange-950/30 text-gray-900 dark:text-white font-bold ring-2 ring-[#f68b1e]/20'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <span>{v.title}</span>
                    <span className="font-black tabular-nums text-[#f68b1e]">
                      {formatUGX(v.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description Prose */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Product Specifications & Overview</h4>
            <p>{product.description}</p>
          </div>
        </div>

        {/* Buy Box Column (Amazon style right-rail buy box) (3 cols) */}
        <div className="lg:col-span-3 bg-gray-50/80 dark:bg-[#151c24] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-4 h-fit">
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Order Subtotal:</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white tabular-nums tracking-tight">
              {formatUGX(currentPrice * quantity)}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>In Stock ({currentStock} ready in Kampala warehouse)</span>
            </div>
          </div>

          {/* Delivery & Uganda Mobile Money Highlights */}
          <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 pt-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-[#f68b1e] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 dark:text-white">FoxPrice Express Uganda</span>
                <p className="text-[11px] text-gray-500">Delivery in 3 to 24 hours across Kampala & Entebbe.</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 dark:text-white">MTN MoMo & Airtel Money</span>
                <p className="text-[11px] text-gray-500">Zero transaction fees on Mobile Money checkout.</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <RotateCcw className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 dark:text-white">7-Day Free Returns</span>
                <p className="text-[11px] text-gray-500">Hassle-free return policy if item is not as expected.</p>
              </div>
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Quantity:</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-9 text-center text-xs font-bold text-gray-900 dark:text-gray-100">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action CTAs: Jumia Orange + Amazon Yellow */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => onAddToCart(product, activeVariant, quantity)}
              className="w-full bg-[#f68b1e] hover:bg-[#e07b16] active:scale-98 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => onInstantBuy(product, activeVariant, quantity)}
              className="w-full bg-[#ffa41c] hover:bg-[#fa8900] active:scale-98 text-gray-900 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-gray-900" />
              <span>Buy with Mobile Money</span>
            </button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-full py-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isWishlisted
                  ? 'border-red-200 bg-red-50 text-red-600'
                  : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
              <span>{isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white dark:bg-[#1a222d] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Customer Verified Reviews ({product.reviews?.length || 0})
            </h3>
            <p className="text-xs text-gray-500">Verified buyer feedback from Kampala, Jinja, and Entebbe</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-amber-500">{product.rating}</span>
            <div className="text-xs text-gray-500">out of 5 stars</div>
          </div>
        </div>

        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-gray-50/70 dark:bg-[#151c24] rounded-xl space-y-2 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">{rev.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">No written reviews yet for this model.</p>
          )}
        </div>
      </div>

      {/* AI Contextual Recommendations Bar */}
      {recommendations.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f68b1e]" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Customers Who Viewed This Also Bought
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                Personalized recommendations calculated from real-time customer browsing synergy in Uganda
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendations.map((recProd) => {
              const insight = insights.find((i) => i.productId === recProd.id);
              return (
                <FoxProductCard
                  key={recProd.id}
                  product={recProd}
                  onSelect={onSelectProduct}
                  onQuickAdd={(p) => onAddToCart(p, p.variants[0], 1)}
                  aiBadge={insight?.badgeText}
                  aiReason={insight?.reason}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
