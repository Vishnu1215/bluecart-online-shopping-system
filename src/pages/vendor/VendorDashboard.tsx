import React, { useEffect, useState, useMemo } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ordersApi } from '../../api/orders.api';
import { productsApi } from '../../api/products.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Order, Product, OrderStatus } from '../../types';
import { 
  Package, ShoppingCart, Truck, IndianRupee, 
  AlertTriangle, TrendingUp, Users, Mail, Phone,
  MapPin, Calendar, Eye, CheckCircle2, Search, ArrowRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

export interface VendorCustomerSummary {
  userId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  addressSummary: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  recentOrderId: string;
  recentStatus: OrderStatus;
}

export const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'customers'>('orders');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<VendorCustomerSummary | null>(null);

  const vendorId = user?.vendorId || 'vnd_techwest';
  const vendorDisplayName = user?.name?.includes('Apex') ? 'Apex / TechWest Retail' : 'TechWest Retail';

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

  // Derive unique Customer profiles from orders allocated to this vendor
  const vendorCustomers = useMemo<VendorCustomerSummary[]>(() => {
    const map = new Map<string, VendorCustomerSummary>();

    orders.forEach(order => {
      const vendorItems = order.items.filter(i => i.vendorId === vendorId);
      const vendorOrderValue = vendorItems.reduce((sum, i) => sum + (i.unitPrice * i.qty), 0);
      const key = order.customerEmail ? order.customerEmail.toLowerCase() : order.userId;

      if (!map.has(key)) {
        map.set(key, {
          userId: order.userId,
          name: order.customerName,
          email: order.customerEmail || 'N/A',
          phone: order.shippingAddress.phone || '+91 98765 43210',
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          addressSummary: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`,
          orderCount: 1,
          totalSpent: vendorOrderValue,
          lastOrderDate: order.placedAt,
          recentOrderId: order.orderId,
          recentStatus: order.status
        });
      } else {
        const existing = map.get(key)!;
        existing.orderCount += 1;
        existing.totalSpent += vendorOrderValue;
        if (new Date(order.placedAt).getTime() > new Date(existing.lastOrderDate).getTime()) {
          existing.lastOrderDate = order.placedAt;
          existing.recentOrderId = order.orderId;
          existing.recentStatus = order.status;
          existing.city = order.shippingAddress.city;
          existing.state = order.shippingAddress.state;
          existing.addressSummary = `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`;
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders, vendorId]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return vendorCustomers;
    const q = customerSearch.toLowerCase().trim();
    return vendorCustomers.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q)
    );
  }, [vendorCustomers, customerSearch]);

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
    <ConsoleLayout role="vendor" title={`Vendor Console — ${vendorDisplayName}`}>
      <div className="space-y-8">
        {/* KPI Cards Strip matching Fig 8.18 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">To Fulfil</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{toFulfilOrders.length}</p>
              <span className="text-[11px] text-amber-600 font-medium">Pending acceptance</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Customers</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{vendorCustomers.length}</p>
              <span className="text-[11px] text-blue-600 font-medium">Allocated buyers</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Shipped Shipments</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{shippedThisWeek}</p>
              <span className="text-[11px] text-primary font-medium">In-transit shipments</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-primary flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Listings</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{activeListings}</p>
              <span className="text-[11px] text-emerald-600 font-medium">Storefront catalog</span>
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
                <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs last mo
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

        {/* Tabbed Data Section: Live Orders & Allocated Customers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Orders to Fulfil ({orders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('customers')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'customers'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customer Data ({vendorCustomers.length})</span>
              </button>
            </div>

            {activeTab === 'customers' && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search customer, city, email..."
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* TAB 1: Live Orders & Customer Delivery Details */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Orders to Fulfil (FR-21)</h3>
                  <p className="text-xs text-slate-500">Live order requests allocated to your inventory with recipient and customer details</p>
                </div>
                <Badge variant="blue">{orders.length} Total Orders</Badge>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-slate-400 text-xs">Loading order requests...</div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <ShoppingCart className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium">No order requests currently allocated.</p>
                  <p className="text-xs text-slate-400">When customers place orders for your products, they will appear here immediately.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Shipping Destination</th>
                        <th className="py-3 px-4">Allocated Items / SKU</th>
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
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                {order.customerName ? order.customerName.charAt(0).toUpperCase() : 'C'}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{order.customerEmail || 'customer@example.com'}</span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                              <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                            </p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{order.shippingAddress.street}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            {order.items.filter(i => i.vendorId === vendorId).map(i => (
                              <div key={i.sku} className="py-0.5">
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
              )}
            </div>
          )}

          {/* TAB 2: Dedicated Customer Data Directory */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Allocated Customer Directory</h3>
                  <p className="text-xs text-slate-500">Comprehensive customer profiles, contact credentials, and purchase histories for your distributor catalog</p>
                </div>
                <Badge variant="blue">{filteredCustomers.length} Customers</Badge>
              </div>

              {filteredCustomers.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium">No matching customers found.</p>
                  <p className="text-xs text-slate-400">Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">Delivery Location</th>
                        <th className="py-3 px-4">Total Orders</th>
                        <th className="py-3 px-4">Lifetime Value</th>
                        <th className="py-3 px-4">Recent Order</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredCustomers.map(cust => (
                        <tr key={cust.userId + cust.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                                {cust.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{cust.name}</p>
                                <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded font-semibold">
                                  Verified Buyer
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 space-y-1">
                            <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{cust.email}</span>
                            </p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{cust.phone}</span>
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span>{cust.city}, {cust.state}</span>
                            </p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{cust.addressSummary}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                              {cust.orderCount} {cust.orderCount === 1 ? 'order' : 'orders'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                            ₹{cust.totalSpent.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-mono font-bold text-primary">{cust.recentOrderId}</p>
                            <Badge variant={cust.recentStatus === 'Delivered' ? 'success' : cust.recentStatus === 'Shipped' ? 'info' : cust.recentStatus === 'Processing' ? 'warning' : 'blue'}>
                              {cust.recentStatus}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedCustomer(cust)}
                              className="text-xs"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              <span>Details</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Profile — ${selectedCustomer.name}`}
          subtitle="Detailed purchase history and delivery credentials for this customer"
        >
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg">
                {selectedCustomer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{selectedCustomer.name}</h4>
                  <Badge variant="success">Active Buyer</Badge>
                </div>
                <p className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedCustomer.email}
                </p>
                <p className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedCustomer.phone}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Lifetime Value</p>
                <p className="text-lg font-black text-emerald-600 mt-1">₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Allocated Orders</p>
                <p className="text-lg font-black text-primary mt-1">{selectedCustomer.orderCount} Orders</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" /> Delivery Address
              </p>
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {selectedCustomer.addressSummary}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" /> Most Recent Order
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-primary">{selectedCustomer.recentOrderId}</span>
                  <p className="text-[11px] text-slate-400">{new Date(selectedCustomer.lastOrderDate).toLocaleString()}</p>
                </div>
                <Badge variant={selectedCustomer.recentStatus === 'Delivered' ? 'success' : 'blue'}>
                  {selectedCustomer.recentStatus}
                </Badge>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedCustomer(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </ConsoleLayout>
  );
};
