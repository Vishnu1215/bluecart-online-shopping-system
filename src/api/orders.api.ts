import { db } from '../db/localStorageDb';
import { Order, OrderStatus, Product, UserRole, Payment } from '../types';
import { validateOrderTransition, isOrderInsideReturnWindow } from '../services/orderStateMachine';
import { createNotification } from '../services/notification.service';
import { logAuditEvent } from '../services/audit.service';
import { simulateLatency, okResponse, errorResponse, ApiResponse } from './mockClient';

export interface OrderFilterParams {
  userId?: string;
  vendorId?: string;
  status?: OrderStatus | 'All';
  search?: string;
  limit?: number;
  page?: number;
}

export const ordersApi = {
  async getOrders(params: OrderFilterParams = {}): Promise<ApiResponse<{ orders: Order[]; counts: Record<string, number> }>> {
    await simulateLatency();
    const allOrders = db.get('orders') || [];
    let filtered = [...allOrders];

    // Customer filter
    if (params.userId) {
      filtered = filtered.filter(o => o.userId === params.userId);
    }

    // Vendor filter: vendor only sees orders that contain their products
    if (params.vendorId) {
      filtered = filtered.filter(o => o.items.some(i => i.vendorId === params.vendorId));
    }

    // Search by Order ID or Customer Name
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(o => 
        o.orderId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
      );
    }

    // Count by statuses
    const counts: Record<string, number> = {
      All: filtered.length,
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      'Return Requested': 0,
      Returned: 0,
      Cancelled: 0
    };
    for (const o of filtered) {
      if (counts[o.status] !== undefined) {
        counts[o.status] += 1;
      }
    }

    // Status filter
    if (params.status && params.status !== 'All') {
      filtered = filtered.filter(o => o.status === params.status);
    }

    // Sort by placedAt descending (most recent first)
    filtered.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());

    return okResponse({ orders: filtered, counts });
  },

  async getOrderById(orderIdOrDbId: string): Promise<ApiResponse<Order>> {
    await simulateLatency();
    const order = db.findOne<Order>('orders', o => o.id === orderIdOrDbId || o.orderId === orderIdOrDbId);
    if (!order) return errorResponse(404, 'Order not found');
    return okResponse(order);
  },

  /**
   * Vendor / System status update (FR-21, FR-32)
   */
  async updateStatus(
    orderId: string, 
    newStatus: OrderStatus, 
    actor: string | { id: string; name: string; role: UserRole },
    note?: string
  ): Promise<ApiResponse<Order>> {
    await simulateLatency();
    const actorObj = typeof actor === 'string'
      ? { id: actor, name: actor.charAt(0).toUpperCase() + actor.slice(1), role: actor as UserRole }
      : actor;

    const order = db.findOne<Order>('orders', o => o.orderId === orderId || o.id === orderId);
    if (!order) return errorResponse(404, 'Order not found');

    const validation = validateOrderTransition(order.status, newStatus, actorObj.role);
    if (!validation.allowed) {
      return errorResponse(400, validation.reason || 'Invalid state transition');
    }

    const before = { ...order };
    const nowIso = new Date().toISOString();

    const updated = db.update<Order>('orders', order.id, o => {
      o.status = newStatus;
      o.updatedAt = nowIso;
      if (newStatus === 'Delivered') {
        o.deliveredAt = nowIso;
      }
      o.statusTimeline.push({
        status: newStatus,
        timestamp: nowIso,
        note: note || `Status updated to ${newStatus} by ${actorObj.name} (${actorObj.role}).`,
        changedBy: actorObj.role === 'admin' ? 'Admin' : (actorObj.role === 'vendor' ? 'Vendor' : 'Customer')
      });
    });

    // Notify customer on status update (FR-32)
    createNotification(
      order.userId,
      `Order ${order.orderId} is now ${newStatus}`,
      note || `Your order status has been updated to ${newStatus}.`,
      'status',
      `/orders/${order.orderId}`
    );

    // Audit log
    logAuditEvent(actorObj, 'ORDER_STATUS_UPDATE', 'order', order.id, before, updated);

    return okResponse(updated!, `Order status updated to ${newStatus}.`);
  },

  /**
   * Customer order cancellation before Shipped (FR-23)
   * Restores inventory and simulates payment refund
   */
  async cancelOrder(
    orderId: string, 
    actor: string | { id: string; name: string; role: UserRole },
    reason: string
  ): Promise<ApiResponse<Order>> {
    await simulateLatency();
    const actorObj = typeof actor === 'string'
      ? { id: actor, name: actor.charAt(0).toUpperCase() + actor.slice(1), role: actor as UserRole }
      : actor;

    const order = db.findOne<Order>('orders', o => o.orderId === orderId || o.id === orderId);
    if (!order) return errorResponse(404, 'Order not found');

    if (order.status === 'Shipped' || order.status === 'Delivered' || order.status === 'Cancelled') {
      return errorResponse(400, `Cannot cancel order in '${order.status}' status. Orders can only be cancelled before dispatch (FR-23).`);
    }

    const before = { ...order };
    const nowIso = new Date().toISOString();

    // 1. Restore inventory
    for (const item of order.items) {
      db.update<Product>('products', item.productId, p => {
        p.stockQty += item.qty;
      });
    }

    // 2. Mark payment as Refunded
    const payment = db.findOne<Payment>('payments', p => p.orderId === order.orderId);
    if (payment) {
      db.update<Payment>('payments', payment.id, p => {
        p.status = 'Refunded';
      });
    }

    // 3. Update Order status to Cancelled
    const updated = db.update<Order>('orders', order.id, o => {
      o.status = 'Cancelled';
      o.cancelReason = reason;
      o.updatedAt = nowIso;
      o.statusTimeline.push({
        status: 'Cancelled',
        timestamp: nowIso,
        note: `Cancelled: ${reason}. Stock restored and refund initiated.`,
        changedBy: actorObj.role === 'customer' ? 'Customer' : 'Admin'
      });
    });

    createNotification(
      order.userId,
      `Order ${order.orderId} Cancelled`,
      `Your order has been cancelled and a full refund has been initiated to your original payment method.`,
      'status',
      `/orders/${order.orderId}`
    );

    logAuditEvent(actorObj, 'ORDER_CANCELLED', 'order', order.id, before, updated);

    return okResponse(updated!, 'Order cancelled successfully. Stock restored and refund initiated.');
  },

  /**
   * Customer Return Request within 7-day window (FR-24)
   */
  async requestReturn(
    orderId: string, 
    actor: string | { id: string; name: string; role: UserRole },
    reason: string
  ): Promise<ApiResponse<Order>> {
    await simulateLatency();
    const actorObj = typeof actor === 'string'
      ? { id: actor, name: actor.charAt(0).toUpperCase() + actor.slice(1), role: actor as UserRole }
      : actor;

    const order = db.findOne<Order>('orders', o => o.orderId === orderId || o.id === orderId);
    if (!order) return errorResponse(404, 'Order not found');

    if (order.status !== 'Delivered') {
      return errorResponse(400, 'Only delivered orders are eligible for return.');
    }

    const insideWindow = isOrderInsideReturnWindow(order.deliveredAt, 7);
    if (!insideWindow) {
      return errorResponse(400, 'The 7-day return window from delivery date has passed.');
    }

    const before = { ...order };
    const nowIso = new Date().toISOString();

    const updated = db.update<Order>('orders', order.id, o => {
      o.status = 'Return Requested';
      o.returnReason = reason;
      o.updatedAt = nowIso;
      o.statusTimeline.push({
        status: 'Return Requested',
        timestamp: nowIso,
        note: `Return requested by customer: ${reason}`,
        changedBy: 'Customer'
      });
    });

    createNotification(
      'usr_admin',
      `Return Request: ${order.orderId}`,
      `Customer ${order.customerName} requested return for order ${order.orderId}. Reason: ${reason}`,
      'order',
      `/admin/orders`
    );

    logAuditEvent(actorObj, 'ORDER_RETURN_REQUESTED', 'order', order.id, before, updated);

    return okResponse(updated!, 'Return request submitted successfully.');
  },

  /**
   * Administrator Logged Override (SRS 5.5, NFR-09)
   */
  async adminOverride(
    orderId: string, 
    newStatus: OrderStatus, 
    mandatoryReason: string,
    actor: string | { id: string; name: string; role: any }
  ): Promise<ApiResponse<Order>> {
    await simulateLatency();
    const actorObj = typeof actor === 'string'
      ? { id: actor, name: actor.charAt(0).toUpperCase() + actor.slice(1), role: 'admin' as const }
      : actor;
    if (!mandatoryReason || mandatoryReason.trim().length < 5) {
      return errorResponse(400, 'A mandatory justification reason (min 5 characters) is required for administrative overrides.');
    }

    const order = db.findOne<Order>('orders', o => o.orderId === orderId || o.id === orderId);
    if (!order) return errorResponse(404, 'Order not found');

    const before = { ...order };
    const nowIso = new Date().toISOString();

    const updated = db.update<Order>('orders', order.id, o => {
      o.status = newStatus;
      o.adminOverrideReason = mandatoryReason;
      o.updatedAt = nowIso;
      o.statusTimeline.push({
        status: newStatus,
        timestamp: nowIso,
        note: `Admin override by ${actorObj.name}: ${mandatoryReason}`,
        changedBy: 'Admin'
      });
    });

    logAuditEvent(actorObj, 'ADMIN_ORDER_OVERRIDE', 'order', order.id, before, { ...updated, reason: mandatoryReason });

    return okResponse(updated!, `Order status manually overridden to ${newStatus}.`);
  }
};
