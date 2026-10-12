import { OrderStatus, UserRole } from '../types';

export interface TransitionValidation {
  allowed: boolean;
  reason?: string;
}

/**
 * Permitted transitions based on Report Table 5.4
 */
export const permittedTransitions: Record<OrderStatus, OrderStatus[]> = {
  'Confirmed': ['Processing', 'Cancelled'],
  'Processing': ['Shipped', 'Cancelled'],
  'Shipped': ['Delivered'],
  'Delivered': ['Return Requested'],
  'Return Requested': ['Returned', 'Delivered'],
  'Returned': [],
  'Cancelled': []
};

/**
 * Validates whether a given actor role can transition an order from current to target status
 */
export function validateOrderTransition(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  actorRole: UserRole,
  isWithinReturnWindow: boolean = true
): TransitionValidation {
  // Terminal states cannot transition
  if (currentStatus === 'Cancelled') {
    return { allowed: false, reason: 'Order is already cancelled and cannot be modified.' };
  }
  if (currentStatus === 'Returned') {
    return { allowed: false, reason: 'Order is already returned and closed.' };
  }

  // Admin Override can change to any valid business state if authorized
  if (actorRole === 'admin') {
    return { allowed: true };
  }

  // Customer cancellation check (FR-23)
  if (actorRole === 'customer' && targetStatus === 'Cancelled') {
    if (currentStatus === 'Confirmed' || currentStatus === 'Processing') {
      return { allowed: true };
    }
    return { allowed: false, reason: 'Orders cannot be cancelled once they have been shipped.' };
  }

  // Check state machine adjacency
  const validNextStates = permittedTransitions[currentStatus] || [];
  if (!validNextStates.includes(targetStatus)) {
    return { 
      allowed: false, 
      reason: `Illegal transition: Cannot change order from '${currentStatus}' to '${targetStatus}'.` 
    };
  }

  // Customer permissions
  if (actorRole === 'customer') {

    if (targetStatus === 'Return Requested') {
      if (currentStatus !== 'Delivered') {
        return { allowed: false, reason: 'Only delivered orders can be returned.' };
      }
      if (!isWithinReturnWindow) {
        return { allowed: false, reason: 'The 7-day return window for this order has expired.' };
      }
      return { allowed: true };
    }

    return { allowed: false, reason: 'Customers cannot manually advance fulfillment states.' };
  }

  // Vendor permissions
  if (actorRole === 'vendor') {
    if (targetStatus === 'Processing' && currentStatus === 'Confirmed') {
      return { allowed: true };
    }
    if (targetStatus === 'Shipped' && currentStatus === 'Processing') {
      return { allowed: true };
    }
    if (targetStatus === 'Delivered' && currentStatus === 'Shipped') {
      return { allowed: true };
    }
    if (targetStatus === 'Returned' && currentStatus === 'Return Requested') {
      return { allowed: true };
    }
    if (targetStatus === 'Delivered' && currentStatus === 'Return Requested') {
      // Vendor rejects return
      return { allowed: true };
    }
    return { allowed: false, reason: `Vendors are not permitted to set order to '${targetStatus}'.` };
  }

  return { allowed: false, reason: 'Unauthorized transition attempt.' };
}

export function isOrderInsideReturnWindow(orderOrDeliveredAt?: string | { deliveredAt?: string }, windowDays: number = 7): boolean {
  const deliveredAt = typeof orderOrDeliveredAt === 'object' ? orderOrDeliveredAt?.deliveredAt : orderOrDeliveredAt;
  if (!deliveredAt) return false;
  const deliveredDate = new Date(deliveredAt).getTime();
  const now = Date.now();
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  return now - deliveredDate <= windowMs;
}
