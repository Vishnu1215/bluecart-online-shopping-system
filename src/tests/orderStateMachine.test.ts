import { describe, it, expect } from 'vitest';
import { 
  validateOrderTransition, 
  isOrderInsideReturnWindow 
} from '../services/orderStateMachine';

describe('TC-20, TC-21, TC-22: Order State Machine & Policies (Report Table 5.4, FR-21, FR-23, FR-24)', () => {
  describe('TC-20: State Machine Transitions', () => {
    it('allows vendor to transition from Confirmed to Processing', () => {
      const res = validateOrderTransition('Confirmed', 'Processing', 'vendor');
      expect(res.allowed).toBe(true);
    });

    it('allows vendor to transition from Processing to Shipped', () => {
      const res = validateOrderTransition('Processing', 'Shipped', 'vendor');
      expect(res.allowed).toBe(true);
    });

    it('allows vendor to transition from Shipped to Delivered', () => {
      const res = validateOrderTransition('Shipped', 'Delivered', 'vendor');
      expect(res.allowed).toBe(true);
    });

    it('forbids invalid skip transitions (e.g. Confirmed directly to Delivered)', () => {
      const res = validateOrderTransition('Confirmed', 'Delivered', 'vendor');
      expect(res.allowed).toBe(false);
      expect(res.reason).toContain('Illegal transition');
    });

    it('forbids transitions out of terminal state Cancelled', () => {
      const res = validateOrderTransition('Cancelled', 'Processing', 'vendor');
      expect(res.allowed).toBe(false);
      expect(res.reason).toContain('already cancelled');
    });

    it('forbids transitions out of terminal state Returned', () => {
      const res = validateOrderTransition('Returned', 'Delivered', 'vendor');
      expect(res.allowed).toBe(false);
      expect(res.reason).toContain('already returned');
    });

    it('allows Administrator override to any operational state', () => {
      const res = validateOrderTransition('Shipped', 'Processing', 'admin');
      expect(res.allowed).toBe(true);
    });
  });

  describe('TC-21: Cancellation Policy (FR-23)', () => {
    it('allows customer to cancel an order in Confirmed status', () => {
      const res = validateOrderTransition('Confirmed', 'Cancelled', 'customer');
      expect(res.allowed).toBe(true);
    });

    it('allows customer to cancel an order in Processing status', () => {
      const res = validateOrderTransition('Processing', 'Cancelled', 'customer');
      expect(res.allowed).toBe(true);
    });

    it('strictly forbids customer cancellation once order is Shipped', () => {
      const res = validateOrderTransition('Shipped', 'Cancelled', 'customer');
      expect(res.allowed).toBe(false);
      expect(res.reason).toContain('cannot be cancelled once they have been shipped');
    });

    it('strictly forbids customer cancellation once order is Delivered', () => {
      const res = validateOrderTransition('Delivered', 'Cancelled', 'customer');
      expect(res.allowed).toBe(false);
    });
  });

  describe('TC-22: 7-Day Return Policy Window (FR-24)', () => {
    it('returns true when delivery date is within the 7-day window (e.g., 3 days ago)', () => {
      const threeDaysAgo = new Date(Date.now() - (3 * 24 * 60 * 60 * 1000)).toISOString();
      expect(isOrderInsideReturnWindow(threeDaysAgo, 7)).toBe(true);
    });

    it('returns false when delivery date is outside the 7-day window (e.g., 9 days ago)', () => {
      const nineDaysAgo = new Date(Date.now() - (9 * 24 * 60 * 60 * 1000)).toISOString();
      expect(isOrderInsideReturnWindow(nineDaysAgo, 7)).toBe(false);
    });

    it('returns false if deliveredAt timestamp is missing', () => {
      expect(isOrderInsideReturnWindow(undefined, 7)).toBe(false);
    });

    it('allows return request transition if within window', () => {
      const res = validateOrderTransition('Delivered', 'Return Requested', 'customer', true);
      expect(res.allowed).toBe(true);
    });

    it('blocks return request transition if outside window', () => {
      const res = validateOrderTransition('Delivered', 'Return Requested', 'customer', false);
      expect(res.allowed).toBe(false);
      expect(res.reason).toContain('7-day return window');
    });
  });
});
