/**
 * Core Domain & Application Types for KINETIC Marketplace
 */

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  authProvider: 'google' | 'email';
  avatarUrl?: string;
  viewHistory?: string[]; // product IDs viewed
  purchaseHistory?: string[]; // category preferences
  createdAt: string;
}

export interface AIRecommendation {
  productId: string;
  reason: string;
  matchScore: number; // 0-100
  badgeText?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventoryCount: number;
  attributes: {
    size?: string;
    color?: string;
    finish?: string;
    material?: string;
    [key: string]: string | undefined;
  };
  imageUrl?: string;
}

export interface ReviewItem {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  sku?: string;
  barcode?: string;
  inventoryCount: number;
  trackQuantity: boolean;
  isPublished: boolean;
  images: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  categoryId: string;
  categoryName?: string;
  variants: ProductVariant[];
  reviews?: ReviewItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'MTN_MOMO' | 'AIRTEL_MONEY' | 'CASH_ON_DELIVERY' | 'CREDIT_CARD';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItemDetail {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  variantId?: string;
  variantTitle?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  attributes?: Record<string, string>;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  mobileMoneyNumber?: string;
  mobileMoneyTxId?: string;
  stripePaymentIntentId?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  notes?: string;
  items: OrderItemDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  product: ProductItem;
  variant?: ProductVariant;
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  tags: string[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface AnalyticsMetricSummary {
  totalRevenue: number;
  previousRevenue: number;
  revenueChangePercent: number;
  averageOrderValue: number;
  previousAov: number;
  aovChangePercent: number;
  totalOrders: number;
  conversionRate: number;
  conversionRateChangePercent: number;
  monthlyRevenueTrend: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  topSellingProducts: Array<{
    id: string;
    title: string;
    salesCount: number;
    revenue: number;
    inventory: number;
  }>;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
