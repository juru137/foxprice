import React from 'react';
import { 
  Search, ShoppingBag, Sun, Moon, Shield, 
  UserCheck, SlidersHorizontal, Package
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, productId?: string) => void;
  userRole: UserRole;
  onToggleRole: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  userRole,
  onToggleRole,
  cartCount,
  onOpenCart,
  onOpenSearch,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/85 dark:bg-neutral-950/85 backdrop-blur-md border-b border-neutral-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Single Wordmark Element */}
        <button
          onClick={() => onNavigate('storefront')}
          className="text-base font-semibold tracking-wider uppercase text-neutral-100 hover:text-white transition-colors cursor-pointer text-left"
        >
          KINETIC
        </button>

        {/* Zone 2: Clean Text Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-400">
          <button
            onClick={() => onNavigate('storefront')}
            className={`transition-colors cursor-pointer ${
              currentView === 'storefront' ? 'text-neutral-100 font-semibold' : 'hover:text-neutral-200'
            }`}
          >
            Curated Catalog
          </button>
          
          <button
            onClick={() => onNavigate('orders')}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentView === 'orders' ? 'text-neutral-100 font-semibold' : 'hover:text-neutral-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders & Tracking</span>
          </button>

          <button
            onClick={() => onNavigate('admin-dashboard')}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentView.startsWith('admin') ? 'text-amber-400 font-semibold' : 'hover:text-amber-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-500/80" />
            <span>Admin Console</span>
          </button>
        </nav>

        {/* Zone 3: Functional Interactive Actions */}
        <div className="flex items-center gap-2.5">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 bg-neutral-900/90 hover:bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer"
            title="Search catalog (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search artifacts...</span>
            <kbd className="hidden lg:inline text-[10px] font-mono text-neutral-500 bg-neutral-950 px-1 rounded border border-neutral-800">
              ⌘K
            </kbd>
          </button>

          {/* RBAC Role Switcher */}
          <button
            onClick={onToggleRole}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
              userRole === 'ADMIN'
                ? 'bg-amber-950/30 border-amber-900/60 text-amber-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Toggle between Customer and Admin role"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{userRole}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-neutral-100 hover:bg-white text-neutral-950 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer relative"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
            {cartCount > 0 && (
              <span className="bg-neutral-900 text-neutral-100 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
