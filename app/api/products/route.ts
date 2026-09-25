import { NextRequest, NextResponse } from 'next/server';
import { ProductCreateInputSchema, ProductFilterQuerySchema } from '@/lib/zod-schemas';
import { ProductItem } from '@/lib/types';

// In-memory persistent catalog for API routes
let PRODUCTS_STORE: ProductItem[] = [
  {
    id: 'prod_1',
    title: 'KINETIC Studio Machined Keyboard',
    slug: 'kinetic-studio-machined-keyboard',
    description: 'Precision CNC-milled 6063 aerospace aluminum case with custom tuned tactile switches, seamless brass weight, and hot-swappable PCB.',
    price: 349.00,
    compareAtPrice: 399.00,
    inventoryCount: 14,
    trackQuantity: true,
    isPublished: true,
    images: ['/src/assets/images/product_keyboard_1790375116724.jpg'],
    tags: ['Mechanical', 'Machined', 'Limited Edition'],
    rating: 4.9,
    reviewCount: 42,
    categoryId: 'cat_hardware',
    categoryName: 'Hardware & Workspaces',
    variants: [
      { id: 'v1', productId: 'prod_1', title: 'Matte Graphite / Tactile Slate', sku: 'KB-6063-GR', price: 349.00, inventoryCount: 8, attributes: { finish: 'Graphite', switch: 'Tactile' } },
      { id: 'v2', productId: 'prod_1', title: 'Anodized Silver / Linear Silent', sku: 'KB-6063-SV', price: 349.00, inventoryCount: 6, attributes: { finish: 'Silver', switch: 'Linear' } }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_2',
    title: 'Precision Acoustic Studio Over-Ears',
    slug: 'precision-acoustic-studio-over-ears',
    description: 'Bespoke 50mm beryllium drivers, memory foam lambskin pads, and balanced analog amplification. Tuned for reference audio production.',
    price: 489.00,
    compareAtPrice: 549.00,
    inventoryCount: 22,
    trackQuantity: true,
    isPublished: true,
    images: ['/src/assets/images/product_headphones_1790375126300.jpg'],
    tags: ['Audio', 'Audiophile', 'Acoustic'],
    rating: 4.95,
    reviewCount: 68,
    categoryId: 'cat_audio',
    categoryName: 'Acoustics & Audio',
    variants: [
      { id: 'v3', productId: 'prod_2', title: 'Gunmetal / Charcoal Leather', sku: 'HP-50BE-GM', price: 489.00, inventoryCount: 14, attributes: { color: 'Gunmetal' } },
      { id: 'v4', productId: 'prod_2', title: 'Brushed Titanium / Raw Leather', sku: 'HP-50BE-TI', price: 529.00, inventoryCount: 8, attributes: { color: 'Titanium' } }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_3',
    title: 'Architectural Pour-Over Stoneware Carafe',
    slug: 'architectural-pour-over-stoneware-carafe',
    description: 'Hand-thrown high-fired stoneware with precision laser-etched stainless mesh extraction cone. Double-walled thermal retention.',
    price: 128.00,
    inventoryCount: 31,
    trackQuantity: true,
    isPublished: true,
    images: ['/src/assets/images/product_carafe_1790375136673.jpg'],
    tags: ['Ceramics', 'Craft', 'Kitchen'],
    rating: 4.88,
    reviewCount: 31,
    categoryId: 'cat_ceramics',
    categoryName: 'Objects & Rituals',
    variants: [
      { id: 'v5', productId: 'prod_3', title: 'Raw Sandstone Matte', sku: 'CF-750-SD', price: 128.00, inventoryCount: 19, attributes: { material: 'Sandstone' } },
      { id: 'v6', productId: 'prod_3', title: 'Obsidian Glaze', sku: 'CF-750-OB', price: 138.00, inventoryCount: 12, attributes: { material: 'Obsidian' } }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const parsedQuery = ProductFilterQuerySchema.safeParse(queryParams);
    if (!parsedQuery.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_QUERY_PARAMETERS',
            message: 'Query validation failed',
            details: parsedQuery.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { query, category, minPrice, maxPrice, minRating, sortBy } = parsedQuery.data;

    let filtered = [...PRODUCTS_STORE];

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.categoryId === category);
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    if (minRating !== undefined) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    // Sort order
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'newest') filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: filtered,
      meta: {
        total: filtered.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'An unexpected error occurred while querying products',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Input sanitization and validation
    const validationResult = ProductCreateInputSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid product payload provided',
            details: validationResult.error.format(),
          },
        },
        { status: 422 }
      );
    }

    const data = validationResult.data;

    // Check slug uniqueness
    if (PRODUCTS_STORE.some((p) => p.slug === data.slug)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SLUG_CONFLICT',
            message: 'A product with this URL slug already exists',
          },
        },
        { status: 409 }
      );
    }

    const newProduct: ProductItem = {
      id: `prod_${Date.now()}`,
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? undefined,
      costPerItem: data.costPerItem ?? undefined,
      sku: data.sku ?? undefined,
      barcode: data.barcode ?? undefined,
      inventoryCount: data.inventoryCount,
      trackQuantity: data.trackQuantity,
      isPublished: data.isPublished,
      images: data.images,
      tags: data.tags,
      rating: 5.0,
      reviewCount: 0,
      categoryId: data.categoryId,
      categoryName:
        data.categoryId === 'cat_hardware'
          ? 'Hardware & Workspaces'
          : data.categoryId === 'cat_audio'
          ? 'Acoustics & Audio'
          : 'Objects & Rituals',
      variants: data.variants.map((v, i) => ({
        id: `v_${Date.now()}_${i}`,
        productId: `prod_${Date.now()}`,
        title: v.title,
        sku: v.sku,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        inventoryCount: v.inventoryCount,
        attributes: v.attributes,
        imageUrl: v.imageUrl || undefined,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    PRODUCTS_STORE.unshift(newProduct);

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_MUTATION_FAILED',
          message: error.message || 'Failed to insert product record',
        },
      },
      { status: 500 }
    );
  }
}
