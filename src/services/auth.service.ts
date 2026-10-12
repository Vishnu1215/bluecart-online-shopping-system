import bcrypt from 'bcryptjs';
import { db } from '../db/localStorageDb';
import { User, UserRole } from '../types';
import { signToken } from './jwt-sim';

export interface LoginResult {
  success: boolean;
  statusCode: 200 | 400 | 401 | 403 | 423;
  user?: User;
  token?: string;
  errorMessage?: string;
  lockRemainingSeconds?: number;
}

/**
 * Login algorithm with 15-minute account lockout after 5 consecutive failures (Algorithm 6.4.1, FR-02, FR-07)
 */
export function processLogin(emailOrUsername: string, passwordPlain: string, roleCheck?: UserRole): LoginResult {
  const users = db.get('users') || [];
  const normalized = emailOrUsername.trim().toLowerCase();
  
  // Find user by email or name/username
  const user = users.find(u => 
    u.email.toLowerCase() === normalized || 
    u.name.toLowerCase() === normalized
  );

  if (!user) {
    return {
      success: false,
      statusCode: 401,
      errorMessage: 'Invalid email or password.'
    };
  }

  // Check role match if requested
  if (roleCheck && user.role !== roleCheck) {
    return {
      success: false,
      statusCode: 403,
      errorMessage: `Access denied. Account is not registered as ${roleCheck}.`
    };
  }

  // Check if account is suspended
  if (user.status === 'Suspended') {
    return {
      success: false,
      statusCode: 403,
      errorMessage: 'This account has been suspended by an administrator. Please contact support.'
    };
  }

  // Check if account is pending approval (vendor approval demo)
  if (user.status === 'Pending') {
    return {
      success: false,
      statusCode: 403,
      errorMessage: 'Account is pending Administrator approval. You will receive notification once activated.'
    };
  }

  const now = Date.now();

  // Check account lockout
  if (user.lockUntil && user.lockUntil > now) {
    const remainingSeconds = Math.ceil((user.lockUntil - now) / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return {
      success: false,
      statusCode: 423,
      lockRemainingSeconds: remainingSeconds,
      errorMessage: `Account locked due to 5 consecutive failed login attempts. Try again in ${formatted}.`
    };
  }

  // Verify bcrypt password hash (NFR-04)
  const passwordMatch = bcrypt.compareSync(passwordPlain, user.passwordHash);

  if (passwordMatch) {
    // Reset failed attempts on success
    db.update<User>('users', user.id, u => {
      u.failedAttempts = 0;
      u.lockUntil = null;
      if (u.status === 'Locked') {
        u.status = 'Active';
      }
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    return {
      success: true,
      statusCode: 200,
      user,
      token
    };
  } else {
    // Increment failed attempts
    const newAttempts = (user.failedAttempts || 0) + 1;
    let lockUntil: number | null = null;
    let status = user.status;

    if (newAttempts >= 5) {
      lockUntil = now + (15 * 60 * 1000); // 15 minutes lockout
      status = 'Locked';
    }

    db.update<User>('users', user.id, u => {
      u.failedAttempts = newAttempts;
      u.lockUntil = lockUntil;
      u.status = status;
    });

    if (newAttempts >= 5) {
      return {
        success: false,
        statusCode: 423,
        lockRemainingSeconds: 15 * 60,
        errorMessage: 'Account locked for 15 minutes due to 5 consecutive failed login attempts.'
      };
    }

    const remainingTries = 5 - newAttempts;
    return {
      success: false,
      statusCode: 401,
      errorMessage: `Invalid credentials. ${remainingTries} attempt${remainingTries === 1 ? '' : 's'} remaining before 15-minute account lockout.`
    };
  }
}
