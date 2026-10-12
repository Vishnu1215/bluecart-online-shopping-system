import bcrypt from 'bcryptjs';
import { db } from '../db/localStorageDb';
import { User, Address, UserStatus } from '../types';
import { sanitizeInput } from '../services/sanitizer.service';
import { logAuditEvent } from '../services/audit.service';
import { simulateLatency, okResponse, errorResponse, ApiResponse } from './mockClient';

export const usersApi = {
  async getCustomers(): Promise<ApiResponse<User[]>> {
    await simulateLatency();
    const all = db.get('users') || [];
    const customers = all.filter(u => u.role === 'customer');
    return okResponse(customers);
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    await simulateLatency();
    const user = db.findById<User>('users', id);
    if (!user) return errorResponse(404, 'User not found');
    return okResponse(user);
  },

  async updateUserStatus(
    userId: string, 
    status: UserStatus, 
    actor: { id: string; name: string; role: 'admin' },
    reason?: string
  ): Promise<ApiResponse<User>> {
    await simulateLatency();
    const existing = db.findById<User>('users', userId);
    if (!existing) return errorResponse(404, 'User not found');

    const before = { ...existing };
    const updated = db.update<User>('users', userId, u => {
      u.status = status;
      if (status === 'Active') {
        u.failedAttempts = 0;
        u.lockUntil = null;
      }
    });

    logAuditEvent(actor, 'USER_STATUS_CHANGE', 'user', userId, before, { ...updated, reason });

    return okResponse(updated!, `User account status updated to ${status}.`);
  },

  async updateProfile(userId: string, data: { name?: string; mobile?: string }): Promise<ApiResponse<User>> {
    await simulateLatency();
    const existing = db.findById<User>('users', userId);
    if (!existing) return errorResponse(404, 'User not found');

    const updated = db.update<User>('users', userId, u => {
      if (data.name) u.name = sanitizeInput(data.name);
      if (data.mobile) u.mobile = sanitizeInput(data.mobile);
    });

    return okResponse(updated!, 'Profile updated successfully.');
  },

  async saveAddress(userId: string, address: Address): Promise<ApiResponse<Address[]>> {
    await simulateLatency();
    const user = db.findById<User>('users', userId);
    if (!user) return errorResponse(404, 'User not found');

    const addresses = user.savedAddresses || [];
    const existingIndex = addresses.findIndex(a => a.id === address.id);

    if (existingIndex > -1) {
      addresses[existingIndex] = address;
    } else {
      addresses.push(address);
    }

    if (address.isDefault) {
      addresses.forEach(a => {
        if (a.id !== address.id) a.isDefault = false;
      });
    }

    db.update<User>('users', userId, u => {
      u.savedAddresses = addresses;
    });

    return okResponse(addresses, 'Address saved.');
  },

  async deleteAddress(userId: string, addressId: string): Promise<ApiResponse<Address[]>> {
    await simulateLatency();
    const user = db.findById<User>('users', userId);
    if (!user) return errorResponse(404, 'User not found');

    const filtered = (user.savedAddresses || []).filter(a => a.id !== addressId);
    db.update<User>('users', userId, u => {
      u.savedAddresses = filtered;
    });

    return okResponse(filtered, 'Address deleted.');
  },

  async updateNotificationPreferences(
    userId: string, 
    prefs: { orderNotifications: boolean; shippingNotifications: boolean }
  ): Promise<ApiResponse<User>> {
    await simulateLatency();
    const user = db.findById<User>('users', userId);
    if (!user) return errorResponse(404, 'User not found');

    const updated = db.update<User>('users', userId, u => {
      u.preferences = prefs;
    });

    return okResponse(updated!, 'Notification preferences saved.');
  },

  async updatePreferences(
    userId: string,
    prefs: { orderNotifications: boolean; shippingNotifications: boolean }
  ): Promise<ApiResponse<User>> {
    return this.updateNotificationPreferences(userId, prefs);
  },

  async getUsers(params: { role?: string } = {}): Promise<ApiResponse<User[]>> {
    await simulateLatency();
    const all = db.get('users') || [];
    if (params.role) {
      return okResponse(all.filter(u => u.role === params.role));
    }
    return okResponse(all);
  },

  async updateStatus(
    userId: string,
    status: UserStatus,
    actor: string | { id: string; name: string; role: 'admin' } = 'admin',
    reason?: string
  ): Promise<ApiResponse<User>> {
    const actorObj = typeof actor === 'string' ? { id: actor, name: actor, role: 'admin' as const } : actor;
    return this.updateUserStatus(userId, status, actorObj, reason);
  },

  async unlockAccount(userId: string, actor: string | { id: string; name: string; role: 'admin' } = 'admin'): Promise<ApiResponse<User>> {
    const actorObj = typeof actor === 'string' ? { id: actor, name: actor, role: 'admin' as const } : actor;
    return this.updateUserStatus(userId, 'Active', actorObj, 'Lockout cleared by administrator');
  },

  async changePassword(
    userId: string, 
    currentPasswordPlain: string, 
    newPasswordPlain: string
  ): Promise<ApiResponse<boolean>> {
    await simulateLatency();
    const user = db.findById<User>('users', userId);
    if (!user) return errorResponse(404, 'User not found');

    const matches = bcrypt.compareSync(currentPasswordPlain, user.passwordHash);
    if (!matches) {
      return errorResponse(400, 'Current password does not match.');
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPasswordPlain, salt);

    db.update<User>('users', userId, u => {
      u.passwordHash = newHash;
    });

    return okResponse(true, 'Password changed successfully.');
  }
};
