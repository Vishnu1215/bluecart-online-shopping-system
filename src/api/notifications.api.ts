import { db } from '../db/localStorageDb';
import { Notification } from '../types';
import { simulateLatency, okResponse, ApiResponse } from './mockClient';

export const notificationsApi = {
  async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    await simulateLatency(100, 200);
    const all = db.get('notifications') || [];
    const userNotifs = all.filter(n => n.userId === userId || (userId === 'usr_admin' && n.userId === 'admin'));
    userNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return okResponse(userNotifs);
  },

  async markAsRead(id: string): Promise<ApiResponse<boolean>> {
    await simulateLatency(50, 100);
    db.update<Notification>('notifications', id, n => {
      n.read = true;
    });
    return okResponse(true);
  },

  async markAllAsRead(userId: string): Promise<ApiResponse<boolean>> {
    await simulateLatency(50, 100);
    const dbData = db.get('notifications') || [];
    for (const n of dbData) {
      if (n.userId === userId || (userId === 'usr_admin' && n.userId === 'admin')) {
        n.read = true;
      }
    }
    db.set('notifications', dbData);
    return okResponse(true);
  }
};
