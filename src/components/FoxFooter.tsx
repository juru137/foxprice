import React, { useState } from 'react';
import { 
  ShieldCheck, RotateCcw, Truck, Smartphone, Headphones, 
  Mail, ArrowRight, CheckCircle2, Lock, Heart, MapPin, 
  Phone, HelpCircle, ExternalLink, Award
} from 'lucide-react';

interface FoxFooterProps {
  onNavigate: (view: string) => void;
  onOpenAdminSecret: () => void;
}

export const FoxFooter: React.FC<FoxFooterProps> = ({
  onNavigate,
  onOpenAdminSecret,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      setEmailInput('');
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  const deliveryTowns = [
    'Kampala', 'Entebbe', 'Jinja', 'Mbarara', 'Gulu', 
    'Arua', 'Masaka', 'Fort Portal', 'Mbale', 'Mukono', 
    'Wakiso', 'Kasese', 'Hoima', 'Lira', 'Kabale', 'Soroti'
  ];

  return (
    <footer className="mt-16 text-gray-300 font-sans space-y-8">
      
      {/* 1. Top Trust Badges Bar (Jumia / Amazon Style) */}
      <div className="bg-white dark:bg-[#1a222d] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-[#f68b1e] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">100% Authentic</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Sourced directly from verified brands with warranty</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">7-Day Free Returns</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Doorstep pickup in Kampala & Entebbe</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">MTN & Airtel MoMo</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Instant zero-fee secure mobile money checkout</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">Express Delivery</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Door-to-door transit across all Ugandan districts</p>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">24/7 Local Support</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Call & WhatsApp: +256 700 123 456</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Expanded Dark Footer Container */}
      <div className="bg-[#232f3e] text-gray-300 rounded-3xl p-8 sm:p-12 space-y-10 shadow-xl border border-gray-800">
        
        {/* Newsletter & Brand Intro Row */}
        <div className="grid lg:grid-cols-12 gap-8 items-center pb-8 border-b border-gray-700/80">
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">
                Fox<span className="text-[#f68b1e]">Price</span>
              </span>
              <span className="bg-[#f68b1e] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Uganda
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-lg leading-relaxed">
              Uganda&apos;s leading online shopping destination for authentic electronics, smartphones, 4K TVs, home appliances, and fashion. Enjoy unbeatably low prices, lightning-fast Kampala delivery, and genuine manufacturer warranties.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Subscribe to FoxPrice Deals Club
            </h4>
            <p className="text-[11px] text-gray-400">
              Get secret flash coupons, weekend discounts, and price drop notifications directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-[#131921] border border-gray-700 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f68b1e]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#f68b1e] hover:bg-[#e07b16] active:scale-98 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0"
              >
                Join
              </button>
            </form>
            {isSubscribed && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Welcome to FoxPrice Deals Club! Check your inbox for your 10% coupon code.
              </p>
            )}
          </div>
        </div>

        {/* 4 Detailed Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          
          {/* Column 1: About FoxPrice */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-gray-700/60 pb-1.5">
              About FoxPrice Uganda
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us & Our Mission</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers & Rider Logistics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Official Brand Stores</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Black Friday Kampala 2026</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions of Sale</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy & Data Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability Commitments</a></li>
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-gray-700/60 pb-1.5">
              Customer Support
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center & FAQs</a></li>
              <li><button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors cursor-pointer text-left">Track Your Package</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Delivery Timelines & Rates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">7-Day Free Returns Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How to Shop on FoxPrice</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dispute Resolution Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bulk & Corporate Purchases</a></li>
            </ul>
          </div>

          {/* Column 3: Sell on FoxPrice */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-gray-700/60 pb-1.5">
              Sell on FoxPrice
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Become a Verified Seller</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seller Center Login</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FoxPrice Delivery Partner Hub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Affiliate Creator Program</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Advertise on FoxPrice</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Warehouse Fulfillment (FBFP)</a></li>
              <li>
                <button 
                  onClick={onOpenAdminSecret}
                  className="text-[#f68b1e] hover:underline font-bold cursor-pointer flex items-center gap-1 mt-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Owner Admin Gateway</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Popular Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-gray-700/60 pb-1.5">
              Popular in Uganda
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Smartphones & 5G Tablets</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LG & Samsung 4K OLED TVs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Air Fryers & Blenders</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nike Athletic Sneakers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Laptops & PC Accessories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sony Noise Cancelling Audio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Solar Inverters & Batteries</a></li>
            </ul>
          </div>

        </div>

        {/* 3. Delivery Coverage in Uganda Bar */}
        <div className="pt-6 border-t border-gray-700/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-gray-300 font-bold">
            <MapPin className="w-4 h-4 text-[#f68b1e]" />
            <span>Nationwide Delivery Coverage Across Uganda:</span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
            {deliveryTowns.map((town, i) => (
              <span key={town} className="flex items-center gap-2">
                <span className="hover:text-white transition-colors">{town}</span>
                {i < deliveryTowns.length - 1 && <span className="text-gray-600">·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Payment Badges & Social Media Handles */}
        <div className="pt-6 border-t border-gray-700/80 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Payment Badges */}
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Accepted Payment Methods in Uganda:
            </span>
            <div className="flex items-center gap-2.5 flex-wrap justify-center md:justify-start">
              <span className="bg-[#131921] px-2.5 py-1.5 rounded-lg border border-gray-700 text-xs font-bold text-amber-400 flex items-center gap-1.5 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffcc00]"></span>
                MTN MoMo
              </span>
              <span className="bg-[#131921] px-2.5 py-1.5 rounded-lg border border-gray-700 text-xs font-bold text-red-400 flex items-center gap-1.5 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                Airtel Money
              </span>
              <span className="bg-[#131921] px-2.5 py-1.5 rounded-lg border border-gray-700 text-xs font-bold text-blue-400 shadow-xs">
                💳 Visa
              </span>
              <span className="bg-[#131921] px-2.5 py-1.5 rounded-lg border border-gray-700 text-xs font-bold text-orange-400 shadow-xs">
                Mastercard
              </span>
              <span className="bg-[#131921] px-2.5 py-1.5 rounded-lg border border-gray-700 text-xs font-bold text-emerald-400 shadow-xs">
                💵 Cash on Delivery
              </span>
            </div>
          </div>

          {/* Social Media Handles */}
          <div className="space-y-2 text-center md:text-right">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Connect With Us:
            </span>
            <div className="flex items-center gap-2 justify-center md:justify-end">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#131921] border border-gray-700 hover:border-[#f68b1e] hover:text-[#f68b1e] flex items-center justify-center text-xs font-bold transition-all shadow-xs"
                title="Facebook @FoxPriceUG"
              >
                FB
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#131921] border border-gray-700 hover:border-[#f68b1e] hover:text-[#f68b1e] flex items-center justify-center text-xs font-bold transition-all shadow-xs"
                title="X / Twitter @FoxPriceUG"
              >
                𝕏
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#131921] border border-gray-700 hover:border-[#f68b1e] hover:text-[#f68b1e] flex items-center justify-center text-xs font-bold transition-all shadow-xs"
                title="Instagram @foxprice_ug"
              >
                IG
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#131921] border border-gray-700 hover:border-[#f68b1e] hover:text-[#f68b1e] flex items-center justify-center text-xs font-bold transition-all shadow-xs"
                title="TikTok @foxpriceuganda"
              >
                TT
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#131921] border border-gray-700 hover:border-[#f68b1e] hover:text-[#f68b1e] flex items-center justify-center text-xs font-bold transition-all shadow-xs"
                title="YouTube @FoxPriceUganda"
              >
                YT
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/50 hover:bg-emerald-600 text-emerald-300 hover:text-white flex items-center gap-1 text-[11px] font-bold transition-all shadow-xs"
                title="WhatsApp Hotline"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* 5. Bottom Copyright, Registration & Legal */}
        <div className="pt-6 border-t border-gray-700/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            <span>© 2026 FoxPrice Marketplace (Uganda) Ltd. All rights reserved.</span>
            <span className="block sm:inline sm:ml-2 text-gray-500">
              URSB Reg: 80029314 · TIN: 1019482914 · Course View Towers, Plot 21 Yusuf Lule Road, Kampala, Uganda.
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <span>·</span>
            <a href="#" className="hover:text-white">Cookie Preferences</a>
          </div>
        </div>

      </div>

    </footer>
  );
};
