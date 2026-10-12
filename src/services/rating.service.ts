import { db } from '../db/localStorageDb';
import { Product, Review } from '../types';

/**
 * Calculates new average rating and incremented review count (Algorithm 6.4.3)
 */
export function calculateNewRating(
  currentAvg: number,
  currentCount: number,
  newRating: number
): { avgRating: number; reviewCount: number } {
  const newCount = currentCount + 1;
  const newAvg = ((currentAvg * currentCount) + newRating) / newCount;
  return {
    avgRating: Math.round(newAvg * 10) / 10, // 1 decimal place e.g. 4.5
    reviewCount: newCount
  };
}

/**
 * Recalculates product rating from all currently active reviews (FR-26, FR-27)
 */
export function recalculateProductRatingFromReviews(productId: string): { avgRating: number; reviewCount: number } {
  const product = db.findById<Product>('products', productId);
  if (!product) return { avgRating: 0, reviewCount: 0 };

  const allReviews = db.get('reviews') || [];
  const activeReviews = allReviews.filter(r => r.productId === productId && r.isActive);

  if (activeReviews.length === 0) {
    db.update<Product>('products', productId, p => {
      p.avgRating = 0;
      p.reviewCount = 0;
    });
    return { avgRating: 0, reviewCount: 0 };
  }

  const sum = activeReviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = Math.round((sum / activeReviews.length) * 10) / 10;
  const count = activeReviews.length;

  db.update<Product>('products', productId, p => {
    p.avgRating = avg;
    p.reviewCount = count;
  });

  return { avgRating: avg, reviewCount: count };
}
