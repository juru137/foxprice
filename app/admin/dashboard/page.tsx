'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, TrendingUp, DollarSign, Package, ShoppingCart, 
  Users, ArrowUpRight, ArrowDownRight, Clock, Plus, Filter,
  CheckCircle2, AlertCircle, Truck, Eye
} from 'lucide-react';
import { OrderRecord, OrderStatus } from '@/lib/types';

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord_1042',
    orderNumber: 'KIN-8921',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@studio.arch',
    shippingAddress: {
      fullName: 'Marcus Vance',
      email: 'm.vance@studio.arch',
      phone: '+1 (555) 234-9812',
      street: '742 Montgomery St, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94111',
      country: 'US'
    },
    subtotal: 698.00,
    taxAmount: 55.84,
    shippingAmount: 0.00,
    discountAmount: 0.00,
    totalAmount: 753.84,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    carrier: 'DHL Express',
    trackingNumber: 'DHL-84920199',
    items: [
      {
        id: 'item_1',
        productId: 'prod_1',
        productTitle: 'KINETIC Studio Machined Keyboard',
        productImage: '/src/assets/images/product_keyboard_1790375116724.jpg',
        variantTitle: 'Matte Graphite',
        quantity: 2,
        unitPrice: 349.00,
        subtotal: 698.00
      }
    ],
    createdAt: '2026-09-25T14:10:00Z',
    updatedAt: '2026-09-25T14:25:00Z'
  },
  {
    id: 'ord_1041',
    orderNumber: 'KIN-8920',
    customerName: 'Claire Beauchamp',
    customerEmail: 'claire@zenith.design',
    shippingAddress: {
      fullName: 'Claire Beauchamp',
      email: 'claire@zenith.design',
      phone: '+44 20 7946 0912',
      street: '18 Berkeley Square',
      city: 'London',
      state: 'Greater London',
      postalCode: 'W1J 6DA',
      country: 'GB'
    },
    subtotal: 489.00,
    taxAmount: 0.00,
    shippingAmount: 25.00,
    discountAmount: 0.00,
    totalAmount: 514.00,
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    carrier: 'FedEx Priority',
    trackingNumber: 'FX-992104882',
    items: [
      {
        id: 'item_2',
        productId: 'prod_2',
        productTitle: 'Precision Acoustic Studio Over-Ears',
        productImage: '/src/assets/images/product_headphones_1790375126300.jpg',
        variantTitle: 'Gunmetal',
        quantity: 1,
        unitPrice: 489.00,
        subtotal: 489.00
      }
    ],
    createdAt: '2026-09-25T11:40:00Z',
    updatedAt: '2026-09-25T12:05:00Z'
  },
  {
    id: 'ord_1040',
    orderNumber: 'KIN-8919',
    customerName: 'Tatsuya Endo',
    customerEmail: 'endo@nakameguro.jp',
    shippingAddress: {
      fullName: 'Tatsuya Endo',
      email: 'endo@nakameguro.jp',
      phone: '+81 3 5555 0143',
      street: '3-12-8 Nakameguro, Meguro-ku',
      city: 'Tokyo',
      state: 'Tokyo',
      postalCode: '153-0061',
      country: 'JP'
    },
    subtotal: 256.00,
    taxAmount: 25.60,
    shippingAmount: 15.00,
    discountAmount: 0.00,
    totalAmount: 296.60,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    carrier: 'Yamato Transport',
    trackingNumber: 'YT-384910283',
    items: [
      {
        id: 'item_3',
        productId: 'prod_3',
        productTitle: 'Architectural Pour-Over Stoneware Carafe',
        productImage: '/src/assets/images/product_carafe_1790375136673.jpg',
        variantTitle: 'Raw Sandstone',
        quantity: 2,
        unitPrice: 128.00,
        subtotal: 256.00
      }
    ],
    createdAt: '2026-09-24T08:12:00Z',
    updatedAt: '2026-09-25T03:00:00Z'
  },
  {
    id: 'ord_1039',
    orderNumber: 'KIN-8918',
    customerName: 'Siddharth Patel',
    customerEmail: 'siddharth@poly.io',
    shippingAddress: {
      fullName: 'Siddharth Patel',
      email: 'siddharth@poly.io',
      phone: '+1 (415) 890-1284',
      street: '100 King St',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98104',
      country: 'US'
    },
    subtotal: 349.00,
    taxAmount: 31.41,
    shippingAmount: 0.00,
    discountAmount: 34.90,
    totalAmount: 345.51,
    status: 'PENDING',
    paymentStatus: 'PAID',
    items: [
      {
        id: 'item_4',
        productId: 'prod_1',
        productTitle: 'KINETIC Studio Machined Keyboard',
        productImage: '/src/assets/images/product_keyboard_1790375116724.jpg',
        quantity: 1,
        unitPrice: 349.00,
        subtotal: 349.00
      }
    ],
    createdAt: '2026-09-25T15:02:00Z',
    updatedAt: '2026-09-25T15:02:00Z'
  }
];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const filteredOrders = orders.filter(
    (o) => statusFilter === 'ALL' || o.status === statusFilter
  );

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="text-amber-400 font-mono text-xs">Pending Review</span>;
      case 'PROCESSING':
        return <span className="text-blue-400 font-mono text-xs">In Assembly</span>;
      case 'SHIPPED':
        return <span className="text-purple-400 font-mono text-xs">In Transit</span>;
      case 'DELIVERED':
        return <span className="text-emerald-400 font-mono text-xs">Completed</span>;
      case 'CANCELLED':
        return <span className="text-rose-400 font-mono text-xs">Voided</span>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased">
      {/* Admin Top Header */}
      <header className="border-b border-neutral-900 bg-neutral-950 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="text-sm font-semibold tracking-wider uppercase text-neutral-100">
            KINETIC <span className="text-neutral-500 font-mono text-xs">ADMIN_CONSOLE</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-xs text-neutral-400">
            <Link href="/admin/dashboard" className="text-white font-medium">Dashboard & Pipeline</Link>
            <Link href="/admin/products/new" className="hover:text-white transition-colors">Catalog Ingestion</Link>
            <Link href="/" className="hover:text-white transition-colors">Live Storefront</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 bg-neutral-100 hover:bg-white text-neutral-950 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Product</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        
        {/* Metric Cards Banner */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>Gross 30D Revenue</span>
              <DollarSign className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl font-semibold font-mono tabular-nums text-neutral-100">
              $148,920.00
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs previous 30d</span>
            </div>
          </div>

          <div className="p-5 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>Average Order Value</span>
              <BarChart3 className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl font-semibold font-mono tabular-nums text-neutral-100">
              $394.50
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+4.2% higher cart density</span>
            </div>
          </div>

          <div className="p-5 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>Storefront Conversion</span>
              <TrendingUp className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl font-semibold font-mono tabular-nums text-neutral-100">
              3.82%
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
              <span>9,420 unique sessions</span>
            </div>
          </div>

          <div className="p-5 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>Active Fulfillment Queue</span>
              <Package className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl font-semibold font-mono tabular-nums text-neutral-100">
              14 Orders
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>4 awaiting label creation</span>
            </div>
          </div>
        </section>

        {/* Visual Revenue Breakdown & Traffic Chart Simulation */}
        <section className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-lg border border-neutral-900 bg-neutral-900/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-200">Revenue Velocity (Trailing 6 Months)</h3>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">Aggregated Stripe settled volumes</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 tabular-nums">$24,800/mo avg</span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-56 pt-6 flex items-end justify-between gap-4 border-b border-neutral-900">
              {[
                { month: 'Apr', value: 18400, height: '45%' },
                { month: 'May', value: 21200, height: '54%' },
                { month: 'Jun', value: 26800, height: '68%' },
                { month: 'Jul', value: 29500, height: '74%' },
                { month: 'Aug', value: 33100, height: '83%' },
                { month: 'Sep', value: 39800, height: '100%' },
              ].map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[11px] font-mono text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    ${(item.value / 1000).toFixed(1)}k
                  </div>
                  <div
                    style={{ height: item.height }}
                    className="w-full bg-neutral-800 hover:bg-neutral-600 rounded-t transition-all duration-200"
                  />
                  <span className="text-xs font-mono text-neutral-500 pt-1">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Channel Sources */}
          <div className="lg:col-span-4 p-6 rounded-lg border border-neutral-900 bg-neutral-900/20 space-y-4">
            <h3 className="text-sm font-semibold text-neutral-200">Acquisition Channels</h3>
            <div className="space-y-4 pt-2">
              {[
                { label: 'Direct Architectural Referrals', percent: 46, visitors: '4,333' },
                { label: 'Specialist Hardware Fora', percent: 28, visitors: '2,637' },
                { label: 'Organic Search (Engineered terms)', percent: 18, visitors: '1,695' },
                { label: 'Design Editorial Newsletters', percent: 8, visitors: '755' },
              ].map((src) => (
                <div key={src.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300">{src.label}</span>
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
        </section>

        {/* Real-time Order Fulfillment Pipeline */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-100">Fulfillment Pipeline</h2>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">Live order dispatches & tracking status</p>
            </div>

            {/* Filter segments */}
            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
              {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
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

          {/* Orders Table */}
          <div className="border border-neutral-900 rounded-lg overflow-x-auto bg-neutral-900/30">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-900 text-neutral-500 font-mono">
                  <th className="py-3 px-4 font-normal">Order</th>
                  <th className="py-3 px-4 font-normal">Customer</th>
                  <th className="py-3 px-4 font-normal">Items</th>
                  <th className="py-3 px-4 font-normal">Total</th>
                  <th className="py-3 px-4 font-normal">Status</th>
                  <th className="py-3 px-4 font-normal">Fulfillment</th>
                  <th className="py-3 px-4 font-normal text-right">Actions</th>
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
                      {order.items.map(i => `${i.quantity}x ${i.productTitle}`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums font-medium text-neutral-200">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-400 text-[11px]">
                      {order.trackingNumber ? (
                        <span title={order.carrier}>{order.trackingNumber}</span>
                      ) : (
                        <span className="text-neutral-600">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-[11px] text-neutral-300 focus:outline-none"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
