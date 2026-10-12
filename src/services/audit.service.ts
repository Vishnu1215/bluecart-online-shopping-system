import { db } from '../db/localStorageDb';
import { AuditLog, UserRole } from '../types';

/**
 * Append-only Audit Logger (NFR-09)
 * Logs all administrative and vendor mutating actions.
 */
export function logAuditEvent(
  actor: { id: string; name: string; role: UserRole | 'system' },
  action: string,
  entity: 'product' | 'order' | 'user' | 'vendor' | 'coupon' | 'review' | 'inventory',
  entityId: string,
  before: any,
  after: any
): AuditLog {
  const newLog: AuditLog = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entity,
    entityId,
    before: before ? JSON.parse(JSON.stringify(before)) : null,
    after: after ? JSON.parse(JSON.stringify(after)) : null,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1 (Local Client)'
  };

  db.insert<AuditLog>('audit_logs', newLog);
  return newLog;
}
