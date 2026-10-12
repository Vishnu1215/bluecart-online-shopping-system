import bcrypt from 'bcryptjs';
import { db } from '../db/localStorageDb';
import { User, UserRole } from '../types';
import { processLogin, LoginResult } from '../services/auth.service';
import { sanitizeInput } from '../services/sanitizer.service';
import { simulateLatency, okResponse, createdResponse, errorResponse, ApiResponse } from './mockClient';
import { logAuditEvent } from '../services/audit.service';

export interface RegisterDto {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export const authApi = {
  async login(emailOrUsername: string, passwordPlain: string, roleCheck?: UserRole): Promise<ApiResponse<LoginResult>> {
    await simulateLatency();
    const result = processLogin(sanitizeInput(emailOrUsername), passwordPlain, roleCheck);
    if (!result.success) {
      return errorResponse(result.statusCode, result.errorMessage || 'Authentication failed');
    }
    return okResponse(result, 'Login successful');
  },

  async register(data: RegisterDto): Promise<ApiResponse<User>> {
    await simulateLatency();
    const cleanEmail = sanitizeInput(data.email).toLowerCase();
    const cleanName = sanitizeInput(data.name);
    const cleanMobile = sanitizeInput(data.mobile);

    // Validation
    if (!cleanEmail || !cleanName || !data.password) {
      return errorResponse(400, 'All fields are required.');
    }

    const existingUsers = db.get('users') || [];
    const duplicate = existingUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (duplicate) {
      return errorResponse(400, 'An account with this email address already exists (FR-01).');
    }

    // Hash password with bcrypt cost 10 (NFR-04)
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(data.password, salt);

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      mobile: cleanMobile,
      passwordHash,
      role: 'customer',
      status: 'Active',
      failedAttempts: 0,
      lockUntil: null,
      createdAt: new Date().toISOString(),
      avatar: cleanName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      savedAddresses: [],
      preferences: {
        orderNotifications: true,
        shippingNotifications: true
      }
    };

    db.insert<User>('users', newUser);
    return createdResponse(newUser, 'Account registered successfully.');
  },

  async requestPasswordReset(email: string): Promise<ApiResponse<{ token: string; expiresAt: string }>> {
    await simulateLatency();
    const cleanEmail = sanitizeInput(email).toLowerCase();
    const user = db.findOne<User>('users', u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return errorResponse(404, 'No account found with this email address.');
    }

    // 15-minute verification link (FR-06)
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return okResponse({ token: resetToken, expiresAt }, 'Password reset verification email simulated.');
  },

  async resetPassword(email: string, token: string, newPasswordPlain: string): Promise<ApiResponse<boolean>> {
    await simulateLatency();
    const cleanEmail = sanitizeInput(email).toLowerCase();
    const user = db.findOne<User>('users', u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return errorResponse(404, 'User not found.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(newPasswordPlain, salt);

    db.update<User>('users', user.id, u => {
      u.passwordHash = passwordHash;
      u.failedAttempts = 0;
      u.lockUntil = null;
      if (u.status === 'Locked') u.status = 'Active';
    });

    logAuditEvent(
      { id: user.id, name: user.name, role: user.role },
      'PASSWORD_RESET',
      'user',
      user.id,
      null,
      { status: 'Password reset completed' }
    );

    return okResponse(true, 'Password updated successfully. You can now log in.');
  }
};
