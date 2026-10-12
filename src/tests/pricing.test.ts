import { describe, it, expect, beforeEach } from 'vitest';
import { calculateOrderPricing } from '../services/pricing.service';
import { db } from '../db/localStorageDb';

describe('TC-13: Pricing Calculation Service (SRS 6.3, Algorithm 6.4.2)', () => {
  beforeEach(() => {
    db.set('systemSettings', {
      lowStockThreshold: 40,
      returnWindowDays: 7,
      taxRatePct: 18,
      freeShippingThreshold: 5000,
      standardShippingFee: 49,
      expressShippingFee: 149
    });
  });

  it('calculates subtotal correctly for multiple cart lines', () => {
    const items = [
      { price: 3499, qty: 1 },
      { price: 1499, qty: 2 }
    ];
    const pricing = calculateOrderPricing(items);
    expect(pricing.subtotal).toBe(3499 + 2998); // 6497
    expect(pricing.itemCount).toBe(3);
  });

  it('applies standard shipping fee (₹49) when order subtotal is below ₹5,000 threshold', () => {
    const items = [{ price: 2799, qty: 1 }];
    const pricing = calculateOrderPricing(items, undefined, 'standard');
    expect(pricing.subtotal).toBe(2799);
    expect(pricing.shippingCost).toBe(49);
    expect(pricing.freeShippingApplied).toBe(false);
  });

  it('applies free shipping when order subtotal is >= ₹5,000 threshold for standard delivery', () => {
    const items = [{ price: 5999, qty: 1 }];
    const pricing = calculateOrderPricing(items, undefined, 'standard');
    expect(pricing.subtotal).toBe(5999);
    expect(pricing.shippingCost).toBe(0);
    expect(pricing.freeShippingApplied).toBe(true);
  });

  it('charges express shipping fee (₹149) regardless of free shipping threshold', () => {
    const items = [{ price: 17999, qty: 1 }];
    const pricing = calculateOrderPricing(items, undefined, 'express');
    expect(pricing.shippingCost).toBe(149);
    expect(pricing.freeShippingApplied).toBe(false);
  });

  it('accurately computes 18% GST tax on discounted subtotal', () => {
    const items = [{ price: 1000, qty: 1 }];
    const pricing = calculateOrderPricing(items, undefined, 'standard');
    // Subtotal = 1000, Tax (18%) = 180, Shipping = 49 -> Grand total = 1229
    expect(pricing.taxAmount).toBe(180);
    expect(pricing.grandTotal).toBe(1000 + 180 + 49);
  });
});
