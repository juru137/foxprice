import React, { useState } from 'react';
import { 
  X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, 
  Tag, Truck, Smartphone, CheckCircle2 
} from 'lucide-react';
import { CartItem } from '@/lib/types';
import { formatUGX } from '@/src/lib/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, variantId: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, variantId?: string) => void;
  onProceedToCheckout: () => void;
  promoCode: string;
  onApplyPromo: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  promoCode,
  onApplyPromo,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 150000; // UGX 150,000

  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.variant ? item.variant.price : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const discount = (promoCode === 'FOXDEAL10' || promoCode === 'ARCHITECT10') ? subtotal * 0.1 : 0;
  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0;
  const shipping = isFreeDelivery ? 0 : 15000; // UGX 15,000 standard delivery
  const total = subtotal - discount + shipping;
  const deliveryProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = onApplyPromo(couponInput.trim().toUpperCase());
    if (success) {
      setPromoMessage({ text: 'Promo code FOXDEAL10 applied: 10% discount saved!', isError: false });
    } else {
      setPromoMessage({ text: 'Invalid promo code. Try code "FOXDEAL10"', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity font-sans animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#1a222d] border-l border-gray-200 dark:border-gray-800 h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-[#232f3e] text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight">Fox<span className="text-[#f68b1e]">Price</span> Cart</span>
              <span className="bg-[#f68b1e] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {items.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">Express dispatch across Uganda</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress in Uganda */}
        <div className="bg-orange-50 dark:bg-[#151c24] border-b border-orange-100 dark:border-gray-800 px-5 py-3">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#f68b1e]" />
              {isFreeDelivery ? (
                <span className="text-emerald-600 dark:text-emerald-400">🎉 FREE Delivery in Kampala unlocked!</span>
              ) : (
                <span>Add {formatUGX(FREE_SHIPPING_THRESHOLD - subtotal)} more for FREE Delivery</span>
              )}
            </span>
            <span className="text-[#f68b1e]">{deliveryProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#f68b1e] to-[#ff9900] h-full transition-all duration-500 rounded-full"
              style={{ width: `${deliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#f68b1e] flex items-center justify-center mx-auto text-2xl">
                🛒
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Your FoxPrice cart is empty</p>
                <p className="text-xs text-gray-500">Explore our mega flash deals on electronics, phones and appliances.</p>
              </div>
              <button
                onClick={onClose}
                className="bg-[#f68b1e] hover:bg-[#e07b16] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            items.map((item) => {
              const unitPrice = item.variant ? item.variant.price : item.product.price;
              const title = item.product.title;
              const variantTitle = item.variant?.title;
              const image = item.product.images[0];

              return (
                <div
                  key={`${item.productId}-${item.variantId || 'base'}`}
                  className="flex gap-3.5 p-3.5 bg-gray-50/70 dark:bg-[#151c24] border border-gray-100 dark:border-gray-800 rounded-xl"
                >
                  <div className="w-18 h-18 rounded-lg bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 p-1 flex items-center justify-center">
                    <img 
                      src={image} 
                      alt={title} 
                      className="max-h-full max-w-full object-contain" 
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
                          {title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.productId, item.variantId)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {variantTitle && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {variantTitle}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.variantId, -1)}
                          className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                          title="Reduce"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-gray-800 dark:text-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.variantId, 1)}
                          className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-gray-900 dark:text-white tabular-nums">
                        {formatUGX(unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout Module */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-[#151c24] space-y-4">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApply} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Promo Code (e.g. FOXDEAL10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 dark:text-white uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#f68b1e]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#232f3e] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                Apply
              </button>
            </form>

            {promoMessage && (
              <p className={`text-[11px] font-medium ${promoMessage.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                {promoMessage.text}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 pt-1">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white tabular-nums">{formatUGX(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Special Voucher (10%)</span>
                  <span className="tabular-nums">-{formatUGX(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping to Kampala</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase">FREE</span>
                  ) : (
                    formatUGX(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 text-sm font-black text-gray-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="text-[#f68b1e] text-base tabular-nums">{formatUGX(total)}</span>
              </div>
            </div>

            {/* Mobile Money Badges */}
            <div className="flex items-center justify-between text-[10px] text-gray-500 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-700 dark:text-gray-300">Accepted in Uganda:</span>
              <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-200">
                <span className="text-amber-500">🟡 MTN MoMo</span>
                <span className="text-red-500">🔴 Airtel Money</span>
                <span>💳 Visa</span>
              </div>
            </div>

            {/* Checkout Action CTA */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-[#f68b1e] hover:bg-[#e07b16] active:scale-98 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
