import { db } from '../db/localStorageDb';
import { AuditLog } from '../types';
import { simulateLatency, okResponse, ApiResponse } from './mockClient';

export const auditApi = {
  async getAuditLogs(): Promise<ApiResponse<AuditLog[]>> {
    await simulateLatency();
    const logs = db.get('audit_logs') || [];
    // Immutable append-only list sorted newest first
    const sorted = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return okResponse(sorted);
  },
  async getLogs(): Promise<ApiResponse<AuditLog[]>> {
    return this.getAuditLogs();
  }
};
