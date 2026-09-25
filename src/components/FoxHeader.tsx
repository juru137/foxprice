import React, { useState } from 'react';
import { 
  Search, ShoppingCart, User, Heart, HelpCircle, 
  Menu, ShieldCheck, ChevronDown, Sparkles, MapPin, 
  Zap, Lock, LogOut, Sun, Moon
} from 'lucide-react';
import { UserProfile, UserRole, ProductCategory } from '@/lib/types';

interface FoxHeaderProps {
  currentView: string;
  onNavigate: (view: string, productId?: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  categories: ProductCategory[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAdminSecret: () => void;
}

export const FoxHeader: React.FC<FoxHeaderProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  onSelectCategory,
  categories,
  isDarkMode,
  onToggleTheme,
  onOpenAdminSecret,
}) => {
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);

  // Secret Easter Egg / Discreet Admin click trigger
  const handleFoxLogoClick = () => {
    onNavigate('storefront');
    setAdminClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        onOpenAdminSecret();
        return 0;
      }
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md font-sans">
      {/* Top Banner Stripe - Amazon & Jumia promotional ribbon */}
      <div className="bg-[#131921] text-gray-300 text-[11px] py-1 px-4 sm:px-6 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-4">
          <span className="text-[#f68b1e] font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 fill-[#f68b1e]" />
            FLASH SALES LIVE: UP TO 70% OFF ON SMARTPHONES & TVS
          </span>
          <span className="hidden md:inline text-gray-500">|</span>
          <span className="hidden md:inline text-gray-300">
            🚚 Free Express Delivery in Kampala on orders over UGX 150,000
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button 
            onClick={() => onNavigate('orders')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Track My Order
          </button>
          <span>|</span>
          <div className="flex items-center gap-1 text-gray-300">
            <MapPin className="w-3 h-3 text-[#f68b1e]" />
            <span className="hidden sm:inline">Deliver to: </span>
            <span className="font-semibold text-white">Kampala, Uganda 🇺🇬</span>
          </div>
          <span>|</span>
          <span className="hidden sm:inline text-amber-400 font-bold font-mono">UGX</span>
          <span className="hidden sm:inline">|</span>
          {/* Subtle dark mode toggle */}
          <button 
            onClick={onToggleTheme} 
            className="hover:text-white transition-colors cursor-pointer"
            title="Toggle Night Mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Bar: Amazon Navy / Jumia Vibrant Accent Bar */}
      <div className="bg-[#232f3e] text-white px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo with 5-click hidden admin trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleFoxLogoClick}
              className="flex items-center gap-1.5 text-left cursor-pointer group"
              title="FoxPrice Online Shopping (Click 5x for Admin Gateway)"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#e07b16] to-[#ff9900] flex items-center justify-center font-black text-white text-lg shadow-sm group-hover:scale-105 transition-transform">
                🦊
              </div>
              <div>
                <span className="font-black text-2xl tracking-tighter text-white">
                  Fox<span className="text-[#f68b1e]">Price</span>
                </span>
                <span className="hidden sm:block text-[9px] text-[#ff9900] tracking-widest font-bold uppercase -mt-1">
                  OFFICIAL DEALS
                </span>
              </div>
            </button>
          </div>

          {/* Central High-Conversion Search Bar (Amazon/Jumia Form) */}
          <form 
            onSubmit={onSearchSubmit}
            className="flex-1 max-w-2xl flex items-center h-10 rounded-md overflow-hidden bg-white shadow-inner focus-within:ring-2 focus-within:ring-[#f68b1e]"
          >
            {/* Category Dropdown Pill */}
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="hidden lg:block bg-gray-100 text-gray-800 text-xs px-2.5 py-2.5 border-r border-gray-300 focus:outline-none cursor-pointer h-full font-medium"
            >
              <option value="all">All Departments</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Keyword Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products, brands, models, electronics and categories..."
              className="flex-1 px-3.5 text-xs text-gray-900 placeholder:text-gray-500 focus:outline-none h-full"
            />

            {/* Orange Action Search Button */}
            <button
              type="submit"
              className="bg-[#f68b1e] hover:bg-[#e07b16] active:bg-[#c96c0e] text-white px-5 h-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* User Account & Actions Menu */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-xs">
            
            {/* Account Profile / Login Button */}
            <div className="relative">
              {currentUser ? (
                <div 
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded hover:bg-gray-800/80 cursor-pointer text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-[#f68b1e] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden md:block leading-tight">
                    <span className="text-[10px] text-gray-400 block">Hello,</span>
                    <span className="font-bold text-white max-w-[90px] truncate block">
                      {currentUser.name}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 p-1.5 rounded hover:bg-gray-800/80 cursor-pointer text-left"
                >
                  <User className="w-4 h-4 text-[#f68b1e]" />
                  <div className="leading-tight">
                    <span className="text-[10px] text-gray-400 block">Sign In</span>
                    <span className="font-bold text-white hidden sm:block">Account & Orders</span>
                  </div>
                </button>
              )}

              {/* Account Dropdown Menu */}
              {accountDropdownOpen && currentUser && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setAccountDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold uppercase">
                      {currentUser.role} · {currentUser.authProvider}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('orders');
                      setAccountDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
                  >
                    <PackageIcon className="w-3.5 h-3.5 text-gray-500" />
                    <span>My Orders & Invoices</span>
                  </button>

                  {currentUser.role === 'ADMIN' && (
                    <button
                      onClick={() => {
                        onNavigate('admin-dashboard');
                        setAccountDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-[#f68b1e] font-bold cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Admin Management Console</span>
                    </button>
                  )}

                  <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setAccountDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Orders Quick Link */}
            <button
              onClick={() => onNavigate('orders')}
              className="hidden lg:flex flex-col text-left p-1 rounded hover:bg-gray-800/80 cursor-pointer"
            >
              <span className="text-[10px] text-gray-400">Returns</span>
              <span className="font-bold text-white">& Orders</span>
            </button>

            {/* Shopping Cart with Jumia/Amazon Badge */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 bg-[#f68b1e] hover:bg-[#e07b16] text-white px-3 sm:px-4 py-1.5 rounded-md font-bold text-xs transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#131921] text-white border-2 border-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-black">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Category Ribbon (Amazon style mega-departments) */}
      <div className="bg-[#1a222d] text-gray-200 px-4 sm:px-6 py-1.5 border-b border-gray-800 text-xs flex items-center gap-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onSelectCategory('all')}
          className="flex items-center gap-1.5 font-bold text-white hover:text-[#f68b1e] transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-4 h-4" />
          <span>All Departments</span>
        </button>

        {categories.filter(c => c.id !== 'all').map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`transition-colors shrink-0 cursor-pointer ${
              selectedCategory === cat.id ? 'text-[#f68b1e] font-bold' : 'text-gray-300 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}

        <div className="ml-auto hidden xl:flex items-center gap-4 text-xs font-semibold text-[#f68b1e] shrink-0">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Smart Recommendations Active
          </span>
        </div>
      </div>
    </header>
  );
};

function PackageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  );
}
