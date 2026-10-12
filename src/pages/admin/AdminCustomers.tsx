import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { usersApi } from '../../api/users.api';
import { ordersApi } from '../../api/orders.api';
import { useToast } from '../../context/ToastContext';
import { User, Order, UserStatus } from '../../types';
import { Users, Lock, Unlock, Ban, CheckCircle2, History } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { success, error } = useToast();

  const [customers, setCustomers] = useState<User[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const loadCustomers = async () => {
    const res = await usersApi.getUsers({ role: 'customer' });
    if (res.success && res.data) {
      setCustomers(res.data);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleViewOrders = async (u: User) => {
    setSelectedCustomer(u);
    const res = await ordersApi.getOrders({ userId: u.id });
    if (res.success && res.data) {
      setCustomerOrders(res.data.orders);
    }
    setIsViewModalOpen(true);
  };

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    const res = await usersApi.updateStatus(userId, newStatus, 'admin');
    if (res.success) {
      success(`Customer account status updated to ${newStatus}.`);
      loadCustomers();
    } else {
      error(res.error || 'Failed to update user status');
    }
  };

  const handleUnlock = async (userId: string) => {
    const res = await usersApi.unlockAccount(userId, 'admin');
    if (res.success) {
      success('User lockout cleared successfully.');
      loadCustomers();
    } else {
      error(res.error || 'Failed to unlock account');
    }
  };

  return (
    <ConsoleLayout role="admin" title="Customer Management (SRS FR-07, Fig 8.24)">
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Registered Customer Accounts
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Govern active customer statuses, clear 15-minute brute-force lockouts (FR-07), and inspect purchase history.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4">Customer ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Failed Attempts</th>
                  <th className="py-3 px-4 text-right">Administrative Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {customers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{u.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="py-3.5 px-4 text-slate-500">{u.mobile}</td>
                    <td className="py-3.5 px-4">
                      {u.status === 'Active' ? (
                        <Badge variant="success">Active</Badge>
                      ) : u.status === 'Locked' ? (
                        <Badge variant="warning">Locked (15 min FR-07)</Badge>
                      ) : (
                        <Badge variant="danger">Suspended</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{u.failedAttempts} / 5</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewOrders(u)}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                        >
                          Orders
                        </button>
                        {u.status === 'Locked' && (
                          <button
                            onClick={() => handleUnlock(u.id)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-semibold text-[11px]"
                            title="Unlock account"
                          >
                            Unlock
                          </button>
                        )}
                        {u.status === 'Active' ? (
                          <button
                            onClick={() => handleStatusChange(u.id, 'Suspended')}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded font-semibold text-[11px]"
                            title="Suspend customer"
                          >
                            Suspend
                          </button>
                        ) : u.status === 'Suspended' ? (
                          <button
                            onClick={() => handleStatusChange(u.id, 'Active')}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-primary rounded font-semibold text-[11px]"
                            title="Reactivate customer"
                          >
                            Reactivate
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Customer Orders Modal */}
        {isViewModalOpen && selectedCustomer && (
          <Modal
            isOpen={true}
            onClose={() => setIsViewModalOpen(false)}
            title={`Customer Order History: ${selectedCustomer.name}`}
          >
            <div className="space-y-4 text-xs">
              <p className="text-slate-500">Showing historical transactions for <strong>{selectedCustomer.email}</strong></p>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {customerOrders.length === 0 ? (
                  <p className="py-4 text-center text-slate-400">No orders placed by this customer yet.</p>
                ) : (
                  customerOrders.map(o => (
                    <div key={o.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <p className="font-mono font-bold text-primary">{o.orderId}</p>
                        <p className="text-slate-400 text-[11px]">{new Date(o.placedAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold">₹{o.totalAmount.toLocaleString('en-IN')}</p>
                        <Badge variant="blue">{o.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="text-right pt-2">
                <Button size="sm" onClick={() => setIsViewModalOpen(false)}>Close</Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </ConsoleLayout>
  );
};
