import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { auditApi } from '../../api/audit.api';
import { AuditLog } from '../../types';
import { ShieldCheck, History, Search } from 'lucide-react';

export const AdminAudit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterEntity, setFilterEntity] = useState('all');

  useEffect(() => {
    const load = async () => {
      const res = await auditApi.getLogs();
      if (res.success && res.data) {
        setLogs(res.data);
      }
    };
    load();
  }, []);

  const filtered = logs.filter(l => filterEntity === 'all' || l.entity === filterEntity);

  return (
    <ConsoleLayout role="admin" title="System Audit Trail (NFR-09)">
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Append-Only Immutable Security Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Per NFR-09, every mutating administrative and vendor action (order overrides, product soft-deletes, customer status shifts) is written with before/after diffs and timestamps.
            </p>
          </div>

          <select
            value={filterEntity}
            onChange={e => setFilterEntity(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          >
            <option value="all">All Entities</option>
            <option value="order">Orders</option>
            <option value="product">Products</option>
            <option value="user">Users</option>
            <option value="vendor">Vendors</option>
            <option value="coupon">Coupons</option>
          </select>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Before / After Snapshot</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{l.actorName}</td>
                    <td className="py-3.5 px-4 uppercase text-[11px] font-semibold text-primary">{l.actorRole}</td>
                    <td className="py-3.5 px-4 font-mono font-medium">{l.action}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold">{l.entity}</span> ({l.entityId})
                    </td>
                    <td className="py-3.5 px-4 max-w-xs font-mono text-[10px] text-slate-500 truncate">
                      {JSON.stringify({ before: l.before, after: l.after })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(l.timestamp).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
};
