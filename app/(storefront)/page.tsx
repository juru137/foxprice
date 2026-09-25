'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, SlidersHorizontal, ArrowRight, Star, 
  Check, ShoppingBag, Eye, ShieldCheck, Truck, RefreshCw
} from 'lucide-react';
import { ProductItem } from '@/lib/types';

// Mock initial data matching Prisma & DB specifications
const SAMPLE_PRODUCTS: ProductItem[] = [
  {
    id: 'prod_1',
    title: 'KINETIC Studio Machined Keyboard',
    slug: 'kinetic-studio-machined-keyboard',
    description: 'Precision CNC-milled 6063 aerospace aluminum case with custom tuned tactile switches, seamless brass weight, and hot-swappable PCB.',
    price: 349.00,
    compareAtPrice: 399.00,
    inventoryCount: 14,
    trackQuantity: true,
    isPublished: true,
    images: ['/src/assets/images/product_keyboard_1790375116724.jpg'],
    tags: ['Mechanical', 'Machined', 'Limited Edition'],
    rating: 4.9,
    reviewCount: 42,
    categoryId: 'cat_hardware',
    categoryName: 'Hardware & Workspaces',
    variants: [
      { id: 'v1', productId: 'prod_1', title: 'Matte Graphite / Tactile Slate', sku: 'KB-6063-GR', price: 349.00, inventoryCount: 8, attributes: { finish: 'Graphite', switch: 'Tactile' } },
      { id: 'v2', productId: 'prod_1', title: 'Anodized Silver / Linear Silent', sku: 'KB-6063-SV', price: 349.00, inventoryCount: 6, attributes: { finish: 'Silver', switch: 'Linear' } }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_2',
    title: 'Precision Acoustic Studio Over-Ears',
    slug: 'precision-acoustic-studio-over-ears',
    description: 'Bespoke 50mm beryllium drivers, memory foam lambskin pads, and balanced analog amplification. Tuned for reference audio production.',
    price: 489.00,
    compareAtPrice: 549.00,
    inventoryCount: 22,
    trackQuantity: true,
    isPublished: true,
    images: ['/src/assets/images/product_headphones_1790375126300.jpg'],
    tags: ['Audio', 'Audiophile', 'Acoustic'],
    rating: 4.95,
    reviewCount: 68,
    categoryId: 'cat_audio',
    categoryName: 'Acoustics & Audio',
    variants: [
      { id: 'v3', productId: 'prod_2', title: 'Gunmetal / Charcoal Leather', sku: 'HP-50BE-GM', price: 489.00, inventoryCount: 14, attributes: { color: 'Gunmetal' } },
      { id: 'v4', productId: 'prod_2', title: 'Brushed Titanium / Raw Leather', sku: 'HP-50BE-TI', price: 529.00, inventoryCount: 8, attributes: { color: 'Titanium' } }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_3',
    title: 'Architectural Pour-Over Stoneware Carafe',
    slug: 'architectural-pour-over-stoneware-carafe',
    description: 'Hand-thrown high-fired stoneware with precision laser-etched stainless mesh extraction cone. Double-walled thermal retention.',
    price: 128.00,
    inventoryCount: 31,
    trackQuantity: true,
    isPublished: true,
    images: ['/src/assets/images/product_carafe_1790375136673.jpg'],
    tags: ['Ceramics', 'Craft', 'Kitchen'],
    rating: 4.88,
    reviewCount: 31,
    categoryId: 'cat_ceramics',
    categoryName: 'Objects & Rituals',
    variants: [
      { id: 'v5', productId: 'prod_3', title: 'Raw Sandstone Matte', sku: 'CF-750-SD', price: 128.00, inventoryCount: 19, attributes: { material: 'Sandstone' } },
      { id: 'v6', productId: 'prod_3', title: 'Obsidian Glaze', sku: 'CF-750-OB', price: 138.00, inventoryCount: 12, attributes: { material: 'Obsidian' } }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export default function StorefrontPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [quickAddNotice, setQuickAddNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Artifacts' },
    { id: 'cat_hardware', label: 'Hardware & Workspaces' },
    { id: 'cat_audio', label: 'Acoustics & Audio' },
    { id: 'cat_ceramics', label: 'Objects & Rituals' }
  ];

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy]);

  const handleQuickAdd = (product: ProductItem) => {
    setQuickAddNotice(`Added "${product.title}" to bag`);
    setTimeout(() => setQuickAddNotice(null), 2400);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-neutral-800">
      {/* Toast Notice */}
      {quickAddNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-neutral-900 border border-neutral-800 text-neutral-100 px-4 py-3 rounded-lg shadow-2xl text-xs font-medium tracking-wide">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{quickAddNotice}</span>
        </div>
      )}

      {/* Top 1-row Navigation */}
      <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="text-base font-semibold tracking-wider uppercase text-neutral-100 hover:text-white transition-colors">
            KINETIC
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-400">
            <Link href="#collection" className="hover:text-neutral-100 transition-colors">Curated Catalog</Link>
            <Link href="#craftsmanship" className="hover:text-neutral-100 transition-colors">Engineering & Craft</Link>
            <Link href="/admin/dashboard" className="hover:text-amber-400 transition-colors">Admin Console</Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="w-full bg-neutral-900/90 border border-neutral-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>
            <Link
              href="/checkout"
              className="flex items-center gap-2 bg-neutral-100 hover:bg-white text-neutral-950 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative border-b border-neutral-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
              Series 04 · Autumn Specification
            </div>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-neutral-100 leading-[1.15]" style={{ textWrap: 'balance' }}>
              Tools of exceptional discipline and permanence.
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 max-w-lg leading-relaxed">
              Designed without ornamental compromise. Solid billet materials, mechanical precision, and tactile acoustic balance for rigorous daily practice.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <a
                href="#collection"
                className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-white text-neutral-950 px-5 py-2.5 rounded-md text-xs font-semibold transition-colors"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-xs text-neutral-500 font-mono">
                Global Express Dispatch · Carbon Neutral
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-lg overflow-hidden border border-neutral-800/80 bg-neutral-900 aspect-[16/9] shadow-2xl">
              <img
                src="/src/assets/images/hero_workspace_1790375105346.jpg"
                alt="Minimalist architectural workstation"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-neutral-300 backdrop-blur-md bg-neutral-950/60 px-3 py-2 rounded border border-neutral-800/60">
                <span className="font-mono">Featured: Studio Rig 01</span>
                <span>In-Stock Ready for Shipment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Bar */}
      <main id="collection" className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-neutral-900">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-100">
              Curated Production Run
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 font-mono">
              <span>{filteredProducts.length} artifacts available</span>
              <span aria-hidden="true">·</span>
              <span>Direct factory warranty</span>
            </div>
          </div>

          {/* Interactive filter segmented control */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedCategory === c.id
                      ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-md px-3 py-2 focus:outline-none focus:border-neutral-700"
              >
                <option value="featured">Featured Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col bg-neutral-900/50 border border-neutral-900 hover:border-neutral-800 rounded-lg overflow-hidden transition-all duration-200"
            >
              {/* Image Frame */}
              <Link href={`/products/${product.id}`} className="relative aspect-[4/3] bg-neutral-900 overflow-hidden block">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 p-2 rounded-md text-neutral-200">
                  <Eye className="w-4 h-4" />
                </div>
              </Link>

              {/* Card Meta & Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                    <span>{product.categoryName}</span>
                    <span className="flex items-center gap-1 text-neutral-300">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating.toFixed(2)}</span>
                    </span>
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm font-semibold text-neutral-100 group-hover:text-white transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-900/80 flex items-center justify-between">
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
                    onClick={() => handleQuickAdd(product)}
                    className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Craftsmanship & Architectural Rigor Section */}
      <section id="craftsmanship" className="border-t border-neutral-900 bg-neutral-900/20 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-widest text-neutral-500 font-mono">
              Engineering Guarantee
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-100 mt-2">
              Built for lifetime utility, not disposable cycles.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-neutral-900 bg-neutral-950/60 space-y-3">
              <ShieldCheck className="w-5 h-5 text-neutral-300" />
              <h3 className="text-sm font-semibold text-neutral-200">5-Year Structural Integrity</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Every chassis and hardware enclosure is machined with sub-millimeter tolerances and covered by a direct manufacturer replacement guarantee.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-neutral-900 bg-neutral-950/60 space-y-3">
              <Truck className="w-5 h-5 text-neutral-300" />
              <h3 className="text-sm font-semibold text-neutral-200">Tracked Express Logistics</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Insured international air transit with real-time telemetry updates and tamper-evident packaging dispatched within 24 hours.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-neutral-900 bg-neutral-950/60 space-y-3">
              <RefreshCw className="w-5 h-5 text-neutral-300" />
              <h3 className="text-sm font-semibold text-neutral-200">30-Day Studio Trial</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Test any mechanical tool or acoustic equipment in your personal workflow. Hassle-free prepaid returns if it fails to meet your standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-neutral-300">KINETIC</span>
            <span>·</span>
            <span>Architectural Commerce Engine</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
            <Link href="/admin/dashboard" className="text-neutral-400 hover:text-amber-400 transition-colors">Admin Gateway</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
