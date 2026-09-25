import React, { useState, useMemo } from 'react';
import { 
  Check, ShoppingCart, Zap, ShieldCheck, 
  Truck, ArrowRight, Sparkles, Clock, Flame, 
  Percent, ChevronRight, Award, Headphones, Smartphone, Tv
} from 'lucide-react';
import { 
  ProductItem, ProductVariant, OrderRecord, 
  OrderStatus, FilterState, CartItem, UserProfile, UserRole 
} from '@/lib/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CATEGORIES } from './data/mockData';
import { FoxHeader } from './components/FoxHeader';
import { FoxProductCard } from './components/FoxProductCard';
import { FoxProductDetailView } from './components/FoxProductDetailView';
import { FoxFilterSidebar } from './components/FoxFilterSidebar';
import { FoxAdminDashboardView } from './components/FoxAdminDashboardView';
import { FoxFooter } from './components/FoxFooter';
import { AdminProductNewView } from './components/AdminProductNewView';
import { AuthModal } from './components/AuthModal';
import { SecretAdminModal } from './components/SecretAdminModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { UserOrdersView } from './components/UserOrdersView';
import { generateAIRecommendations } from './lib/aiRecommendations';

export default function App() {
  // Database & Catalog State
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [categories] = useState(INITIAL_CATEGORIES);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'user_christopher',
    name: 'Christopher Juru',
    email: 'christopherjuru@gmail.com',
    role: 'ADMIN', // User is default administrator / owner
    authProvider: 'google',
    viewHistory: ['prod_phone_1', 'prod_tv_1'],
    createdAt: new Date().toISOString(),
  });

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('storefront');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod_phone_1');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Modals & Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSecretAdminModalOpen, setIsSecretAdminModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    {
      productId: 'prod_phone_1',
      variantId: 'v_phone_1',
      product: INITIAL_PRODUCTS[0],
      variant: INITIAL_PRODUCTS[0].variants[0],
      quantity: 1,
    }
  ]);
  const [promoCode, setPromoCode] = useState('FOXDEAL10');

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    minPrice: 50000,
    maxPrice: 6000000,
    minRating: 0,
    tags: [],
    inStockOnly: false,
    sortBy: 'featured',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Distinct tags list
  const allTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [products]);

  // Record viewing history for AI personalization
  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
    if (currentUser) {
      const nextHistory = [id, ...(currentUser.viewHistory || []).filter(h => h !== id)].slice(0, 10);
      setCurrentUser({ ...currentUser, viewHistory: nextHistory });
    }
  };

  // Filtered & Sorted Catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = (filters.searchQuery || searchQuery).toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.categoryName?.toLowerCase().includes(q);

      const matchesCat = filters.category === 'all' || p.categoryId === filters.category;
      const matchesPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
      const matchesRating = p.rating >= filters.minRating;
      const matchesStock = !filters.inStockOnly || p.inventoryCount > 0;
      const matchesTags =
        filters.tags.length === 0 || filters.tags.some((t) => p.tags.includes(t));

      return matchesSearch && matchesCat && matchesPrice && matchesRating && matchesStock && matchesTags;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [products, filters, searchQuery]);

  // AI Storefront Recommendations based on client view history
  const { recommendations: aiHeroRecs, insights: aiHeroInsights } = useMemo(() => {
    return generateAIRecommendations(
      null,
      currentUser?.viewHistory || ['prod_phone_1', 'prod_tv_1'],
      products,
      searchQuery
    );
  }, [currentUser, products, searchQuery]);

  // Cart operations
  const handleAddToCart = (product: ProductItem, variant?: ProductVariant, quantity: number = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === product.id && i.variantId === variant?.id
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { productId: product.id, variantId: variant?.id, product, variant, quantity }];
    });
    showToast(`Added ${quantity}x "${product.title}" to cart`);
  };

  const handleUpdateCartQuantity = (productId: string, variantId: string | undefined, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string, variantId?: string) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
  };

  const handleApplyPromo = (code: string): boolean => {
    if (code === 'FOXDEAL10' || code === 'ARCHITECT10') {
      setPromoCode('FOXDEAL10');
      return true;
    }
    return false;
  };

  const handleOrderCompleted = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    showToast(`Order ${newOrder.orderNumber} confirmed & queued for dispatch!`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              ...(trackingNumber ? { trackingNumber } : {}),
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );
    showToast(`Order status updated to ${status}`);
  };

  const handleProductCreated = (newProduct: ProductItem) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.title}" added to FoxPrice catalog!`);
    setCurrentView('admin-dashboard');
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0f141c] text-gray-100' : 'bg-[#f4f5f7] text-gray-900'} font-sans antialiased`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#131921] border border-[#f68b1e] text-white px-4 py-3 rounded-lg shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-[#f68b1e] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Jumia / Amazon Styled FoxPrice Header */}
      <FoxHeader
        currentView={currentView}
        onNavigate={(view, prodId) => {
          if (prodId) setSelectedProductId(prodId);
          setCurrentView(view);
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out of FoxPrice.');
        }}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onSearchSubmit={(e) => {
          e.preventDefault();
          setFilters((prev) => ({ ...prev, searchQuery }));
          setCurrentView('storefront');
        }}
        selectedCategory={filters.category}
        onSelectCategory={(catId) => {
          setFilters((prev) => ({ ...prev, category: catId }));
          setCurrentView('storefront');
        }}
        categories={categories}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenAdminSecret={() => setIsSecretAdminModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      {currentView === 'storefront' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-6">
          
          {/* Section 1: Hero Carousel & Jumia/Amazon Promo Banner */}
          <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#131921] via-[#232f3e] to-[#f68b1e] shadow-lg text-white">
            <div className="grid lg:grid-cols-12 items-center">
              
              <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-[#f68b1e] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  FOXPRICE MEGA BRAND FESTIVAL
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  Unbeatable Deals on <span className="text-[#f68b1e]">Official Brands</span> in Uganda
                </h1>

                <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
                  Shop genuine 5G smartphones, 4K Smart OLED TVs, athletic sneakers, and digital air fryers. Enjoy express 24h Kampala delivery and pay seamlessly with MTN MoMo, Airtel Money, or Cash on Delivery.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="#deals-grid"
                    className="bg-[#f68b1e] hover:bg-[#e07b16] text-white font-bold text-xs uppercase px-6 py-3 rounded-lg shadow transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Shop Flash Sales</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => {
                      setSelectedProductId('prod_phone_1');
                      setCurrentView('product-detail');
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold px-4 py-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Featured Galaxy S24 Ultra
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 p-4 sm:p-6 flex items-center justify-center">
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/20 aspect-[16/9] w-full">
                  <img
                    src="/src/assets/images/foxprice_deals_hero_1790375933912.jpg"
                    alt="FoxPrice Mega Sale Banner"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 right-2 bg-[#f68b1e] text-white px-3 py-1 rounded font-black text-xs shadow">
                    UP TO 70% OFF
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Section 2: Quick Features Bar (Fast Delivery, 100% Authentic, Secure Payment) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-[#f68b1e] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <h4 className="font-bold text-xs text-gray-900 dark:text-white">FoxPrice Express</h4>
                <p className="text-[11px] text-gray-500">Fast 24-48h Delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <h4 className="font-bold text-xs text-gray-900 dark:text-white">100% Authentic</h4>
                <p className="text-[11px] text-gray-500">Official Brand Warranty</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <h4 className="font-bold text-xs text-gray-900 dark:text-white">Flash Daily Deals</h4>
                <p className="text-[11px] text-gray-500">Exclusive App Discounts</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <h4 className="font-bold text-xs text-gray-900 dark:text-white">AI Powered Feed</h4>
                <p className="text-[11px] text-gray-500">Personalized for You</p>
              </div>
            </div>
          </div>

          {/* Section 3: AI Real-time Recommendations Strip (Client View personalized) */}
          <section className="bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    Recommended for You ({currentUser?.name || 'Guest'})
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Calculated by FoxPrice AI matching engine based on active dwell time and browsing activity
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline text-[11px] font-bold text-[#f68b1e] uppercase tracking-wider bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded">
                Personalized Algorithm
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {aiHeroRecs.map((recProd) => {
                const insight = aiHeroInsights.find((i) => i.productId === recProd.id);
                return (
                  <FoxProductCard
                    key={recProd.id}
                    product={recProd}
                    onSelect={handleSelectProduct}
                    onQuickAdd={(p) => handleAddToCart(p, p.variants[0], 1)}
                    aiBadge={insight?.badgeText}
                    aiReason={insight?.reason}
                  />
                );
              })}
            </div>
          </section>

          {/* Section 4: Main Catalogue Layout with Filter Sidebar (Jumia & Amazon Standard) */}
          <div id="deals-grid" className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Filter Sidebar with Price Slider & Categories */}
            <FoxFilterSidebar
              filters={filters}
              onUpdateFilters={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
              onResetFilters={() =>
                setFilters({
                  searchQuery: '',
                  category: 'all',
                  minPrice: 50000,
                  maxPrice: 6000000,
                  minRating: 0,
                  tags: [],
                  inStockOnly: false,
                  sortBy: 'featured',
                })
              }
              categories={categories}
              allTags={allTags}
              totalResults={filteredProducts.length}
            />

            {/* Products Grid with Sorting Header */}
            <div className="flex-1 w-full space-y-4">
              
              {/* Filter / Sort Bar */}
              <div className="bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <h2 className="font-bold text-sm text-gray-900 dark:text-white">
                    {filters.category === 'all' ? 'All Department Deals' : categories.find(c => c.id === filters.category)?.name}
                  </h2>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Showing {filteredProducts.length} verified products in Uganda
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Sort By:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="featured">Featured Deals</option>
                    <option value="price-asc">Price: Low to High (UGX)</option>
                    <option value="price-desc">Price: High to Low (UGX)</option>
                    <option value="rating">Highest Customer Rating</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>
              </div>

              {/* Product Cards Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center space-y-3 shadow-xs">
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    No products found matching your current filter criteria.
                  </p>
                  <p className="text-xs text-gray-500">
                    Try broadening your price cap or searching for &quot;Samsung&quot;, &quot;LG TV&quot;, &quot;Air Fryer&quot;, or &quot;Nike&quot;.
                  </p>
                  <button
                    onClick={() => setFilters({
                      searchQuery: '',
                      category: 'all',
                      minPrice: 50000,
                      maxPrice: 6000000,
                      minRating: 0,
                      tags: [],
                      inStockOnly: false,
                      sortBy: 'featured',
                    })}
                    className="text-xs bg-[#f68b1e] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#e07b16] cursor-pointer shadow-sm transition-all"
                  >
                    Reset Search & Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((prod) => (
                    <FoxProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={handleSelectProduct}
                      onQuickAdd={(p) => handleAddToCart(p, p.variants[0], 1)}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Section 5: Expanded Jumia/Amazon Uganda FoxFooter */}
          <FoxFooter
            onNavigate={(view) => setCurrentView(view)}
            onOpenAdminSecret={() => setIsSecretAdminModalOpen(true)}
          />
        </div>
      )}

      {/* Product Detail Page View */}
      {currentView === 'product-detail' && (
        <FoxProductDetailView
          product={selectedProduct}
          allProducts={products}
          viewHistory={currentUser?.viewHistory || []}
          onBack={() => setCurrentView('storefront')}
          onAddToCart={handleAddToCart}
          onInstantBuy={(p, v, q) => {
            handleAddToCart(p, v, q);
            setIsCheckoutOpen(true);
          }}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {/* Customer Orders & Telemetry View */}
      {currentView === 'orders' && (
        <UserOrdersView
          orders={orders}
          onBackToCatalog={() => setCurrentView('storefront')}
        />
      )}

      {/* Owner Restricted Admin Management View */}
      {currentView === 'admin-dashboard' && (
        <FoxAdminDashboardView
          orders={orders}
          products={products}
          currentUser={currentUser}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onNavigateNewProduct={() => setCurrentView('admin-product-new')}
          onExitAdmin={() => setCurrentView('storefront')}
        />
      )}

      {/* Admin Product Ingestion View */}
      {currentView === 'admin-product-new' && (
        <AdminProductNewView
          onBack={() => setCurrentView('admin-dashboard')}
          onProductCreated={handleProductCreated}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        promoCode={promoCode}
        onApplyPromo={handleApplyPromo}
      />

      {/* Multi-step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        promoCode={promoCode}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* User Login & Register (Google + Email Auth) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.name}!`);
        }}
      />

      {/* Owner Secret Access Gateway Modal */}
      <SecretAdminModal
        isOpen={isSecretAdminModalOpen}
        onClose={() => setIsSecretAdminModalOpen(false)}
        onUnlockSuccess={() => {
          setCurrentUser((prev) => prev ? { ...prev, role: 'ADMIN' } : {
            id: 'owner_user',
            name: 'Christopher Juru',
            email: 'christopherjuru@gmail.com',
            role: 'ADMIN',
            authProvider: 'google',
            viewHistory: [],
            createdAt: new Date().toISOString()
          });
          setCurrentView('admin-dashboard');
          showToast('Owner Authorization Verified. Admin Console Unlocked.');
        }}
      />

    </div>
  );
}
