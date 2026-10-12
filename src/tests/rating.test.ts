import { describe, it, expect, beforeEach } from 'vitest';
import { calculateNewRating, recalculateProductRatingFromReviews } from '../services/rating.service';
import { db } from '../db/localStorageDb';
import { Product, Review } from '../types';

describe('TC-25: Rating Recalculation Service (Algorithm 6.4.3, FR-26)', () => {
  it('correctly calculates new average rating with 1 decimal place', () => {
    // Current avg: 4.0, count: 4 (sum = 16)
    // New review: 5 stars
    // New avg: 21 / 5 = 4.2
    const result = calculateNewRating(4.0, 4, 5);
    expect(result.avgRating).toBe(4.2);
    expect(result.reviewCount).toBe(5);
  });

  it('correctly rounds average to nearest tenth', () => {
    // Current avg: 4.5, count: 2 (sum = 9)
    // New review: 4 stars
    // New avg: 13 / 3 = 4.33333 -> 4.3
    const result = calculateNewRating(4.5, 2, 4);
    expect(result.avgRating).toBe(4.3);
    expect(result.reviewCount).toBe(3);
  });

  describe('Full product reviews recalculation from DB', () => {
    const testProduct: Product = {
      id: 'prd_test_rating',
      sku: 'SKU-TEST-001',
      name: 'Rating Test Gadget',
      description: 'Test gadget description',
      category: 'Computers',
      brand: 'TestBrand',
      price: 1000,
      mrp: 1200,
      discountPercent: 17,
      stockQty: 50,
      images: ['box'],
      avgRating: 0,
      reviewCount: 0,
      vendorId: 'vnd_1',
      vendorName: 'Vendor One',
      isActive: true
    };

    const mockReviews: Review[] = [
      {
        id: 'rev_1',
        productId: 'prd_test_rating',
        sku: 'SKU-TEST-001',
        userId: 'u1',
        userName: 'User 1',
        rating: 5,
        title: 'Superb',
        comment: 'Great product',
        verifiedPurchase: true,
        isActive: true,
        createdAt: '2026-02-01T10:00:00Z'
      },
      {
        id: 'rev_2',
        productId: 'prd_test_rating',
        sku: 'SKU-TEST-001',
        userId: 'u2',
        userName: 'User 2',
        rating: 4,
        title: 'Good',
        comment: 'Nice quality',
        verifiedPurchase: true,
        isActive: true,
        createdAt: '2026-02-02T10:00:00Z'
      },
      {
        id: 'rev_3',
        productId: 'prd_test_rating',
        sku: 'SKU-TEST-001',
        userId: 'u3',
        userName: 'User 3',
        rating: 1,
        title: 'Spam',
        comment: 'Spam review',
        verifiedPurchase: false,
        isActive: false, // Inactive / moderated out
        createdAt: '2026-02-03T10:00:00Z'
      }
    ];

    beforeEach(() => {
      db.set('products', [{ ...testProduct }]);
      db.set('reviews', [...mockReviews]);
    });

    it('aggregates only active reviews to compute average and count', () => {
      // Active reviews are 5 and 4 -> Average = 4.5, count = 2
      const result = recalculateProductRatingFromReviews('prd_test_rating');
      expect(result.avgRating).toBe(4.5);
      expect(result.reviewCount).toBe(2);

      const updated = db.findById<Product>('products', 'prd_test_rating');
      expect(updated?.avgRating).toBe(4.5);
      expect(updated?.reviewCount).toBe(2);
    });
  });
});
