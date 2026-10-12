import { CartItem } from '../types';
import { validateAndApplyCoupon } from './coupon.service';
import { db } from '../db/localStorageDb';

export interface PricingBreakdown {
  subtotal: number;
  couponDiscount: number;
  discountedSubtotal: number;
  taxAmount: number;
  shippingCost: number;
  grandTotal: number;
  freeShippingApplied: boolean;
  couponCode?: string;
  itemCount: number;
}

/**
 * Calculates authoritative server-side pricing breakdown
 * Formula: subtotal − coupon discount + shipping + tax (GST 18% on discounted subtotal)
 */
export function calculateOrderPricing(
  items: Array<{ price: number; qty: number }>,
  couponCode?: string,
  shippingMethod: 'standard' | 'express' = 'standard'
): PricingBreakdown {
  const settings = db.get('systemSettings') || {
    taxRatePct: 18,
    freeShippingThreshold: 5000,
    standardShippingFee: 49,
    expressShippingFee: 149
  };

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  let couponDiscount = 0;
  if (couponCode && couponCode.trim()) {
    const couponResult = validateAndApplyCoupon(couponCode, subtotal);
    if (couponResult.valid) {
      couponDiscount = couponResult.discountAmount;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
  const taxAmount = Math.round((discountedSubtotal * (settings.taxRatePct || 18)) / 100);

  const qualifiesFreeShipping = subtotal >= (settings.freeShippingThreshold || 5000);
  let shippingCost = 0;

  if (shippingMethod === 'express') {
    shippingCost = settings.expressShippingFee || 149;
  } else {
    shippingCost = qualifiesFreeShipping ? 0 : (settings.standardShippingFee || 49);
  }

  const grandTotal = discountedSubtotal + taxAmount + shippingCost;

  return {
    subtotal,
    couponDiscount,
    discountedSubtotal,
    taxAmount,
    shippingCost,
    grandTotal,
    freeShippingApplied: qualifiesFreeShipping && shippingMethod === 'standard',
    couponCode: couponDiscount > 0 ? couponCode?.toUpperCase() : undefined,
    itemCount
  };
}
