import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ordersApi } from '../../api/orders.api';
import { productsApi } from '../../api/products.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Order, Product, OrderStatus } from '../../types';
import { 
  Package, ShoppingCart, Truck, IndianRupee, 
  AlertTriangle, ArrowUpRight, TrendingUp 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

export const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const vendorId = user?.vendorId || 'vnd_techwest';

  const loadData = async () => {
    setIsLoading(true);
    const [ordersRes, productsRes] = await Promise.all([
      ordersApi.getOrders({ vendorId }),
      productsApi.getProducts({ vendorId, limit: 50, includeInactive: true })
    ]);

    if (ordersRes.success && ordersRes.data) {
      setOrders(ordersRes.data.orders);
    }
    if (productsRes.success && productsRes.data) {
      setProducts(productsRes.data.products);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [vendorId]);

  // Status transition handler from dropdown in row (FR-21 & Fig 8.18)
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const res = await ordersApi.updateStatus(orderId, newStatus, 'vendor', 'Fulfilled via Vendor Console');
    if (res.success) {
      success(`Order status updated to ${newStatus}. Customer notified.`);
      loadData();
    } else {
      error(res.error || 'Failed to update order status');
    }
  };

  // KPIs
  const toFulfilOrders = orders.filter(o => ['Confirmed', 'Processing'].includes(o.status));
  const shippedThisWeek = orders.filter(o => o.status === 'Shipped').length;
  const activeListings = products.filter(p => p.isActive).length;
  const lowStockItems = products.filter(p => p.stockQty <= 40);
  const totalEarnings = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.items.filter(i => i.vendorId === vendorId).reduce((isum, i) => isum + (i.unitPrice * i.qty), 0), 0) || 184300;

  // Chart data
  const chartData = [
    { day: 'Mon', sales: 24500 },
    { day: 'Tue', sales: 38200 },
    { day: 'Wed', sales: 19400 },
    { day: 'Thu', sales: 42100 },
    { day: 'Fri', sales: 31000 },
    { day: 'Sat', sales: 54000 },
    { day: 'Sun', sales: 48900 },
  ];

  return (
    <ConsoleLayout role="vendor" title="Vendor Console — TechWest Retail">
      <div className="space-y-8">
        {/* KPI Cards Strip matching Fig 8.18 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">To Fulfil</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{toFulfilOrders.length}</p>
              <span className="text-[11px] text-amber-600 font-medium">Pending acceptance/dispatch</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Shipped This Week</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{shippedThisWeek}</p>
              <span className="text-[11px] text-blue-600 font-medium">In-transit shipments</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-primary flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Listings</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{activeListings}</p>
              <span className="text-[11px] text-emerald-600 font-medium">Available on Storefront</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Net Earnings</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">₹{totalEarnings.toLocaleString('en-IN')}</p>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs last month
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Sales Chart & Low-Stock Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Weekly Fulfillment Velocity</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" fontSize={11} />
                  <YAxis fontSize={11} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Sales']} />
                  <Bar dataKey="sales" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock Alerts (&lt; 40)
              </h3>
              <span className="text-xs font-bold text-amber-600">{lowStockItems.length} items</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {lowStockItems.slice(0, 5).map(prod => (
                <div key={prod.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{prod.name}</p>
                    <p className="text-slate-400 font-mono text-[11px]">SKU: {prod.sku}</p>
                  </div>
                  <span className="font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                    {prod.stockQty} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders to Fulfil Table with Row Dropdown Status Updater matching Fig 8.18 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Orders to Fulfil (FR-21)</h3>
            <span className="text-xs text-slate-500">Live order requests allocated to your inventory</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items / SKU</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Update Status (Table 5.4)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      {order.orderId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
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
                    <td className="py-3.5 px-4">
                      <Badge variant={order.status === 'Confirmed' ? 'blue' : order.status === 'Processing' ? 'warning' : order.status === 'Shipped' ? 'info' : order.status === 'Delivered' ? 'success' : 'danger'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {/* State transition selector restricted to permitted transitions */}
                      {order.status === 'Confirmed' && (
                        <Button size="sm" onClick={() => handleStatusChange(order.id, 'Processing')}>
                          Accept & Process
                        </Button>
                      )}
                      {order.status === 'Processing' && (
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700" onClick={() => handleStatusChange(order.id, 'Shipped')}>
                          Mark as Shipped
                        </Button>
                      )}
                      {order.status === 'Shipped' && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatusChange(order.id, 'Delivered')}>
                          Mark Delivered
                        </Button>
                      )}
                      {['Delivered', 'Cancelled', 'Returned'].includes(order.status) && (
                        <span className="text-slate-400 italic text-[11px]">Completed</span>
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
