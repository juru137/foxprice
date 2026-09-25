import { NextRequest, NextResponse } from 'next/server';
import { CheckoutInputSchema } from '@/lib/zod-schemas';
import { OrderRecord, OrderItemDetail } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();

    // 1. Validate payload against Zod schema
    const validationResult = CheckoutInputSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CHECKOUT_PAYLOAD',
            message: 'Shipping and payment data validation failed',
            details: validationResult.error.format(),
          },
        },
        { status: 422 }
      );
    }

    const { shippingAddress, items, promoCode, notes } = validationResult.data;

    // 2. Fetch authoritative prices & calculate subtotals (Stripe server-side principle)
    // Server authority prevents client-side price manipulation
    let subtotal = 0;
    const computedItems: OrderItemDetail[] = items.map((item, index) => {
      // Pricing lookup (simulated authoritative database retrieval)
      let unitPrice = 349.00;
      let title = 'KINETIC Studio Machined Keyboard';
      let img = '/src/assets/images/product_keyboard_1790375116724.jpg';

      if (item.productId === 'prod_2') {
        unitPrice = 489.00;
        title = 'Precision Acoustic Studio Over-Ears';
        img = '/src/assets/images/product_headphones_1790375126300.jpg';
      } else if (item.productId === 'prod_3') {
        unitPrice = 128.00;
        title = 'Architectural Pour-Over Stoneware Carafe';
        img = '/src/assets/images/product_carafe_1790375136673.jpg';
      }

      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      return {
        id: `ord_item_${Date.now()}_${index}`,
        productId: item.productId,
        productTitle: title,
        productImage: img,
        variantId: item.variantId || undefined,
        quantity: item.quantity,
        unitPrice,
        subtotal: lineTotal,
      };
    });

    // Calculate taxes, shipping, discounts
    const discountAmount = promoCode?.toUpperCase() === 'ARCHITECT10' ? subtotal * 0.1 : 0.00;
    const shippingAmount = subtotal > 300 ? 0.00 : 25.00;
    const taxAmount = (subtotal - discountAmount) * 0.08; // 8% sales tax calculation
    const totalAmount = subtotal - discountAmount + shippingAmount + taxAmount;

    // 3. Generate secure Stripe Payment Intent ID
    const mockStripePaymentIntentId = `pi_${Math.random().toString(36).substring(2, 14)}_${Date.now()}`;
    const orderNumber = `KIN-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderRecord: OrderRecord = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerEmail: shippingAddress.email,
      customerName: shippingAddress.fullName,
      shippingAddress,
      subtotal,
      taxAmount: Math.round(taxAmount * 100) / 100,
      shippingAmount,
      discountAmount: Math.round(discountAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status: 'PROCESSING',
      paymentStatus: 'PAID',
      stripePaymentIntentId: mockStripePaymentIntentId,
      carrier: 'DHL Express Worldwide',
      trackingNumber: `DHL-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      notes: notes || undefined,
      items: computedItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          order: orderRecord,
          stripeClientSecret: `${mockStripePaymentIntentId}_secret_${Math.random().toString(36).substring(2, 10)}`,
          receiptUrl: `/orders/receipt/${orderRecord.orderNumber}`,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CHECKOUT_PROCESSING_ERROR',
          message: error.message || 'Payment intent creation failed',
        },
      },
      { status: 500 }
    );
  }
}
