import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { paymentsApi } from '../../api/payments.api';
import { reportsApi } from '../../api/reports.api';
import { Payment } from '../../types';
import { CreditCard, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await paymentsApi.getPayments();
      if (res.success && res.data) {
        setPayments(res.data);
      }
    };
    load();
  }, []);

  const handleExportCsv = () => {
    const rows = payments.map(p => ({
      Reference: p.gatewayRef,
      OrderId: p.orderId,
      Method: p.method,
      Amount: p.amount,
      Status: p.status,
      Date: p.paidAt
    }));
    reportsApi.exportCsv(rows, 'payment_gateway_ledger.csv');
  };

  return (
    <ConsoleLayout role="admin" title="Payment Gateway Ledger & Audit (NFR-08)">
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Gateway Transaction Records
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              PCI-DSS zero card storage ledger. Stores only gateway reference hashes and tokenized settlements (NFR-08).
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={handleExportCsv} className="flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Export Ledger CSV
          </Button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4">Gateway Reference</th>
                  <th className="py-3 px-4">Linked Order ID</th>
                  <th className="py-3 px-4">Settlement Method</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Gateway Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{p.gatewayRef}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">{p.orderId}</td>
                    <td className="py-3.5 px-4 uppercase font-semibold">{p.method}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={p.status === 'Paid' ? 'success' : p.status === 'Refunded' ? 'warning' : 'danger'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(p.paidAt).toLocaleString('en-IN')}
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
