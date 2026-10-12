import { db } from '../db/localStorageDb';
import { Coupon } from '../types';
import { logAuditEvent } from '../services/audit.service';
import { simulateLatency, okResponse, createdResponse, errorResponse, ApiResponse } from './mockClient';

export interface CreateCouponDto {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  minOrderValue?: number;
}

export const couponsApi = {
  async getCoupons(): Promise<ApiResponse<Coupon[]>> {
    await simulateLatency();
    const coupons = db.get('coupons') || [];
    return okResponse(coupons);
  },

  async createCoupon(dto: CreateCouponDto, actor: string | { id: string; name: string; role: any }): Promise<ApiResponse<Coupon>> {
    await simulateLatency();
    const cleanCode = dto.code.trim().toUpperCase();

    if (!cleanCode || dto.value <= 0 || dto.usageLimit <= 0) {
      return errorResponse(400, 'Invalid coupon parameters.');
    }

    const fromDate = new Date(dto.validFrom);
    const toDate = new Date(dto.validTo);
    if (toDate <= fromDate) {
      return errorResponse(400, 'End date must be strictly after start date.');
    }

    const all = db.get('coupons') || [];
    if (all.some(c => c.code.toUpperCase() === cleanCode)) {
      return errorResponse(400, `Coupon with code "${cleanCode}" already exists.`);
    }

    const newCoupon: Coupon = {
      id: `cpn_${Date.now()}`,
      code: cleanCode,
      type: dto.type,
      value: dto.value,
      validFrom: dto.validFrom,
      validTo: dto.validTo,
      usageLimit: dto.usageLimit,
      usedCount: 0,
      isActive: true,
      minOrderValue: dto.minOrderValue || 0
    };

    db.insert<Coupon>('coupons', newCoupon);

    const actorObj = typeof actor === 'string' ? { id: 'admin', name: actor, role: 'admin' as const } : actor;
    logAuditEvent(actorObj, 'COUPON_CREATE', 'coupon', newCoupon.id, null, newCoupon);

    return createdResponse(newCoupon, `Coupon ${cleanCode} created successfully.`);
  },

  async toggleCouponActive(couponId: string, actor: string | { id: string; name: string; role: any }): Promise<ApiResponse<Coupon>> {
    await simulateLatency();
    const existing = db.findById<Coupon>('coupons', couponId);
    if (!existing) return errorResponse(404, 'Coupon not found');

    const before = { ...existing };
    const updated = db.update<Coupon>('coupons', couponId, c => {
      c.isActive = !c.isActive;
    });

    const actorObj = typeof actor === 'string' ? { id: 'admin', name: actor, role: 'admin' as const } : actor;
    logAuditEvent(actorObj, 'COUPON_TOGGLE_ACTIVE', 'coupon', couponId, before, updated);

    return okResponse(updated!, `Coupon ${updated!.code} is now ${updated!.isActive ? 'Active' : 'Disabled'}.`);
  },

  async updateCoupon(couponId: string, partial: Partial<Coupon>, actor?: string | { id: string; name: string; role: any }): Promise<ApiResponse<Coupon>> {
    await simulateLatency();
    const existing = db.findById<Coupon>('coupons', couponId);
    if (!existing) return errorResponse(404, 'Coupon not found');

    const before = { ...existing };
    const updated = db.update<Coupon>('coupons', couponId, c => {
      Object.assign(c, partial);
    });

    const actorObj = typeof actor === 'string' ? { id: 'admin', name: actor, role: 'admin' as const } : actor || { id: 'admin', name: 'Admin', role: 'admin' as const };
    logAuditEvent(actorObj, 'COUPON_UPDATE', 'coupon', couponId, before, updated);

    return okResponse(updated!, 'Coupon updated successfully.');
  }
};
