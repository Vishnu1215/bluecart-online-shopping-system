import { UserRole } from '../types';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = 'bluecart_secret_key_v1_2026';

function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0: break;
    case 2: output += '=='; break;
    case 3: output += '='; break;
    default: throw new Error('Illegal base64url string!');
  }
  return decodeURIComponent(escape(atob(output)));
}

/**
 * Signs a simulated JWT token with 24h expiration (FR-03, NFR-06)
 */
export function signToken(user: { id: string; email: string; role: UserRole; name: string }, expiresInHours: number = 24): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: now,
    exp: now + (expiresInHours * 3600)
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  // Simulated signature with secret
  const signature = base64UrlEncode(`${encodedHeader}.${encodedPayload}.${JWT_SECRET}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes a JWT token. Rejects expired or malformed tokens.
 */
export function verifyToken(token: string): { valid: boolean; payload?: JwtPayload; error?: string } {
  if (!token) return { valid: false, error: 'Token missing' };

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, error: 'Malformed token' };

    const payloadJson = base64UrlDecode(parts[1]);
    const payload: JwtPayload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: 'Invalid token' };
  }
}
