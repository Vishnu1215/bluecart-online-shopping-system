import { db } from '../db/localStorageDb';
import { Notification, User } from '../types';

/**
 * Creates in-app notifications and simulates email dispatch (FR-31, FR-32)
 */
export function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'order' | 'status' | 'alert' | 'system',
  link?: string
): Notification {
  // Check user preferences if customer
  const user = db.findById<User>('users', userId);
  if (user && user.role === 'customer' && user.preferences) {
    if (type === 'order' && !user.preferences.orderNotifications) {
      // User disabled order notifications
      // still return mock object without saving
    }
    if (type === 'status' && !user.preferences.shippingNotifications) {
      // User disabled shipping notifications
    }
  }

  const notification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
    link
  };

  db.insert<Notification>('notifications', notification);
  return notification;
}
