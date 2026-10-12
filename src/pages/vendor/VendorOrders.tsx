import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ordersApi } from '../../api/orders.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Order, OrderStatus } from '../../types';
import { ShoppingCart, CheckCircle, Truck, Package, Clock, ShieldAlert } from 'lucide-react';

export const VendorOrders: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const vendorId = user?.vendorId || 'vnd_techwest';

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered'>('All');
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    const res = await ordersApi.getOrders({ vendorId });
    if (res.success && res.data) {
      setOrders(res.data.orders);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [vendorId]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const res = await ordersApi.updateStatus(orderId, newStatus, 'vendor', 'Status advanced by distributor');
    if (res.success) {
      success(`Order status updated to ${newStatus}. Customer notified.`);
      loadOrders();
    } else {
      error(res.error || 'Failed to update order status');
    }
  };

  const filtered = orders.filter(o => activeTab === 'All' || o.status === activeTab);

  return (
    <ConsoleLayout role="vendor" title="Order Requests & Fulfillment (FR-21)">
      <div className="space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold gap-1 overflow-x-auto">
          {(['All', 'Confirmed', 'Processing', 'Shipped', 'Delivered'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors shrink-0 ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab} ({orders.filter(o => tab === 'All' || o.status === tab).length})
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Allocated Items</th>
                  <th className="py-3 px-4">Order Value</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Permitted Transition (Table 5.4)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{order.orderId}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                      <p className="text-[11px] text-slate-400">{order.customerEmail}</p>
                      <p className="text-[11px] text-slate-400">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {order.items.filter(i => i.vendorId === vendorId).map(i => (
                        <div key={i.sku}>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{i.name}</span>
                          <span className="text-slate-400 font-mono text-[11px]"> ({i.sku} × {i.qty})</span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                      ₹{order.items.filter(i => i.vendorId === vendorId).reduce((s, i) => s + (i.unitPrice * i.qty), 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={order.status === 'Confirmed' ? 'blue' : order.status === 'Processing' ? 'warning' : order.status === 'Shipped' ? 'info' : order.status === 'Delivered' ? 'success' : 'danger'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {order.status === 'Confirmed' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'Processing')}>
                          Accept Order Request
                        </Button>
                      )}
                      {order.status === 'Processing' && (
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700" onClick={() => handleUpdateStatus(order.id, 'Shipped')}>
                          Dispatch & Mark Shipped
                        </Button>
                      )}
                      {order.status === 'Shipped' && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleUpdateStatus(order.id, 'Delivered')}>
                          Confirm Delivery
                        </Button>
                      )}
                      {['Delivered', 'Cancelled', 'Returned'].includes(order.status) && (
                        <span className="text-[11px] text-slate-400 italic">No further actions</span>
                      )}
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
