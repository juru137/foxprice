import React, { useState } from 'react';
import { 
  X, Check, Lock, CreditCard, ShieldCheck, 
  Truck, ArrowRight, ArrowLeft, Download, CheckCircle2,
  Smartphone, Banknote, Building2, MapPin, AlertCircle, Phone
} from 'lucide-react';
import { CartItem, OrderRecord, ShippingAddress, PaymentMethod } from '@/lib/types';
import { formatUGX } from '@/src/lib/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  promoCode: string;
  onOrderCompleted: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  promoCode,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'ussd_pending' | 'confirmation'>('shipping');

  // Uganda Shipping Form State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: 'Christopher Vance Juru',
    email: 'christopherjuru@gmail.com',
    phone: '+256 772 489 120',
    street: 'Plot 12, Prince Charles Drive, Kololo',
    apartment: 'Floor 3, Apt 4B',
    city: 'Kampala',
    state: 'Central Region',
    postalCode: '25601',
    country: 'Uganda',
  });

  const [deliverySpeed, setDeliverySpeed] = useState<'express' | 'standard'>('express');
  const [deliveryNote, setDeliveryNote] = useState('Call before arrival. Close to Total Energies station.');

  // Payment Method Selection
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('MTN_MOMO');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('0772489120');
  const [airtelNumber, setAirtelNumber] = useState('0701984210');
  
  // Card state fallback
  const [cardData, setCardData] = useState({
    cardNumber: '•••• •••• •••• 4242',
    expDate: '10/28',
    cvc: '741',
    nameOnCard: 'Christopher V. Juru',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 150000;
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.variant ? item.variant.price : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const discount = (promoCode === 'FOXDEAL10' || promoCode === 'ARCHITECT10') ? subtotal * 0.1 : 0;
  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeDelivery ? 0 : 15000;
  const total = subtotal - discount + shipping;

  const handleValidateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!shippingAddress.fullName.trim()) errors.fullName = 'Full name is required';
    if (!shippingAddress.email.trim() || !shippingAddress.email.includes('@')) errors.email = 'Valid email is required';
    if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 9) errors.phone = 'Valid phone number required for delivery rider';
    if (!shippingAddress.street.trim()) errors.street = 'Street or delivery landmark is required';
    if (!shippingAddress.city.trim()) errors.city = 'City/Town is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStep('payment');
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (selectedMethod === 'MTN_MOMO' || selectedMethod === 'AIRTEL_MONEY') {
      setStep('ussd_pending');
      // Simulate real-world USSD Push Prompt delay
      await new Promise((r) => setTimeout(r, 2200));
    } else {
      await new Promise((r) => setTimeout(r, 1200));
    }

    const orderNumber = `FOX-UG-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `FX-KLA-${Math.floor(100000 + Math.random() * 900000)}`;
    const activePhone = selectedMethod === 'MTN_MOMO' ? mobileMoneyNumber : (selectedMethod === 'AIRTEL_MONEY' ? airtelNumber : shippingAddress.phone);
    const txId = selectedMethod === 'MTN_MOMO' 
      ? `MOMO-UG-${Math.floor(100000 + Math.random() * 900000)}` 
      : selectedMethod === 'AIRTEL_MONEY' 
      ? `AIRTEL-UG-${Math.floor(100000 + Math.random() * 900000)}`
      : undefined;

    const newOrder: OrderRecord = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerEmail: shippingAddress.email,
      customerName: shippingAddress.fullName,
      shippingAddress,
      subtotal,
      discountAmount: discount,
      shippingAmount: shipping,
      taxAmount: 0,
      totalAmount: total,
      status: selectedMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PROCESSING',
      paymentStatus: selectedMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
      paymentMethod: selectedMethod,
      mobileMoneyNumber: activePhone,
      mobileMoneyTxId: txId,
      carrier: 'FoxPrice Express Uganda',
      trackingNumber,
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      notes: deliveryNote,
      items: items.map((i) => ({
        id: `item_${Math.random().toString(36).substring(2, 8)}`,
        productId: i.productId,
        productTitle: i.product.title,
        productImage: i.product.images[0],
        variantId: i.variantId,
        variantTitle: i.variant?.title,
        quantity: i.quantity,
        unitPrice: i.variant ? i.variant.price : i.product.price,
        subtotal: (i.variant ? i.variant.price : i.product.price) * i.quantity,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCompletedOrder(newOrder);
    onOrderCompleted(newOrder);
    setIsProcessing(false);
    setStep('confirmation');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto font-sans">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden my-6 text-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar with FoxPrice Theme */}
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-[#232f3e] text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#e07b16] to-[#ff9900] flex items-center justify-center font-black text-white text-base shadow-sm">
              🦊
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-tight uppercase">
                Fox<span className="text-[#f68b1e]">Price</span> Express Checkout
              </span>
              <p className="text-[11px] text-gray-300">Nationwide Delivery across Uganda · 256-bit Encrypted</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress indicator */}
        <div className="bg-gray-50 dark:bg-[#151c24] px-6 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'shipping' ? 'bg-[#f68b1e] text-white' : 'bg-emerald-600 text-white'
            }`}>
              {step !== 'shipping' ? '✓' : '1'}
            </span>
            <span className={step === 'shipping' ? 'text-[#f68b1e]' : 'text-gray-600 dark:text-gray-400'}>
              Delivery Details
            </span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'payment' || step === 'ussd_pending' ? 'bg-[#f68b1e] text-white' : step === 'confirmation' ? 'bg-emerald-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-700'
            }`}>
              {step === 'confirmation' ? '✓' : '2'}
            </span>
            <span className={step === 'payment' || step === 'ussd_pending' ? 'text-[#f68b1e]' : 'text-gray-500'}>
              Payment & Mobile Money
            </span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'confirmation' ? 'bg-emerald-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-700'
            }`}>
              3
            </span>
            <span className={step === 'confirmation' ? 'text-emerald-600' : 'text-gray-500'}>
              Confirmation
            </span>
          </div>
        </div>

        {/* STEP 1: SHIPPING ADDRESS (UGANDA TAILORED) */}
        {step === 'shipping' && (
          <form onSubmit={handleValidateShipping} className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#f68b1e]" />
                <span>Uganda Delivery Address</span>
              </h3>
              <span className="text-xs text-emerald-600 font-bold">
                {shipping === 0 ? '✓ Free Kampala Delivery Qualified' : `Standard Delivery: ${formatUGX(shipping)}`}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Recipient Full Name *</label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  placeholder="e.g. Christopher Juru"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#f68b1e] focus:outline-none"
                />
                {fieldErrors.fullName && <p className="text-[10px] text-red-500">{fieldErrors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Phone Number (MTN / Airtel for Delivery Call) *</label>
                <input
                  type="text"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  placeholder="+256 772 000 000"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#f68b1e] focus:outline-none"
                />
                {fieldErrors.phone && <p className="text-[10px] text-red-500">{fieldErrors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Email Address (Order Tracking & Receipt) *</label>
                <input
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#f68b1e] focus:outline-none"
                />
                {fieldErrors.email && <p className="text-[10px] text-red-500">{fieldErrors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">City / District in Uganda *</label>
                <select
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#f68b1e] focus:outline-none"
                >
                  <option value="Kampala">Kampala (Central, Nakawa, Kololo, Ntinda)</option>
                  <option value="Entebbe">Entebbe / Wakiso</option>
                  <option value="Jinja">Jinja City</option>
                  <option value="Mbarara">Mbarara City</option>
                  <option value="Gulu">Gulu City</option>
                  <option value="Arua">Arua City</option>
                  <option value="Masaka">Masaka City</option>
                  <option value="Fort Portal">Fort Portal City</option>
                  <option value="Mbale">Mbale City</option>
                  <option value="Mukono">Mukono Town</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Street / Plot Number / Building Landmark *</label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  placeholder="e.g. Plot 14, Prince Charles Drive, Kololo (Near TotalEnergies)"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#f68b1e] focus:outline-none"
                />
                {fieldErrors.street && <p className="text-[10px] text-red-500">{fieldErrors.street}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Rider Delivery Directions / Notes</label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Special instructions for the dispatch rider"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#f68b1e] focus:outline-none"
                />
              </div>
            </div>

            {/* Delivery Option Toggle */}
            <div className="p-3.5 bg-orange-50/60 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#f68b1e]" />
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">FoxPrice Express Same-Day</span>
                  <p className="text-[10px] text-gray-500">Delivered directly to your door in Kampala & Entebbe.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">
                {shipping === 0 ? 'FREE' : formatUGX(shipping)}
              </span>
            </div>

            {/* Total Summary Footer */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">Total payable:</span>
                <div className="text-lg font-black text-gray-900 dark:text-white tabular-nums">
                  {formatUGX(total)}
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#f68b1e] hover:bg-[#e07b16] active:scale-98 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD (MTN MOMO, AIRTEL MONEY, CASH ON DELIVERY, VISA) */}
        {step === 'payment' && (
          <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#f68b1e]" />
                <span>Select Payment Method (Uganda)</span>
              </h3>
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="text-xs text-gray-500 hover:text-[#f68b1e] flex items-center gap-1 font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" /> Edit Address
              </button>
            </div>

            {/* Payment Method Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Option 1: MTN MoMo */}
              <div 
                onClick={() => setSelectedMethod('MTN_MOMO')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedMethod === 'MTN_MOMO'
                    ? 'border-[#ffcc00] bg-amber-50/60 dark:bg-amber-950/20 ring-2 ring-[#ffcc00]'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-400 bg-gray-50/50 dark:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#ffcc00] text-black font-black flex items-center justify-center text-[10px]">
                      M
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">MTN Mobile Money</span>
                  </div>
                  <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-bold px-1.5 py-0.5 rounded">
                    Instant USSD
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">Zero fee prompt sent to your MTN phone.</p>
              </div>

              {/* Option 2: Airtel Money */}
              <div 
                onClick={() => setSelectedMethod('AIRTEL_MONEY')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedMethod === 'AIRTEL_MONEY'
                    ? 'border-red-500 bg-red-50/60 dark:bg-red-950/20 ring-2 ring-red-500'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-400 bg-gray-50/50 dark:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-[10px]">
                      A
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">Airtel Money</span>
                  </div>
                  <span className="text-[10px] bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 font-bold px-1.5 py-0.5 rounded">
                    Instant USSD
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">Instant PIN authorization on your phone.</p>
              </div>

              {/* Option 3: Cash on Delivery */}
              <div 
                onClick={() => setSelectedMethod('CASH_ON_DELIVERY')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedMethod === 'CASH_ON_DELIVERY'
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 ring-2 ring-emerald-500'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-400 bg-gray-50/50 dark:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-gray-900 dark:text-white">Cash on Delivery</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold px-1.5 py-0.5 rounded">
                    Kampala Only
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">Pay cash or MoMo directly to the dispatch rider.</p>
              </div>

              {/* Option 4: Visa / Mastercard */}
              <div 
                onClick={() => setSelectedMethod('CREDIT_CARD')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedMethod === 'CREDIT_CARD'
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/20 ring-2 ring-blue-500'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-400 bg-gray-50/50 dark:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-gray-900 dark:text-white">Visa / Mastercard</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold px-1.5 py-0.5 rounded">
                    International
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">Standard credit & debit cards accepted.</p>
              </div>

            </div>

            {/* Dynamic Input based on selected method */}
            {selectedMethod === 'MTN_MOMO' && (
              <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-[#ffcc00]/60 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>Enter MTN Uganda Mobile Number</span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center">
                    🇺🇬 +256
                  </span>
                  <input
                    type="text"
                    value={mobileMoneyNumber}
                    onChange={(e) => setMobileMoneyNumber(e.target.value)}
                    placeholder="0772 123 456"
                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold tracking-wider focus:ring-2 focus:ring-[#ffcc00] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-400">
                  You will receive a USSD popup prompt on this phone to enter your MTN MoMo PIN to authorize <strong className="text-gray-900 dark:text-white">{formatUGX(total)}</strong> to FoxPrice Uganda (Merchant ID: 982134).
                </p>
              </div>
            )}

            {selectedMethod === 'AIRTEL_MONEY' && (
              <div className="p-4 bg-red-50/80 dark:bg-red-950/30 border border-red-300 dark:border-red-900 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                  <Phone className="w-4 h-4 text-red-600" />
                  <span>Enter Airtel Uganda Mobile Number</span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center">
                    🇺🇬 +256
                  </span>
                  <input
                    type="text"
                    value={airtelNumber}
                    onChange={(e) => setAirtelNumber(e.target.value)}
                    placeholder="0701 234 567"
                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold tracking-wider focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-400">
                  An Airtel Money authorization screen will prompt you for your PIN to approve <strong className="text-gray-900 dark:text-white">{formatUGX(total)}</strong>.
                </p>
              </div>
            )}

            {selectedMethod === 'CASH_ON_DELIVERY' && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-xl space-y-2 text-xs text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pay on Delivery in Kampala & Entebbe</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Have exact cash of <strong>{formatUGX(total)}</strong> or prepare to transfer via Mobile Money directly to the dispatch rider upon inspection of goods.
                </p>
              </div>
            )}

            {selectedMethod === 'CREDIT_CARD' && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Card Number</label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold">Expiry Date</label>
                    <input
                      type="text"
                      value={cardData.expDate}
                      onChange={(e) => setCardData({ ...cardData, expDate: e.target.value })}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold">CVC</label>
                    <input
                      type="password"
                      value={cardData.cvc}
                      onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Button CTA */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">Payable Total:</span>
                <div className="text-lg font-black text-gray-900 dark:text-white tabular-nums">
                  {formatUGX(total)}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="bg-[#f68b1e] hover:bg-[#e07b16] active:scale-98 text-white px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Connecting MoMo Gateway...</span>
                  </span>
                ) : (
                  <span>
                    {selectedMethod === 'MTN_MOMO'
                      ? 'Pay with MTN MoMo'
                      : selectedMethod === 'AIRTEL_MONEY'
                      ? 'Pay with Airtel Money'
                      : selectedMethod === 'CASH_ON_DELIVERY'
                      ? 'Confirm Cash Order'
                      : 'Authorize Payment'}
                  </span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2.5: USSD PENDING SIMULATION MODAL STATE */}
        {step === 'ussd_pending' && (
          <div className="p-8 text-center space-y-5 animate-in fade-in">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-orange-100 dark:bg-orange-950/40 animate-ping opacity-75"></div>
              <div className="relative w-16 h-16 rounded-full bg-[#f68b1e] text-white flex items-center justify-center text-2xl shadow-lg">
                📲
              </div>
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Check Your Phone for USSD Prompt
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                A push notification has been sent to{' '}
                <strong className="text-gray-900 dark:text-white">
                  {selectedMethod === 'MTN_MOMO' ? mobileMoneyNumber : airtelNumber}
                </strong>
                .
              </p>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl max-w-sm mx-auto text-left font-mono text-xs space-y-1.5 border border-gray-200 dark:border-gray-700">
              <div className="text-[11px] text-gray-500 uppercase font-sans font-bold">Simulated Mobile Screen:</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                FoxPrice Uganda Merchant #982134
              </div>
              <div className="text-gray-800 dark:text-gray-200">
                Amount: {formatUGX(total)}
              </div>
              <div className="text-gray-500 text-[11px]">
                Enter PIN to approve transaction...
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="w-3.5 h-3.5 border-2 border-[#f68b1e] border-t-transparent rounded-full animate-spin"></div>
              <span>Awaiting secure network confirmation...</span>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER CONFIRMATION & RECEIPT DOWNLOAD */}
        {step === 'confirmation' && completedOrder && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
                ✓
              </div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                Order Confirmed & Queued for Dispatch!
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Thank you for shopping on FoxPrice Uganda. Your order is being packed in our Kampala fulfillment warehouse.
              </p>
            </div>

            {/* Official Order Receipt */}
            <div className="bg-gray-50 dark:bg-[#151c24] rounded-2xl p-5 border border-gray-200 dark:border-gray-800 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700 gap-2">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Order Number</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white text-sm">
                    {completedOrder.orderNumber}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Carrier & Tracking</span>
                  <span className="font-mono font-bold text-[#f68b1e]">
                    {completedOrder.carrier} · {completedOrder.trackingNumber}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-bold">Payment Method</span>
                  <span className="font-bold text-emerald-600">
                    {completedOrder.paymentMethod === 'MTN_MOMO'
                      ? '🟡 MTN MoMo (PAID)'
                      : completedOrder.paymentMethod === 'AIRTEL_MONEY'
                      ? '🔴 Airtel Money (PAID)'
                      : completedOrder.paymentMethod === 'CASH_ON_DELIVERY'
                      ? '💵 Pay on Delivery'
                      : '💳 Visa Card (PAID)'}
                  </span>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid sm:grid-cols-2 gap-3 text-[11px] text-gray-600 dark:text-gray-300">
                <div>
                  <strong className="block text-gray-800 dark:text-gray-200">Delivery Address:</strong>
                  <span>{completedOrder.customerName}</span><br />
                  <span>{completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}, Uganda</span><br />
                  <span>Phone: {completedOrder.shippingAddress.phone}</span>
                </div>
                <div>
                  <strong className="block text-gray-800 dark:text-gray-200">Estimated Doorstep Arrival:</strong>
                  <span className="text-gray-900 dark:text-white font-bold">
                    Within 24 Hours (By tomorrow afternoon)
                  </span><br />
                  {completedOrder.mobileMoneyTxId && (
                    <span className="font-mono text-gray-500">
                      Tx ID: {completedOrder.mobileMoneyTxId}
                    </span>
                  )}
                </div>
              </div>

              {/* Items Summary */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <strong className="block text-gray-800 dark:text-gray-200">Items Ordered:</strong>
                {completedOrder.items.map((it) => (
                  <div key={it.id} className="flex justify-between items-center text-xs">
                    <span className="truncate max-w-xs">
                      {it.quantity}x {it.productTitle}
                    </span>
                    <span className="font-bold tabular-nums">
                      {formatUGX(it.subtotal)}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-black text-sm text-gray-900 dark:text-white">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#f68b1e]">{formatUGX(completedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save Tax Receipt (PDF)</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 bg-[#f68b1e] hover:bg-[#e07b16] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
