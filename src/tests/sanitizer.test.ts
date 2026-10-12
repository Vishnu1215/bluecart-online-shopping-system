import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeObject } from '../services/sanitizer.service';

describe('NFR-07: Input Sanitization Service (Security / Injection Defense)', () => {
  it('strips HTML script tags from user inputs', () => {
    const malicious = '<script>alert("XSS")</script>Hello World';
    const cleaned = sanitizeInput(malicious);
    expect(cleaned).not.toContain('<script>');
    expect(cleaned).toBe('alert(&quot;XSS&quot;)Hello World');
  });

  it('strips img tag onerror event handlers', () => {
    const malicious = '<img src=x onerror=alert(1)>BlueCart';
    const cleaned = sanitizeInput(malicious);
    expect(cleaned).toBe('BlueCart');
  });

  it('strips NoSQL query injection operator prefixes', () => {
    const malicious = 'admin$where$regex$gt';
    const cleaned = sanitizeInput(malicious);
    expect(cleaned).toBe('admin');
  });

  it('sanitizes nested objects recursively and strips keys with $ operator', () => {
    const payload = {
      name: '<b>John Doe</b>',
      email: 'john@example.com',
      $where: 'this.password != null',
      details: {
        bio: '<script>evil()</script>Author'
      }
    };

    const cleaned = sanitizeObject(payload);
    expect(cleaned.name).toBe('John Doe');
    expect((cleaned as any).$where).toBeUndefined();
    expect(cleaned.details.bio).toBe('evil()Author');
  });
});
