import { db } from '../db/localStorageDb';
import { Payment } from '../types';
import { simulateLatency, okResponse, ApiResponse } from './mockClient';

export const paymentsApi = {
  async getPayments(): Promise<ApiResponse<Payment[]>> {
    await simulateLatency();
    const payments = db.get('payments') || [];
    const sorted = [...payments].sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
    return okResponse(sorted);
  }
};
