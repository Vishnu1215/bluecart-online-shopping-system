import { db } from '../db/localStorageDb';
import { Vendor } from '../types';
import { sanitizeInput } from '../services/sanitizer.service';
import { logAuditEvent } from '../services/audit.service';
import { simulateLatency, okResponse, createdResponse, errorResponse, ApiResponse } from './mockClient';

export interface CreateVendorDto {
  name: string;
  contactEmail: string;
  phone: string;
  commissionRate?: number;
  description?: string;
}

export const vendorsApi = {
  async getVendors(): Promise<ApiResponse<Vendor[]>> {
    await simulateLatency();
    const vendors = db.get('vendors') || [];
    return okResponse(vendors);
  },

  async getVendorById(id: string): Promise<ApiResponse<Vendor>> {
    await simulateLatency();
    const vendor = db.findById<Vendor>('vendors', id);
    if (!vendor) return errorResponse(404, 'Vendor not found');
    return okResponse(vendor);
  },

  async createVendor(dto: CreateVendorDto, actor: string | { id: string; name: string; role: 'admin' } = 'admin'): Promise<ApiResponse<Vendor>> {
    await simulateLatency();
    if (!dto.name || !dto.contactEmail) {
      return errorResponse(400, 'Vendor name and contact email are required.');
    }

    const all = db.get('vendors') || [];
    const cleanEmail = sanitizeInput(dto.contactEmail).toLowerCase();
    if (all.some(v => v.contactEmail.toLowerCase() === cleanEmail)) {
      return errorResponse(400, 'A vendor with this contact email already exists.');
    }

    const newVendor: Vendor = {
      id: `vnd_${Date.now()}`,
      name: sanitizeInput(dto.name),
      contactEmail: cleanEmail,
      phone: sanitizeInput(dto.phone),
      status: 'Approved',
      commissionRate: dto.commissionRate || 10,
      description: sanitizeInput(dto.description || ''),
      createdAt: new Date().toISOString()
    };

    db.insert<Vendor>('vendors', newVendor);

    const actorObj = typeof actor === 'string' ? { id: actor, name: actor, role: 'admin' as const } : actor;
    logAuditEvent(actorObj, 'VENDOR_CREATE', 'vendor', newVendor.id, null, newVendor);

    return createdResponse(newVendor, `Vendor ${newVendor.name} created successfully.`);
  },

  async updateVendorStatus(
    vendorId: string, 
    status: 'Approved' | 'Pending' | 'Suspended',
    actor: string | { id: string; name: string; role: 'admin' } = 'admin'
  ): Promise<ApiResponse<Vendor>> {
    await simulateLatency();
    const existing = db.findById<Vendor>('vendors', vendorId);
    if (!existing) return errorResponse(404, 'Vendor not found');

    const actorObj = typeof actor === 'string' ? { id: actor, name: actor, role: 'admin' as const } : actor;
    const before = { ...existing };
    const updated = db.update<Vendor>('vendors', vendorId, v => {
      v.status = status;
    });

    logAuditEvent(actorObj, 'VENDOR_STATUS_CHANGE', 'vendor', vendorId, before, updated);

    return okResponse(updated!, `Vendor status updated to ${status}.`);
  },

  async updateStatus(
    vendorId: string,
    status: 'Approved' | 'Pending' | 'Suspended',
    actor: string | { id: string; name: string; role: 'admin' } = 'admin'
  ): Promise<ApiResponse<Vendor>> {
    return this.updateVendorStatus(vendorId, status, actor);
  }
};
