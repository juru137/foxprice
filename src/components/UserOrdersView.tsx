import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, Download, ArrowLeft, ExternalLink, Smartphone } from 'lucide-react';
import { OrderRecord, OrderStatus } from '@/lib/types';
import { formatUGX } from '@/src/lib/formatters';

interface UserOrdersViewProps {
  orders: OrderRecord[];
  onBackToCatalog: () => void;
}

export const UserOrdersView: React.FC<UserOrdersViewProps> = ({
  orders,
  onBackToCatalog,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(orders[0] || null);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Awaiting Payment</span>;
      case 'PROCESSING':
        return <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Package className="w-3 h-3" /> Packing in Kampala</span>;
      case 'SHIPPED':
        return <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> Out for Delivery</span>;
      case 'DELIVERED':
        return <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'CANCELLED':
        return <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[11px] font-bold px-2 py-0.5 rounded-full">Cancelled</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <button
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#f68b1e] transition-colors cursor-pointer mb-2 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to FoxPrice Storefront</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            Your Orders & Package Tracking
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time delivery status, rider contact, and downloadable tax receipts in Uganda
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-[#1a222d] rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No orders placed yet.</p>
          <p className="text-xs text-gray-500">Your recent purchases and mobile money receipts will appear here.</p>
          <button
            onClick={onBackToCatalog}
            className="bg-[#f68b1e] hover:bg-[#e07b16] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow cursor-pointer transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Order list column */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
              Recent Orders ({orders.length})
            </span>

            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2.5 ${
                  selectedOrder?.id === order.id
                    ? 'border-[#f68b1e] bg-orange-50/40 dark:bg-orange-950/20 shadow-sm ring-2 ring-[#f68b1e]/20'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a222d] hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                    {order.orderNumber}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="text-gray-900 dark:text-white font-black tabular-nums">
                    {formatUGX(order.totalAmount)}
                  </span>
                </div>

                <div className="text-[11px] text-gray-600 dark:text-gray-400 truncate">
                  {order.items.map((i) => `${i.quantity}x ${i.productTitle}`).join(', ')}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Order Detailed View */}
          {selectedOrder && (
            <div className="lg:col-span-7 bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 flex-wrap">
                    <span>Carrier: {selectedOrder.carrier || 'FoxPrice Express'}</span>
                    <span>·</span>
                    <span className="text-[#f68b1e] font-bold">Tracking: {selectedOrder.trackingNumber || 'Pending'}</span>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Tax Invoice</span>
                </button>
              </div>

              {/* Delivery Progress Bar */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Fulfillment Status
                </span>

                <div className="grid grid-cols-4 gap-2 text-[11px]">
                  {[
                    { label: 'Order Placed', active: true },
                    { label: 'Packed in Warehouse', active: selectedOrder.status !== 'PENDING' },
                    { label: 'With Kampala Rider', active: selectedOrder.status === 'SHIPPED' || selectedOrder.status === 'DELIVERED' },
                    { label: 'Delivered', active: selectedOrder.status === 'DELIVERED' },
                  ].map((step, idx) => (
                    <div
                      key={step.label}
                      className={`p-2.5 rounded-xl border text-center ${
                        step.active
                          ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 text-gray-400'
                      }`}
                    >
                      <div className="text-[10px]">{idx + 1}. {step.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination Address & Payment Method */}
              <div className="grid sm:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4 text-xs">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block mb-1">
                    Delivery Address:
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedOrder.shippingAddress.fullName}<br />
                    {selectedOrder.shippingAddress.street}<br />
                    {selectedOrder.shippingAddress.city}, Uganda<br />
                    Phone: {selectedOrder.shippingAddress.phone}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-gray-900 dark:text-white block mb-1">
                    Payment Details:
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Status: <strong className="text-emerald-600 uppercase font-black">{selectedOrder.paymentStatus}</strong><br />
                    Method: {selectedOrder.paymentMethod === 'MTN_MOMO' ? '🟡 MTN Mobile Money' : selectedOrder.paymentMethod === 'AIRTEL_MONEY' ? '🔴 Airtel Money' : selectedOrder.paymentMethod === 'CASH_ON_DELIVERY' ? '💵 Pay on Delivery' : '💳 Credit Card'}<br />
                    {selectedOrder.mobileMoneyTxId && (
                      <span className="font-mono text-[11px] text-gray-500">Ref: {selectedOrder.mobileMoneyTxId}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Itemized breakdown */}
              <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4 text-xs">
                <span className="font-bold uppercase tracking-wider text-gray-500">
                  Itemized Manifest
                </span>
                <div className="space-y-2">
                  {selectedOrder.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800"
                    >
                      <div>
                        <span className="text-gray-900 dark:text-white font-semibold">{it.quantity}x {it.productTitle}</span>
                        {it.variantTitle && (
                          <span className="text-gray-500 block text-[11px]">{it.variantTitle}</span>
                        )}
                      </div>
                      <span className="font-black tabular-nums text-gray-900 dark:text-white">
                        {formatUGX(it.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-semibold">{formatUGX(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount (FOXDEAL10)</span>
                      <span className="tabular-nums">-{formatUGX(selectedOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="tabular-nums font-semibold">
                      {selectedOrder.shippingAmount === 0 ? 'FREE' : formatUGX(selectedOrder.shippingAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-800">
                    <span>Total Settled</span>
                    <span className="text-[#f68b1e] tabular-nums text-base">{formatUGX(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
