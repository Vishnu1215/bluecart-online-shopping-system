import { db } from '../db/localStorageDb';
import { Address, Cart, Order, Payment, Product, Coupon } from '../types';
import { calculateOrderPricing } from '../services/pricing.service';
import { createNotification } from '../services/notification.service';
import { logAuditEvent } from '../services/audit.service';
import { simulateLatency, okResponse, errorResponse, ApiResponse } from './mockClient';

export interface PaymentDetails {
  method?: 'card' | 'upi' | 'netbanking' | 'cod';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  card?: {
    cardNumber: string;
    expiryDate?: string;
    expMonth?: string;
    expYear?: string;
    cvv: string;
    cardholderName: string;
  };
  upiId?: string;
  bankName?: string;
}

export interface CheckoutPayload {
  userId: string;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: 'standard' | 'express';
  paymentMethod?: 'card' | 'upi' | 'netbanking' | 'cod';
  simulateFailure?: boolean; // TC-17 payment failure simulation toggle
  paymentDetails?: PaymentDetails;
  cardDetails?: {
    cardNumber: string;
    expMonth?: string;
    expYear?: string;
    cvv: string;
    cardholderName: string;
  };
  upiId?: string;
  bankName?: string;
}

export interface CheckoutResult {
  order: Order;
  payment: Payment;
}

