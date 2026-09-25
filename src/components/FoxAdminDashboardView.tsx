import React, { useState } from 'react';
import { 
  BarChart3, DollarSign, Package, TrendingUp, Plus, 
  ArrowUpRight, Clock, Truck, CheckCircle2, Shield, Eye,
  Sparkles, BrainCircuit, Users, Compass, Lock, Smartphone
} from 'lucide-react';
import { OrderRecord, OrderStatus, ProductItem, UserProfile } from '@/lib/types';
import { formatUGX, formatShortUGX } from '@/src/lib/formatters';

interface FoxAdminDashboardViewProps {
  orders: OrderRecord[];
  products: ProductItem[];
  currentUser: UserProfile | null;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  onNavigateNewProduct: () => void;
  onExitAdmin: () => void;
}

export const FoxAdminDashboardView: React.FC<FoxAdminDashboardViewProps> = ({
  orders,
  products,
  currentUser,
  onUpdateOrderStatus,
  onNavigateNewProduct,
  onExitAdmin,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'ai-insights'>('analytics');
  const [trackingModalOrder, setTrackingModalOrder] = useState<OrderRecord | null>(null);
  const [newTrackingCode, setNewTrackingCode] = useState('');

  const filteredOrders = orders.filter(
    (o) => statusFilter === 'ALL' || o.status === statusFilter
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const aov = orders.length > 0 ? totalRevenue / orders.length : 0;
  const activeFulfillmentCount = orders.filter((o) => o.status === 'PROCESSING' || o.status === 'PENDING').length;

  const handleSaveTracking = () => {
    if (trackingModalOrder && newTrackingCode.trim()) {
      onUpdateOrderStatus(trackingModalOrder.id, 'SHIPPED', newTrackingCode.trim());
      setTrackingModalOrder(null);
      setNewTrackingCode('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      
      {/* Header Banner - Exclusive to Master Owner */}
      <div className="bg-[#131921] border border-[#f68b1e]/50 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-[#f68b1e] font-mono text-xs font-bold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>SECURE OWNER CONSOLE · FOXPRICE UGANDA MANAGEMENT GATEWAY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            FoxPrice Commerce Intelligence & Operations Hub
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Authorized session for owner: <span className="text-white font-semibold">{currentUser?.email || 'christopherjuru@gmail.com'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateNewProduct}
            className="flex items-center gap-1.5 bg-[#f68b1e] hover:bg-[#e07b16] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Exit to Storefront
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors ${
            activeTab === 'analytics'
              ? 'bg-[#f68b1e] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Core Analytics (UGX)</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-insights')}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors ${
            activeTab === 'ai-insights'
              ? 'bg-[#f68b1e] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>AI Audience & Recommendation Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors ${
            activeTab === 'orders'
              ? 'bg-[#f68b1e] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Fulfillment Orders ({orders.length})</span>
        </button>
      </div>

      {/* Metric Cards Row in Ugandan Shillings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a222d] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Gross Sales Volume</span>
            <DollarSign className="w-4 h-4 text-[#f68b1e]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tabular-nums tracking-tight">
            {formatUGX(totalRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+28.4% vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a222d] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Average Order Value</span>
            <TrendingUp className="w-4 h-4 text-[#f68b1e]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tabular-nums tracking-tight">
            {formatUGX(aov)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>High MoMo basket size</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a222d] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>AI Recommendation Lift</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-500 tabular-nums">
            +34.2%
          </div>
          <div className="text-[11px] text-gray-500 font-medium">
            Cross-sell conversions in Uganda
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a222d] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Active Kampala Dispatches</span>
            <Truck className="w-4 h-4 text-[#f68b1e]" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
            {activeFulfillmentCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
            <Clock className="w-3 h-3" />
            <span>FoxPrice Express fleet dispatched</span>
          </div>
        </div>
      </div>

      {/* Tab: AI Insights */}
      {activeTab === 'ai-insights' && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-[#1a222d] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#f68b1e]" />
                <span>Uganda Shopper Affinity Clustering</span>
              </h3>
              <p className="text-xs text-gray-500">
                AI tracks dwell time on phones, TVs, sneakers, and air fryers to personalize real-time feeds
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              {[
                { label: 'Phones & Tablets (Samsung S24 Ultra & 5G)', affinity: 89, conversion: '16.2%', top: 'Samsung S24 Ultra (512GB)' },
                { label: 'Electronics & TV (LG 55" OLED & Sony ANC)', affinity: 76, conversion: '12.4%', top: 'LG 55-inch OLED 4K' },
                { label: 'Home Appliances (Touchscreen Dual Air Fryer)', affinity: 64, conversion: '10.8%', top: 'Digital Air Fryer 6.5L' },
                { label: 'Fashion & Footwear (Nike Zoom Sneakers)', affinity: 52, conversion: '9.1%', top: 'Nike Air Zoom Pro' },
              ].map((item) => (
                <div key={item.label} className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#151c24] border border-gray-200 dark:border-gray-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">{item.label}</span>
                    <span className="text-[#f68b1e] font-black">{item.affinity}% Affinity Score</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div style={{ width: `${item.affinity}%` }} className="bg-[#f68b1e] h-full rounded-full" />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500 pt-0.5">
                    <span>Top seller: {item.top}</span>
                    <span className="text-emerald-600 font-bold">{item.conversion} conversion rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#1a222d] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Smart Recommendation Actions</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                  Automated Phone + Watch Bundle
                </span>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                  System automatically showcases the Rugged Smartwatch and Sony headphones whenever a shopper opens the Galaxy S24 Ultra page.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                  Kampala Warehouse Stock Urgency
                </span>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  Real-time inventory alerts are triggered for items with less than 20 units in Kampala, driving higher conversion speed.
                </p>
              </div>

              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl">
                <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">
                  Mobile Money Checkout Optimization
                </span>
                <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed">
                  MTN MoMo and Airtel Money USSD push prompts enabled for 1-click mobile authorization with 0% drop-off.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Core Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white dark:bg-[#1a222d] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Monthly Revenue Velocity</h3>
                <p className="text-xs text-gray-500">Trailing settlements in Ugandan Shillings (UGX)</p>
              </div>
              <span className="text-xs font-bold text-[#f68b1e]">UGX 165.4M Current Month</span>
            </div>

            <div className="h-56 pt-6 flex items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
              {[
                { month: 'Apr', value: 72000000, height: '44%' },
                { month: 'May', value: 89000000, height: '54%' },
                { month: 'Jun', value: 108000000, height: '65%' },
                { month: 'Jul', value: 124000000, height: '75%' },
                { month: 'Aug', value: 142000000, height: '86%' },
                { month: 'Sep', value: 165400000, height: '100%' },
              ].map((bar) => (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-mono text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatShortUGX(bar.value)}
                  </div>
                  <div
                    style={{ height: bar.height }}
                    className="w-full bg-[#f68b1e] hover:bg-[#e07b16] rounded-t-lg transition-all duration-200"
                  />
                  <span className="text-xs font-bold text-gray-500 pt-1">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-[#1a222d] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Customer Acquisition Channels</h3>
            <div className="space-y-3.5 pt-1 text-xs">
              {[
                { label: 'Jumia / Amazon Brand Search', percent: 48 },
                { label: 'Google Search Uganda Direct', percent: 26 },
                { label: 'Social Media & Kampala Forums', percent: 18 },
                { label: 'Direct Loyalty MoMo App Ads', percent: 8 },
              ].map((src) => (
                <div key={src.label} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{src.label}</span>
                    <span className="font-bold text-[#f68b1e]">{src.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div style={{ width: `${src.percent}%` }} className="h-full bg-[#f68b1e] rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Orders & Pipeline */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Customer Dispatches & Order Pipeline
              </h2>
              <p className="text-xs text-gray-500">
                Update status, generate invoices, and assign tracking numbers to shipments across Uganda
              </p>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
              {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#f68b1e] text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#151c24] border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer & City</th>
                  <th className="py-3 px-4">Items Ordered</th>
                  <th className="py-3 px-4">Total Settled</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Tracking Number</th>
                  <th className="py-3 px-4 text-right">Fulfillment Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900 dark:text-white">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-800 dark:text-gray-200">{ord.customerName}</div>
                      <div className="text-[11px] text-gray-500">{ord.shippingAddress.city}, Uganda · {ord.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {ord.items.map((i) => `${i.quantity}x ${i.productTitle}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 font-black text-gray-900 dark:text-white tabular-nums">
                      {formatUGX(ord.totalAmount)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-xs">
                      {ord.paymentMethod === 'MTN_MOMO' ? (
                        <span className="text-amber-500 font-bold">🟡 MTN MoMo</span>
                      ) : ord.paymentMethod === 'AIRTEL_MONEY' ? (
                        <span className="text-red-500 font-bold">🔴 Airtel Money</span>
                      ) : ord.paymentMethod === 'CASH_ON_DELIVERY' ? (
                        <span className="text-emerald-500 font-bold">💵 Cash on Delivery</span>
                      ) : (
                        <span>💳 Card</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : ord.status === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-600 dark:text-gray-400">
                      {ord.trackingNumber ? (
                        <span className="text-[#f68b1e] font-bold">{ord.trackingNumber}</span>
                      ) : (
                        <button
                          onClick={() => {
                            setTrackingModalOrder(ord);
                            setNewTrackingCode(`FX-KLA-${Math.floor(100000 + Math.random() * 900000)}`);
                          }}
                          className="text-[#f68b1e] hover:underline font-bold cursor-pointer"
                        >
                          + Assign Courier
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-800 dark:text-gray-200 cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Tracking Code Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4 text-gray-900 dark:text-white">
            <h3 className="font-bold text-sm">
              Assign Dispatch Tracking for {trackingModalOrder.orderNumber}
            </h3>
            <p className="text-xs text-gray-500">
              Customer {trackingModalOrder.customerEmail} will receive an SMS and email dispatch notification.
            </p>
            <input
              type="text"
              value={newTrackingCode}
              onChange={(e) => setNewTrackingCode(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 dark:text-white"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="px-3.5 py-2 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTracking}
                className="bg-[#f68b1e] hover:bg-[#e07b16] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Confirm & Mark Shipped
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
