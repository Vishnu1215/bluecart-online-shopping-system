import { Coupon } from '../types';
import { db } from '../db/localStorageDb';

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message: string;
}

/**
 * Validates a coupon code against cart subtotal and calculates discount (FR-16, FR-29, Algorithm 6.4.3)
 */
export function validateAndApplyCoupon(
  code: string, 
  subtotal: number, 
  customCoupons?: Coupon[]
): CouponValidationResult {
  if (!code || !code.trim()) {
    return { valid: false, discountAmount: 0, message: 'Please enter a coupon code.' };
  }

  const normalizedCode = code.trim().toUpperCase();
  const couponList = customCoupons || db.get('coupons') || [];
  const coupon = couponList.find(c => c.code.toUpperCase() === normalizedCode);

  if (!coupon) {
    return { valid: false, discountAmount: 0, message: 'Invalid coupon code.' };
  }

  if (!coupon.isActive) {
    return { valid: false, discountAmount: 0, message: 'This coupon is currently inactive.' };
  }

  const now = new Date();
  const validFrom = new Date(coupon.validFrom);
  const validTo = new Date(coupon.validTo);

  if (now < validFrom) {
    return { valid: false, discountAmount: 0, message: 'This coupon is not yet active.' };
  }

  if (now > validTo) {
    return { valid: false, discountAmount: 0, message: 'This coupon has expired.' };
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, discountAmount: 0, message: 'Coupon usage limit has been exhausted.' };
  }

  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return { 
      valid: false, 
      discountAmount: 0, 
      message: `Minimum order subtotal of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for this coupon.` 
    };
  }

  // Calculate discount based on algorithm 6.4.3
  let discount = coupon.type === 'percent' 
    ? (subtotal * coupon.value) / 100 
    : coupon.value;

  // Capped at subtotal so total does not become negative
  discount = Math.min(Math.round(discount), subtotal);

  return {
    valid: true,
    coupon,
    discountAmount: discount,
    message: `Coupon ${coupon.code} applied successfully! You saved ₹${discount.toLocaleString('en-IN')}.`
  };
}
