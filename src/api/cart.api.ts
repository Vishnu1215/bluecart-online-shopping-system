import { db } from '../db/localStorageDb';
import { Cart, CartItem, Product } from '../types';
import { calculateOrderPricing, PricingBreakdown } from '../services/pricing.service';
import { simulateLatency, okResponse, errorResponse, ApiResponse } from './mockClient';

export interface CartResponse {
  cart: Cart;
  pricing: PricingBreakdown;
}

export const cartApi = {
  async getCart(userId: string): Promise<ApiResponse<CartResponse>> {
    await simulateLatency(100, 200);
    let cart = db.findOne<Cart>('carts', c => c.userId === userId);
    if (!cart) {
      cart = {
        userId,
        items: [],
        updatedAt: new Date().toISOString()
      };
      db.insert<Cart>('carts', cart);
    }

    const pricing = calculateOrderPricing(
      cart.items.map(i => ({ price: i.price, qty: i.qty })),
      cart.couponCode
    );

    return okResponse({ cart, pricing });
  },

  async addItem(userId: string, item: Omit<CartItem, 'qty'>, qty: number = 1): Promise<ApiResponse<CartResponse>> {
    await simulateLatency();
    const product = db.findById<Product>('products', item.productId);
    if (!product || !product.isActive) {
      return errorResponse(404, 'Product is currently unavailable.');
    }

    let cart = db.findOne<Cart>('carts', c => c.userId === userId);
    if (!cart) {
      cart = {
        userId,
        items: [],
        updatedAt: new Date().toISOString()
      };
      db.insert<Cart>('carts', cart);
    }

    const existingIndex = cart.items.findIndex(i => i.productId === item.productId);
    const currentQtyInCart = existingIndex > -1 ? cart.items[existingIndex].qty : 0;
    const requestedTotalQty = currentQtyInCart + qty;

    if (requestedTotalQty > product.stockQty) {
      return errorResponse(400, `Cannot add ${qty} more. Only ${product.stockQty} unit(s) available in stock.`);
    }

    if (existingIndex > -1) {
      cart.items[existingIndex].qty = requestedTotalQty;
    } else {
      cart.items.push({
        ...item,
        qty
      });
    }

    cart.updatedAt = new Date().toISOString();
    db.update<Cart>('carts', cart.userId, () => cart);

    const pricing = calculateOrderPricing(
      cart.items.map(i => ({ price: i.price, qty: i.qty })),
      cart.couponCode
    );

    return okResponse({ cart, pricing }, 'Item added to cart.');
  },

  async updateItemQty(userId: string, productId: string, qty: number): Promise<ApiResponse<CartResponse>> {
    await simulateLatency();
    const cart = db.findOne<Cart>('carts', c => c.userId === userId);
    if (!cart) return errorResponse(404, 'Cart not found');

    const product = db.findById<Product>('products', productId);
    if (qty > 0 && product && qty > product.stockQty) {
      return errorResponse(400, `Requested quantity exceeds available stock (${product.stockQty} units available).`);
    }

    if (qty <= 0) {
      cart.items = cart.items.filter(i => i.productId !== productId);
    } else {
      const line = cart.items.find(i => i.productId === productId);
      if (line) {
        line.qty = qty;
      }
    }

    cart.updatedAt = new Date().toISOString();
    db.update<Cart>('carts', cart.userId, () => cart);

    const pricing = calculateOrderPricing(
      cart.items.map(i => ({ price: i.price, qty: i.qty })),
      cart.couponCode
    );

    return okResponse({ cart, pricing });
  },

  async removeItem(userId: string, productId: string): Promise<ApiResponse<CartResponse>> {
    await simulateLatency();
    const cart = db.findOne<Cart>('carts', c => c.userId === userId);
    if (!cart) return errorResponse(404, 'Cart not found');

    cart.items = cart.items.filter(i => i.productId !== productId);
    cart.updatedAt = new Date().toISOString();
    db.update<Cart>('carts', cart.userId, () => cart);

    const pricing = calculateOrderPricing(
      cart.items.map(i => ({ price: i.price, qty: i.qty })),
      cart.couponCode
    );

    return okResponse({ cart, pricing }, 'Item removed from cart.');
  },

  async applyCoupon(userId: string, code: string): Promise<ApiResponse<CartResponse>> {
    await simulateLatency();
    const cart = db.findOne<Cart>('carts', c => c.userId === userId);
    if (!cart) return errorResponse(404, 'Cart not found');

    cart.couponCode = code.trim().toUpperCase();
    cart.updatedAt = new Date().toISOString();
    db.update<Cart>('carts', cart.userId, () => cart);

    const pricing = calculateOrderPricing(
      cart.items.map(i => ({ price: i.price, qty: i.qty })),
      cart.couponCode
    );

    if (pricing.couponDiscount === 0) {
      // Revert if invalid
      cart.couponCode = undefined;
      db.update<Cart>('carts', cart.userId, () => cart);
      return errorResponse(400, 'Invalid or inapplicable coupon code.');
    }

    return okResponse({ cart, pricing }, `Coupon ${code} applied successfully!`);
  },

  async removeCoupon(userId: string): Promise<ApiResponse<CartResponse>> {
    await simulateLatency();
    const cart = db.findOne<Cart>('carts', c => c.userId === userId);
    if (!cart) return errorResponse(404, 'Cart not found');

    cart.couponCode = undefined;
    cart.updatedAt = new Date().toISOString();
    db.update<Cart>('carts', cart.userId, () => cart);

    const pricing = calculateOrderPricing(
      cart.items.map(i => ({ price: i.price, qty: i.qty }))
    );

    return okResponse({ cart, pricing }, 'Coupon removed.');
  },

  async clearCart(userId: string): Promise<ApiResponse<boolean>> {
    await simulateLatency();
    const cart = db.findOne<Cart>('carts', c => c.userId === userId);
    if (cart) {
      cart.items = [];
      cart.couponCode = undefined;
      cart.updatedAt = new Date().toISOString();
      db.update<Cart>('carts', cart.userId, () => cart);
    }
    return okResponse(true);
  }
};
