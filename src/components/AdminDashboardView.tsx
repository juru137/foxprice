import React, { useState } from 'react';
import { 
  BarChart3, DollarSign, Package, TrendingUp, Plus, 
  ArrowUpRight, Clock, Truck, CheckCircle2, Shield, Eye
} from 'lucide-react';
import { OrderRecord, OrderStatus, ProductItem } from '@/lib/types';

interface AdminDashboardViewProps {
  orders: OrderRecord[];
  products: ProductItem[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  onNavigateNewProduct: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  orders,
  products,
  onUpdateOrderStatus,
  onNavigateNewProduct,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
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
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>ROLE_VERIFIED: ADMINISTRATOR (HIGH-DENSITY CONSOLE)</span>
          </div>
          <h1 className="text-xl font-semibold text-neutral-100">
            Store Operations & Analytics Engine
          </h1>
        </div>

        <button
          onClick={onNavigateNewProduct}
          className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-white text-neutral-950 px-4 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ingest New Product</span>
        </button>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Aggregated Gross Sales</span>
            <DollarSign className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-semibold font-mono tabular-nums text-neutral-100">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs trailing period</span>
          </div>
        </div>

        <div className="p-5 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Average Order Value</span>
            <BarChart3 className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-semibold font-mono tabular-nums text-neutral-100">
            ${aov.toFixed(2)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>High-intent cart density</span>
          </div>
        </div>

        <div className="p-5 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Conversion Velocity</span>
            <TrendingUp className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-semibold font-mono tabular-nums text-neutral-100">
            3.82%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
            <span>8,420 unique visits</span>
          </div>
        </div>

        <div className="p-5 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Workshop Assembly Queue</span>
            <Package className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-semibold font-mono tabular-nums text-neutral-100">
            {activeFulfillmentCount} Dispatches
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Direct carrier pickup</span>
          </div>
        </div>
      </div>

      {/* Revenue Graph & Traffic Sources */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-lg border border-neutral-900 bg-neutral-900/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-200">Revenue Trajectory (Trailing 6 Months)</h3>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">Stripe settled settlements in USD</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 tabular-nums">$33,400/mo avg</span>
          </div>

          <div className="h-52 pt-6 flex items-end justify-between gap-4 border-b border-neutral-900">
            {[
              { month: 'Apr', value: 18400, height: '42%' },
              { month: 'May', value: 22100, height: '51%' },
              { month: 'Jun', value: 27900, height: '64%' },
              { month: 'Jul', value: 31200, height: '72%' },
              { month: 'Aug', value: 35800, height: '82%' },
              { month: 'Sep', value: 43500, height: '100%' },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                  ${(bar.value / 1000).toFixed(1)}k
                </div>
                <div
                  style={{ height: bar.height }}
                  className="w-full bg-neutral-800 hover:bg-neutral-600 rounded-t transition-all duration-200"
                />
                <span className="text-xs font-mono text-neutral-500 pt-1">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 p-6 rounded-lg border border-neutral-900 bg-neutral-900/20 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-200">Acquisition Channels</h3>
          <div className="space-y-4 pt-2">
            {[
              { label: 'Direct Architectural Referrals', percent: 46 },
              { label: 'Specialist Hardware Fora', percent: 28 },
              { label: 'Organic Search (Engineered terms)', percent: 18 },
              { label: 'Design Editorial Newsletters', percent: 8 },
            ].map((src) => (
              <div key={src.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 truncate pr-2">{src.label}</span>
                  <span className="font-mono text-neutral-500 tabular-nums">{src.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${src.percent}%` }}
                    className="h-full bg-neutral-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fulfillment Pipeline Orders Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-100">Fulfillment Pipeline</h2>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">Real-time status transitions and courier assignment</p>
          </div>

          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
            {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-neutral-900 rounded-lg overflow-x-auto bg-neutral-900/30">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-900 text-neutral-500 font-mono">
                <th className="py-3 px-4 font-normal">Reference</th>
                <th className="py-3 px-4 font-normal">Customer</th>
                <th className="py-3 px-4 font-normal">Manifest</th>
                <th className="py-3 px-4 font-normal">Settled</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal">Tracking Code</th>
                <th className="py-3 px-4 font-normal text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-neutral-200">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-neutral-200">{order.customerName}</div>
                    <div className="text-neutral-500 font-mono text-[11px]">{order.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300">
                    {order.items.map((i) => `${i.quantity}x ${i.productTitle}`).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums font-medium text-neutral-200">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs text-neutral-300">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-400 text-[11px]">
                    {order.trackingNumber ? (
                      <span className="text-emerald-400">{order.trackingNumber}</span>
                    ) : (
                      <button
                        onClick={() => {
                          setTrackingModalOrder(order);
                          setNewTrackingCode(`DHL-${Math.floor(10000000 + Math.random() * 90000000)}`);
                        }}
                        className="text-amber-400 hover:underline cursor-pointer"
                      >
                        + Assign Courier Code
                      </button>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-[11px] text-neutral-300 focus:outline-none cursor-pointer"
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

      {/* Assign Tracking Code Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-semibold text-neutral-100">
              Assign Tracking for {trackingModalOrder.orderNumber}
            </h3>
            <p className="text-xs text-neutral-400">
              Customer {trackingModalOrder.customerEmail} will receive an automated air dispatch update.
            </p>
            <input
              type="text"
              value={newTrackingCode}
              onChange={(e) => setNewTrackingCode(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-neutral-200"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTracking}
                className="bg-neutral-100 text-neutral-950 px-4 py-1.5 rounded text-xs font-semibold hover:bg-white"
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
