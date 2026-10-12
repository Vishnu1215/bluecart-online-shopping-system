import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { OrderTrackingMap } from '../../components/tracking/OrderTrackingMap';
import { ordersApi } from '../../api/orders.api';
import { useToast } from '../../context/ToastContext';
import { Order, OrderStatus } from '../../types';
import { ShoppingCart, ShieldAlert, FileText, CheckCircle2, MapPin } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { success, error } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Returns'>('All');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // View modal
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  // Admin Override Modal (SRS 5.5 logged override with mandatory reason)
  const [overrideOrder, setOverrideOrder] = useState<Order | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<OrderStatus>('Processing');
  const [overrideReason, setOverrideReason] = useState('');

  const loadOrders = async () => {
    setIsLoading(true);
    const res = await ordersApi.getOrders({});
    if (res.success && res.data) {
      setOrders(res.data.orders);
      setCounts(res.data.counts);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = orders.filter(o => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Returns') return ['Return Requested', 'Returned'].includes(o.status);
    return o.status === activeTab;
  });

  const handleExecuteOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideOrder || !overrideReason.trim()) {
      error('Mandatory audit reason must be supplied for administrator state override.');
      return;
    }

    const res = await ordersApi.updateStatus(
      overrideOrder.id,
      overrideStatus,
      'admin',
      `[ADMIN OVERRIDE] ${overrideReason.trim()}`
    );

    if (res.success) {
      success(`Order status overridden to ${overrideStatus} and logged to immutable audit log.`);
      setOverrideOrder(null);
      setOverrideReason('');
      loadOrders();
    } else {
      error(res.error || 'Failed to override status');
    }
  };

  return (
    <ConsoleLayout role="admin" title="Order Management & Logged Overrides (SRS 5.5, Fig 8.23)">
      <div className="space-y-6">
        {/* Status Count Tabs matching Fig 8.23 */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold gap-1 overflow-x-auto">
          {(['All', 'Processing', 'Shipped', 'Delivered', 'Returns'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors shrink-0 ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab} (
              {tab === 'All' 
                ? orders.length 
                : tab === 'Returns' 
                ? (counts['Return Requested'] || 0) + (counts['Returned'] || 0)
                : counts[tab] || 0}
              )
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items / SKU</th>
                  <th className="py-3 px-4">Grand Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date Placed</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{order.orderId}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                      <p className="text-[11px] text-slate-400">{order.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {order.items.map(i => (
                        <div key={i.sku} className="line-clamp-1">
                          {i.name} (×{i.qty})
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={order.status === 'Confirmed' ? 'blue' : order.status === 'Processing' ? 'warning' : order.status === 'Shipped' ? 'info' : order.status === 'Delivered' ? 'success' : 'danger'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setOverrideOrder(order);
                            setOverrideStatus(order.status);
                            setOverrideReason('');
                          }}
                          className="px-2 py-1 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 font-semibold text-[11px]"
                          title="Logged Admin Override"
                        >
                          Override
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Details Modal with Live Dispatch Map */}
        {viewOrder && (
          <Modal
            isOpen={true}
            onClose={() => setViewOrder(null)}
            title={`Order Overview & Live Dispatch Route: ${viewOrder.orderId}`}
            maxWidth="3xl"
          >
            <div className="space-y-4 text-xs">
              <OrderTrackingMap order={viewOrder} height="320px" />

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                <p><strong>Customer:</strong> {viewOrder.customerName} ({viewOrder.customerEmail})</p>
                <p><strong>Destination:</strong> {viewOrder.shippingAddress.street}, {viewOrder.shippingAddress.city} - {viewOrder.shippingAddress.pincode}</p>
                <p><strong>Payment Status:</strong> Settled & Verified • Mode: {viewOrder.shippingMethod.toUpperCase()}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 dark:text-slate-300">Items:</h4>
                {viewOrder.items.map(it => (
                  <div key={it.sku} className="flex justify-between py-1 border-b">
                    <span>{it.name} (SKU: {it.sku}) × {it.qty}</span>
                    <span className="font-bold">₹{(it.unitPrice * it.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-right">
                <Button size="sm" onClick={() => setViewOrder(null)}>Close</Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Admin Override Modal (Mandatory reason per SRS 5.5) */}
        {overrideOrder && (
          <Modal
            isOpen={true}
            onClose={() => setOverrideOrder(null)}
            title={`Admin Override: ${overrideOrder.orderId}`}
          >
            <form onSubmit={handleExecuteOverride} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 text-amber-800 dark:text-amber-300">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Administrative Intervention Notice (SRS 5.5)
                </p>
                <p className="mt-1 text-[11px]">
                  Order statuses are normally strictly governed by finite state machine. Administrator overrides must provide a justifiable reason, which is committed immutably to the system audit trail.
                </p>
              </div>

              <div>
                <label className="font-bold block mb-1">New Target Status</label>
                <select
                  value={overrideStatus}
                  onChange={e => setOverrideStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Return Requested">Return Requested</option>
                  <option value="Returned">Returned</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Mandatory Override Reason *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Courier lost parcel; forced replacement re-dispatch authorized by support team."
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setOverrideOrder(null)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Commit Override to Audit Log
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </ConsoleLayout>
  );
};
