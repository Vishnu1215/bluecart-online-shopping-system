/**
 * Sanitizer Service (NFR-07)
 * Sanitizes all user inputs to prevent injection attacks (NoSQL injection, XSS).
 */

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  // 1. Strip HTML tags / script tags
  let sanitized = input.replace(/<[^>]*>?/gm, '');

  // 2. Strip NoSQL operator prefixes ($where, $gt, $regex, etc.)
  sanitized = sanitized.replace(/\$[a-zA-Z0-9_]+/g, '');

  // 3. Escape dangerous quotes / angle brackets that might have bypassed
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  return sanitized.trim();
}

/**
 * Deep sanitizer for request payloads and form objects
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeInput(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Disallow keys starting with $ (NoSQL operator injection)
      if (key.startsWith('$')) continue;
      cleaned[key] = sanitizeObject(value);
    }
    return cleaned as T;
  }
  return obj;
}
