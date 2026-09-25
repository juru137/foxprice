import { z } from 'zod';

export const VariantAttributeSchema = z.record(z.string(), z.string());

export const ProductVariantInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Variant title is required'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  compareAtPrice: z.coerce.number().positive('Compare at price must be positive').optional(),
  inventoryCount: z.coerce.number().int().nonnegative('Inventory must be 0 or higher').default(0),
  attributes: z.record(z.string(), z.string()).default({}),
  imageUrl: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
});

export const ProductCreateInputSchema = z.object({
  title: z.string().trim().min(3, 'Product title must be at least 3 characters').max(180, 'Title too long'),
  slug: z.string().trim().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  costPerItem: z.coerce.number().nonnegative().optional().nullable(),
  sku: z.string().trim().min(2, 'SKU must be at least 2 characters').optional().nullable(),
  barcode: z.string().trim().optional().nullable(),
  inventoryCount: z.coerce.number().int().nonnegative('Inventory cannot be negative').default(0),
  trackQuantity: z.boolean().default(true),
  isPublished: z.boolean().default(true),
  categoryId: z.string().min(1, 'Please select a category'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one product image is required'),
  tags: z.array(z.string().trim()).default([]),
  variants: z.array(ProductVariantInputSchema).default([]),
});

export const ProductUpdateInputSchema = ProductCreateInputSchema.partial().extend({
  id: z.string().min(1, 'Product ID is required'),
});

export const ShippingAddressSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required (min 2 characters)'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().min(7, 'Valid contact phone number is required'),
  street: z.string().trim().min(4, 'Street address is required'),
  apartment: z.string().trim().optional(),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State or province is required'),
  postalCode: z.string().trim().min(3, 'Postal/ZIP code is required'),
  country: z.string().trim().min(2, 'Country is required').default('US'),
});

export const CheckoutCartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional().nullable(),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const CheckoutInputSchema = z.object({
  shippingAddress: ShippingAddressSchema,
  items: z.array(CheckoutCartItemSchema).min(1, 'Cart cannot be empty'),
  paymentMethod: z.enum(['card', 'apple_pay', 'google_pay']).default('card'),
  promoCode: z.string().trim().optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
});

export const AdminLoginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const OrderStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  trackingNumber: z.string().trim().optional().nullable(),
  carrier: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
});

export const ProductFilterQuerySchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  tags: z.string().optional(), // comma-separated
  inStockOnly: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  sortBy: z.enum(['featured', 'price-asc', 'price-desc', 'rating', 'newest']).default('featured'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ProductCreateInput = z.infer<typeof ProductCreateInputSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateInputSchema>;
export type CheckoutInput = z.infer<typeof CheckoutInputSchema>;
export type ShippingAddressInput = z.infer<typeof ShippingAddressSchema>;
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
export type OrderStatusUpdateInput = z.infer<typeof OrderStatusUpdateSchema>;
export type ProductFilterQuery = z.infer<typeof ProductFilterQuerySchema>;
