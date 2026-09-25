'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Star, Shield, Truck, RotateCcw, 
  Check, Heart, Share2, Plus, Minus, ShoppingBag
} from 'lucide-react';
import { ProductItem } from '@/lib/types';

// Mock product item for deep detail view
const DETAILED_PRODUCT: ProductItem = {
  id: 'prod_1',
  title: 'KINETIC Studio Machined Keyboard',
  slug: 'kinetic-studio-machined-keyboard',
  description: `Precision CNC-milled 6063 aerospace-grade aluminum chassis featuring a bead-blasted and anodized satin finish. Integrated with a solid raw brass internal sound-dampening weight, custom-lubricated tactile mechanical switches, and seamless gasket-mount architecture for an extraordinary acoustic signature.

Engineered with low-latency wired USB-C connectivity, QMK/VIA programmable firmware compatibility, and hot-swappable switches allowing effortless switch replacement without soldering.`,
  price: 349.00,
  compareAtPrice: 399.00,
  inventoryCount: 14,
  trackQuantity: true,
  isPublished: true,
  images: [
    '/src/assets/images/product_keyboard_1790375116724.jpg',
    '/src/assets/images/hero_workspace_1790375105346.jpg'
  ],
  tags: ['Mechanical', 'Machined', 'Limited Edition', 'QMK/VIA'],
  rating: 4.92,
  reviewCount: 48,
  categoryId: 'cat_hardware',
  categoryName: 'Hardware & Workspaces',
  variants: [
    {
      id: 'v1',
      productId: 'prod_1',
      title: 'Matte Graphite / Tactile Slate Switches',
      sku: 'KB-6063-GR-TAC',
      price: 349.00,
      inventoryCount: 8,
      attributes: { finish: 'Matte Graphite', switch: 'Tactile Slate (62g)' }
    },
    {
      id: 'v2',
      productId: 'prod_1',
      title: 'Anodized Silver / Linear Silent Switches',
      sku: 'KB-6063-SV-LIN',
      price: 349.00,
      inventoryCount: 6,
      attributes: { finish: 'Anodized Silver', switch: 'Linear Silent (45g)' }
    }
  ],
  reviews: [
    {
      id: 'rev_1',
      productId: 'prod_1',
      userId: 'u_1',
      userName: 'Marcus Vance',
      rating: 5,
      title: 'Unrivaled acoustic depth and machining tolerance',
      comment: 'The acoustic profile is deep, clock-like, and wonderfully resonant without case pinging. Heavy brass bottom ensures zero desk movement. A true heirloom tool.',
      verifiedPurchase: true,
      createdAt: '2026-09-12T14:32:00Z'
    },
    {
      id: 'rev_2',
      productId: 'prod_1',
      userId: 'u_2',
      userName: 'Elena Rostova',
      rating: 5,
      title: 'Replaced all three of my workspace setups',
      comment: 'The QMK layer mapping coupled with the tactile switches has noticeably reduced hand fatigue during long software drafting sessions.',
      verifiedPurchase: true,
      createdAt: '2026-09-04T09:15:00Z'
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function ProductDetailPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(DETAILED_PRODUCT.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const activeVariant = DETAILED_PRODUCT.variants.find(v => v.id === selectedVariantId) || DETAILED_PRODUCT.variants[0];

  const handleAddToCart = () => {
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-neutral-800">
      {/* Toast Feedback */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-neutral-900 border border-neutral-800 text-neutral-100 px-4 py-3 rounded-lg shadow-2xl text-xs font-medium">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Added {quantity}x &quot;{DETAILED_PRODUCT.title} - {activeVariant.title}&quot; to bag</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Curated Collection</span>
          </Link>

          <Link href="/" className="text-sm font-semibold tracking-wider uppercase text-neutral-200">
            KINETIC
          </Link>

          <Link
            href="/checkout"
            className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag (1)</span>
          </Link>
        </div>
      </header>

      {/* Product View Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-neutral-900 bg-neutral-900 shadow-xl">
              <img
                src={DETAILED_PRODUCT.images[selectedImageIndex]}
                alt={DETAILED_PRODUCT.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail selector */}
            <div className="flex items-center gap-3">
              {DETAILED_PRODUCT.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border transition-all ${
                    selectedImageIndex === idx
                      ? 'border-neutral-200 opacity-100 ring-2 ring-neutral-700'
                      : 'border-neutral-900 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Product Story / Material Integrity */}
            <div className="pt-10 border-t border-neutral-900 space-y-4 text-xs text-neutral-400 leading-relaxed">
              <h3 className="text-sm font-semibold text-neutral-200">Material Specification</h3>
              <ul className="space-y-2 list-disc list-inside font-mono text-neutral-400">
                <li>Chassis: 5-axis CNC-milled 6063 aerospace aluminum billet</li>
                <li>Weight: 1.82 kg with raw polished brass internal sound bar</li>
                <li>Mounting: Poron gasket dampeners with FR4 flex-cut plate</li>
                <li>Keycaps: Double-shot PBT thermal sublimated profile</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-mono">
                  {DETAILED_PRODUCT.categoryName}
                </span>
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {activeVariant.inventoryCount} units remaining
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-100">
                {DETAILED_PRODUCT.title}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <div className="text-xl font-semibold font-mono tabular-nums text-neutral-100">
                  ${activeVariant.price.toFixed(2)}
                </div>
                {DETAILED_PRODUCT.compareAtPrice && (
                  <div className="text-sm line-through text-neutral-600 font-mono tabular-nums">
                    ${DETAILED_PRODUCT.compareAtPrice.toFixed(2)}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-neutral-400 ml-auto font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{DETAILED_PRODUCT.rating.toFixed(2)}</span>
                  <span>({DETAILED_PRODUCT.reviewCount})</span>
                </div>
              </div>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs text-neutral-400 leading-relaxed whitespace-pre-line border-t border-neutral-900 pt-4">
              {DETAILED_PRODUCT.description}
            </p>

            {/* Variant Selectors */}
            <div className="space-y-4 border-t border-neutral-900 pt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block">
                Select Finish & Switches
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {DETAILED_PRODUCT.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`flex items-center justify-between p-3.5 rounded-md border text-left text-xs transition-colors ${
                      selectedVariantId === variant.id
                        ? 'border-neutral-200 bg-neutral-900 text-neutral-100'
                        : 'border-neutral-900 bg-neutral-950/40 text-neutral-400 hover:border-neutral-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-neutral-200">{variant.title}</div>
                      <div className="text-neutral-500 font-mono text-[11px] mt-0.5">SKU: {variant.sku}</div>
                    </div>
                    <div className="font-mono tabular-nums font-medium text-neutral-300">
                      ${variant.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Buy Action */}
            <div className="space-y-3 pt-4 border-t border-neutral-900">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-800 bg-neutral-900 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-neutral-400 hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-medium text-neutral-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(activeVariant.inventoryCount, quantity + 1))}
                    className="p-2.5 text-neutral-400 hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-neutral-100 hover:bg-white text-neutral-950 px-5 py-3 rounded-md text-xs font-semibold transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag · ${(activeVariant.price * quantity).toFixed(2)}</span>
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-md border transition-colors ${
                    isWishlisted
                      ? 'border-red-900/60 bg-red-950/20 text-red-400'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-400' : ''}`} />
                </button>
              </div>

              <Link
                href="/checkout"
                className="w-full block text-center bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 py-2.5 rounded-md text-xs font-medium transition-colors"
              >
                Instant Checkout with Express Dispatch
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-neutral-900 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-500" />
                <span>Air Dispatch in 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-neutral-500" />
                <span>30-Day Hassle-Free Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-neutral-500" />
                <span>5-Year Billet Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-neutral-500" />
                <span>Direct Serial Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-20 pt-12 border-t border-neutral-900">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold text-neutral-100">
                Verified Owner Reviews
              </h2>
              <p className="text-xs text-neutral-500 mt-1 font-mono">
                Rated {DETAILED_PRODUCT.rating} out of 5 from {DETAILED_PRODUCT.reviewCount} customer deliveries
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {DETAILED_PRODUCT.reviews?.map((review) => (
              <div key={review.id} className="p-6 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-neutral-200">{review.userName}</div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                  <Check className="w-3 h-3" />
                  <span>Verified Purchase</span>
                </div>
                <h4 className="text-xs font-semibold text-neutral-100">{review.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