export const checkoutApi = {
  /**
   * Re-validates stock for all items before payment (FR-17)
   */
  async validateStock(userId: string): Promise<ApiResponse<{ valid: boolean; errors?: string[] }>> {
    await simulateLatency(100, 200);
    const cart = db.findOne<Cart>('carts', c => c.userId === userId);
    if (!cart || cart.items.length === 0) {
      return errorResponse(400, 'Your cart is empty.');
    }

    const errors: string[] = [];
    const products = db.get('products') || [];

    for (const item of cart.items) {
      const product = products.find(p => p.sku === item.sku || p.id === item.productId);
      if (!product || !product.isActive) {
        errors.push(`Item "${item.name}" is no longer available.`);
      } else if (product.stockQty < item.qty) {
        errors.push(`Insufficient stock for "${item.name}". Only ${product.stockQty} unit(s) remaining (requested ${item.qty}).`);
      }
    }

    if (errors.length > 0) {
      return errorResponse(400, errors.join(' '));
    }

    return okResponse({ valid: true });
  },

  /**
   * Stock-safe atomic checkout and payment commit (Algorithm 6.4.2, FR-11, FR-17, FR-19, FR-20)
   */
  async processCheckout(payload: CheckoutPayload): Promise<ApiResponse<CheckoutResult>> {
    await simulateLatency(300, 600);

    const cart = db.findOne<Cart>('carts', c => c.userId === payload.userId);
    if (!cart || cart.items.length === 0) {
      return errorResponse(400, 'Cart is empty.');
    }

    const user = db.findById<any>('users', payload.userId);
    if (!user) return errorResponse(404, 'User not found.');

    // Step 1: Stock Validation (FR-17)
    const products = db.get('products') || [];
    for (const line of cart.items) {
      const prod = products.find(p => p.sku === line.sku || p.id === line.productId);
      if (!prod || !prod.isActive) {
        return errorResponse(400, `"${line.name}" is no longer active or available.`);
      }
      if (prod.stockQty < line.qty) {
        return errorResponse(400, `Insufficient stock for "${line.name}". Available: ${prod.stockQty}, Requested: ${line.qty}.`);
      }
    }

    // Step 2: Authoritative Server-side Pricing
    const pricing = calculateOrderPricing(
      cart.items.map(i => ({ price: i.price, qty: i.qty })),
      cart.couponCode,
      payload.shippingMethod
    );

    const chosenMethod = payload.paymentMethod || payload.paymentDetails?.method || 'card';
    const cardLast4 = payload.cardDetails?.cardNumber 
      ? payload.cardDetails.cardNumber.slice(-4) 
      : (payload.paymentDetails?.cardNumber ? payload.paymentDetails.cardNumber.slice(-4) : undefined);
    const upiId = payload.upiId || payload.paymentDetails?.upiId;
    const bankName = payload.bankName || payload.paymentDetails?.bankName;

    // Step 3: Payment Session Simulation (TC-17)
    if (payload.simulateFailure) {
      // Simulate failed payment gateway response
      // NO stock decrement, NO order created, retry offered
      const failedPaymentRecord: Payment = {
        id: `pay_fail_${Date.now()}`,
        orderId: 'PENDING_FAILED',
        gatewayRef: `PG_FAIL_${Date.now()}`,
        method: chosenMethod,
        amount: pricing.grandTotal,
        status: 'Failed',
        paidAt: new Date().toISOString()
      };
      db.insert<Payment>('payments', failedPaymentRecord);

      return errorResponse(402, 'Payment authorization failed at the mock gateway. Your account was not charged and stock remains available. Please retry with another payment method.');
    }

    // Step 4: Atomic Commit (Algorithm 6.4.2)
    // 4a. Decrement stock for all lines (FR-11)
    for (const line of cart.items) {
      db.update<Product>('products', line.productId, p => {
        p.stockQty = Math.max(0, p.stockQty - line.qty);
      });
    }

    // 4b. Generate sequential Order ID e.g. ORD-2026-0043
    const allOrders = db.get('orders') || [];
    let maxOrderSeq = 42;
    for (const o of allOrders) {
      if (o.orderId && o.orderId.startsWith('ORD-2026-')) {
        const numPart = parseInt(o.orderId.replace('ORD-2026-', ''), 10);
        if (!isNaN(numPart) && numPart > maxOrderSeq) {
          maxOrderSeq = numPart;
        }
      }
    }
    const nextOrderSeq = maxOrderSeq + 1;
    const orderId = `ORD-2026-${String(nextOrderSeq).padStart(4, '0')}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderId,
      userId: payload.userId,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.mobile,
      items: cart.items.map(i => ({
        productId: i.productId,
        sku: i.sku,
        name: i.name,
        qty: i.qty,
        unitPrice: i.price,
        vendorId: i.vendorId,
        image: i.image
      })),
      shippingAddress: payload.shippingAddress,
      billingAddress: payload.billingAddress,
      shippingMethod: payload.shippingMethod,
      shippingCost: pricing.shippingCost,
      subtotal: pricing.subtotal,
      couponDiscount: pricing.couponDiscount,
      couponCode: pricing.couponCode,
      taxAmount: pricing.taxAmount,
      totalAmount: pricing.grandTotal,
      status: 'Confirmed',
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusTimeline: [
        {
          status: 'Confirmed',
          timestamp: new Date().toISOString(),
          note: 'Payment received. Order confirmed.',
          changedBy: 'System'
        }
      ]
    };
    db.insert<Order>('orders', newOrder);

    // 4c. Record Payment (NFR-08: never store raw card data)
    const paymentRecord: Payment = {
      id: `pay_${Date.now()}`,
      orderId: newOrder.orderId,
      gatewayRef: `PG_CONF_${Math.floor(100000 + Math.random() * 900000)}`,
      method: chosenMethod,
      amount: pricing.grandTotal,
      status: 'Paid',
      paidAt: new Date().toISOString(),
      cardLast4,
      upiId,
      bankName
    };
    db.insert<Payment>('payments', paymentRecord);

    // 4d. Increment coupon usage if applied
    if (cart.couponCode) {
      const coupon = db.findOne<Coupon>('coupons', c => c.code === cart.couponCode);
      if (coupon) {
        db.update<Coupon>('coupons', coupon.id, c => {
          c.usedCount += 1;
        });
      }
    }

    // 4e. Clear customer cart
    db.update<Cart>('carts', cart.userId, c => {
      c.items = [];
      c.couponCode = undefined;
      c.updatedAt = new Date().toISOString();
    });

    // 4f. Dispatch notifications (FR-31)
    createNotification(
      user.id,
      `Order Confirmed: ${newOrder.orderId}`,
      `Thank you for your order! Your payment of ₹${newOrder.totalAmount.toLocaleString('en-IN')} has been received.`,
      'order',
      `/orders/${newOrder.orderId}`
    );

    // Low stock alerts for admin/vendor if stock dropped below threshold
    for (const line of cart.items) {
      const prod = db.findById<Product>('products', line.productId);
      if (prod && prod.stockQty <= 40) {
        createNotification(
          'usr_admin',
          'Low Stock Warning',
          `${prod.name} (${prod.sku}) is below threshold with ${prod.stockQty} units remaining.`,
          'alert',
          '/admin/inventory'
        );
      }
    }

    // 4g. Audit log
    logAuditEvent(
      { id: user.id, name: user.name, role: user.role },
      'ORDER_CREATED',
      'order',
      newOrder.id,
      null,
      { orderId: newOrder.orderId, totalAmount: newOrder.totalAmount }
    );

    return okResponse({
      order: newOrder,
      payment: paymentRecord
    }, 'Order placed successfully!');
  }
};
