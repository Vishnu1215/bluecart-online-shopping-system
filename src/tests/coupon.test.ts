import { describe, it, expect } from 'vitest';
import { validateAndApplyCoupon } from '../services/coupon.service';
import { Coupon } from '../types';

describe('TC-14 & TC-15: Coupon Engine (FR-16, FR-29, Algorithm 6.4.3)', () => {
  const mockCoupons: Coupon[] = [
    {
      id: 'c1',
      code: 'SAVE10',
      type: 'percent',
      value: 10,
      validFrom: '2026-01-01T00:00:00Z',
      validTo: '2026-12-31T23:59:59Z',
      usageLimit: 100,
      usedCount: 10,
      isActive: true,
      minOrderValue: 1000
    },
    {
      id: 'c2',
      code: 'FESTIVE200',
      type: 'flat',
      value: 200,
      validFrom: '2026-01-01T00:00:00Z',
      validTo: '2026-12-31T23:59:59Z',
      usageLimit: 50,
      usedCount: 5,
      isActive: true,
      minOrderValue: 1500
    },
    {
      id: 'c3',
      code: 'EXPIRED50',
      type: 'percent',
      value: 50,
      validFrom: '2025-01-01T00:00:00Z',
      validTo: '2025-06-01T00:00:00Z',
      usageLimit: 50,
      usedCount: 0,
      isActive: true
    },
    {
      id: 'c4',
      code: 'EXHAUSTED',
      type: 'flat',
      value: 100,
      validFrom: '2026-01-01T00:00:00Z',
      validTo: '2026-12-31T23:59:59Z',
      usageLimit: 5,
      usedCount: 5, // Exhausted
      isActive: true
    },
    {
      id: 'c5',
      code: 'INACTIVE',
      type: 'percent',
      value: 15,
      validFrom: '2026-01-01T00:00:00Z',
      validTo: '2026-12-31T23:59:59Z',
      usageLimit: 100,
      usedCount: 0,
      isActive: false // Disabled
    }
  ];

  it('validates and applies 10% percentage discount on qualifying subtotal', () => {
    const result = validateAndApplyCoupon('SAVE10', 3000, mockCoupons);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(300); // 10% of 3000
  });

  it('validates and applies flat discount correctly', () => {
    const result = validateAndApplyCoupon('FESTIVE200', 2000, mockCoupons);
    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(200);
  });

  it('rejects coupon when cart subtotal is below minimum order value (TC-15)', () => {
    const result = validateAndApplyCoupon('SAVE10', 800, mockCoupons); // Requires 1000
    expect(result.valid).toBe(false);
    expect(result.discountAmount).toBe(0);
    expect(result.message).toContain('Minimum order subtotal');
  });

  it('rejects expired coupon code', () => {
    const result = validateAndApplyCoupon('EXPIRED50', 5000, mockCoupons);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('expired');
  });

  it('rejects exhausted coupon code that reached usage limit (TC-15)', () => {
    const result = validateAndApplyCoupon('EXHAUSTED', 2000, mockCoupons);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('exhausted');
  });

  it('rejects disabled/inactive coupon', () => {
    const result = validateAndApplyCoupon('INACTIVE', 2000, mockCoupons);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('inactive');
  });

  it('rejects non-existent coupon code', () => {
    const result = validateAndApplyCoupon('BOGUS_CODE', 2000, mockCoupons);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('Invalid coupon code');
  });
});
