import { describe, it, expect, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { processLogin } from '../services/auth.service';
import { db } from '../db/localStorageDb';
import { User } from '../types';

describe('TC-30: Account Lockout Security (FR-07, Algorithm 6.4.1)', () => {
  const testUser: User = {
    id: 'usr_test_lock',
    email: 'locktest@bluecart.in',
    name: 'Lock Test User',
    passwordHash: bcrypt.hashSync('Test@1234', 8),
    role: 'customer',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    mobile: '9876543210',
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    db.set('users', [{ ...testUser }]);
  });

  it('allows login with valid credentials', () => {
    const res = processLogin('locktest@bluecart.in', 'Test@1234');
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.token).toBeDefined();
  });

  it('rejects invalid password and increments failedAttempts counter', () => {
    const res = processLogin('locktest@bluecart.in', 'WrongPass1');
    expect(res.success).toBe(false);
    expect(res.statusCode).toBe(401);

    const userInDb = db.findById<User>('users', 'usr_test_lock');
    expect(userInDb?.failedAttempts).toBe(1);
  });

  it('locks the account for 15 minutes after 5 consecutive failures (Algorithm 6.4.1)', () => {
    // 4 failed attempts
    for (let i = 1; i <= 4; i++) {
      const res = processLogin('locktest@bluecart.in', `WrongPass${i}`);
      expect(res.success).toBe(false);
      expect(res.statusCode).toBe(401);
    }

    // 5th failed attempt -> locks account
    const fifthAttempt = processLogin('locktest@bluecart.in', 'WrongPass5');
    expect(fifthAttempt.success).toBe(false);

    const lockedUser = db.findById<User>('users', 'usr_test_lock');
    expect(lockedUser?.failedAttempts).toBe(5);
    expect(lockedUser?.status).toBe('Locked');
    expect(lockedUser?.lockUntil).toBeGreaterThan(Date.now());

    // 6th attempt with correct password still fails with HTTP 423 Locked
    const attemptDuringLock = processLogin('locktest@bluecart.in', 'Test@1234');
    expect(attemptDuringLock.success).toBe(false);
    expect(attemptDuringLock.statusCode).toBe(423);
    expect(attemptDuringLock.errorMessage).toContain('Account locked');
    expect(attemptDuringLock.lockRemainingSeconds).toBeGreaterThan(0);
  });

  it('resets failed attempt counter to 0 upon successful authentication before lockout', () => {
    processLogin('locktest@bluecart.in', 'WrongPass1');
    processLogin('locktest@bluecart.in', 'WrongPass2');
    let userInDb = db.findById<User>('users', 'usr_test_lock');
    expect(userInDb?.failedAttempts).toBe(2);

    // Correct login resets counter
    const successRes = processLogin('locktest@bluecart.in', 'Test@1234');
    expect(successRes.success).toBe(true);

    userInDb = db.findById<User>('users', 'usr_test_lock');
    expect(userInDb?.failedAttempts).toBe(0);
  });
});
