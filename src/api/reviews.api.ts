import { db } from '../db/localStorageDb';
import { Review, Order, Product } from '../types';
import { calculateNewRating, recalculateProductRatingFromReviews } from '../services/rating.service';
import { sanitizeInput } from '../services/sanitizer.service';
import { logAuditEvent } from '../services/audit.service';
import { simulateLatency, okResponse, createdResponse, errorResponse, ApiResponse } from './mockClient';

export interface CreateReviewDto {
  userId: string;
  userName: string;
  productId: string;
  sku: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
}

export const reviewsApi = {
  async getReviews(productIdOrSku: string): Promise<ApiResponse<Review[]>> {
    await simulateLatency();
    const all = db.get('reviews') || [];
    const filtered = all.filter(r => 
      (r.productId === productIdOrSku || r.sku === productIdOrSku) && r.isActive
    );
    // Sort newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return okResponse(filtered);
  },

  async getProductReviews(productIdOrSku: string): Promise<ApiResponse<Review[]>> {
    return this.getReviews(productIdOrSku);
  },

  async getAllReviewsForAdmin(): Promise<ApiResponse<Review[]>> {
    await simulateLatency();
    const all = db.get('reviews') || [];
    return okResponse(all);
  },

  async getAllReviews(): Promise<ApiResponse<Review[]>> {
    return this.getAllReviewsForAdmin();
  },

  /**
   * Check if user is a verified purchaser for the product (FR-25)
   */
  async checkVerifiedPurchaser(userId: string, sku: string): Promise<ApiResponse<{ verified: boolean }>> {
    await simulateLatency(100, 200);
    const orders = db.get('orders') || [];
    const isVerified = orders.some(o => 
      o.userId === userId && 
      o.status === 'Delivered' && 
      o.items.some(i => i.sku === sku)
    );
    return okResponse({ verified: isVerified });
  },

  async checkEligibility(userId: string, sku: string): Promise<ApiResponse<{ eligible: boolean }>> {
    const res = await this.checkVerifiedPurchaser(userId, sku);
    return okResponse({ eligible: res.data?.verified || false });
  },

  /**
   * Customer submits review (FR-25, FR-26, Algorithm 6.4.3)
   */
  async submitReview(dto: CreateReviewDto): Promise<ApiResponse<Review>> {
    await simulateLatency();

    if (dto.rating < 1 || dto.rating > 5) {
      return errorResponse(400, 'Star rating must be between 1 and 5.');
    }

    if (!dto.comment || !dto.comment.trim()) {
      return errorResponse(400, 'Review comments cannot be empty.');
    }

    // Verified Purchaser verification (FR-25)
    const orders = db.get('orders') || [];
    const hasDeliveredOrder = orders.some(o => 
      o.userId === dto.userId && 
      o.status === 'Delivered' && 
      o.items.some(i => i.sku === dto.sku || i.productId === dto.productId)
    );

    if (!hasDeliveredOrder) {
      return errorResponse(403, 'Only verified purchasers with a delivered order can submit a review for this product (FR-25).');
    }

    // Check if user already reviewed
    const existingReviews = db.get('reviews') || [];
    const alreadyReviewed = existingReviews.some(r => 
      r.userId === dto.userId && 
      (r.sku === dto.sku || r.productId === dto.productId) && 
      r.isActive
    );

    if (alreadyReviewed) {
      return errorResponse(400, 'You have already reviewed this product.');
    }

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      userId: dto.userId,
      userName: dto.userName,
      productId: dto.productId,
      sku: dto.sku,
      rating: dto.rating,
      title: sanitizeInput(dto.title),
      comment: sanitizeInput(dto.comment),
      createdAt: new Date().toISOString(),
      isActive: true,
      verifiedPurchase: true
    };

    db.insert<Review>('reviews', newReview);

    // Update Product average rating & count (Algorithm 6.4.3)
    const product = db.findById<Product>('products', dto.productId);
    if (product) {
      const updatedRating = calculateNewRating(product.avgRating, product.reviewCount, dto.rating);
      db.update<Product>('products', dto.productId, p => {
        p.avgRating = updatedRating.avgRating;
        p.reviewCount = updatedRating.reviewCount;
      });
    }

    return createdResponse(newReview, 'Thank you! Your verified review has been published.');
  },

  /**
   * Admin moderates/removes review with recalculation (FR-27)
   */
  async removeReview(
    reviewId: string, 
    reason: string, 
    actor: string | { id: string; name: string; role: 'admin' } = 'admin'
  ): Promise<ApiResponse<boolean>> {
    await simulateLatency();
    const review = db.findById<Review>('reviews', reviewId);
    if (!review) return errorResponse(404, 'Review not found');

    const actorObj = typeof actor === 'string' ? { id: actor, name: actor, role: 'admin' as const } : actor;
    const before = { ...review };
    db.update<Review>('reviews', reviewId, r => {
      r.isActive = false;
    });

    // Recalculate product rating
    recalculateProductRatingFromReviews(review.productId);

    logAuditEvent(actorObj, 'REVIEW_REMOVED', 'review', reviewId, before, { isActive: false, reason });

    return okResponse(true, 'Review removed and product rating recalculated.');
  }
};
