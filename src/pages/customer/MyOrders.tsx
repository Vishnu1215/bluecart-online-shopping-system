import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { OrderTrackingMap } from '../../components/tracking/OrderTrackingMap';
import { ProductImage } from '../../components/ui/ProductImage';
import { ordersApi } from '../../api/orders.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Order, OrderStatus } from '../../types';
import { isOrderInsideReturnWindow } from '../../services/orderStateMachine';
import { 
  Package, Truck, RotateCcw, XCircle, Eye, 
  Clock, ShieldCheck, CheckCircle2, AlertCircle, MapPin 
} from 'lucide-react';

export const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Delivered' | 'Cancelled'>('All');
  const [isLoading, setIsLoading] = useState(true);

  // Tracking modal
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Return modal
  const [returnOrder, setReturnOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Damaged item');

  // Cancel modal
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Changed my mind');

  const loadOrders = async () => {
    setIsLoading(true);
    const res = await ordersApi.getOrders({ userId: user?.id || 'usr_ananya' });
    if (res.success && res.data) {
      setOrders(res.data.orders);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return ['Confirmed', 'Processing', 'Shipped'].includes(o.status);
    if (activeTab === 'Delivered') return o.status === 'Delivered';
    if (activeTab === 'Cancelled') return o.status === 'Cancelled';
    return true;
  });

  const handleConfirmCancel = async () => {
    if (!cancelOrder) return;
    const res = await ordersApi.cancelOrder(cancelOrder.id, 'customer', cancelReason);
    if (res.success) {
      success(`Order ${cancelOrder.orderId} cancelled successfully. Stock has been restored.`);
      setCancelOrder(null);
      loadOrders();
    } else {
      error(res.error || 'Failed to cancel order');
    }
  };

  const handleConfirmReturn = async () => {
    if (!returnOrder) return;
    const res = await ordersApi.requestReturn(returnOrder.id, 'customer', returnReason);
    if (res.success) {
      success(`Return requested for order ${returnOrder.orderId}. Vendor will inspect.`);
      setReturnOrder(null);
      loadOrders();
    } else {
      error(res.error || 'Failed to request return');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed':
        return <Badge variant="blue">Confirmed</Badge>;
      case 'Processing':
        return <Badge variant="blue">Processing</Badge>;
      case 'Shipped':
        return <Badge variant="warning">Shipped</Badge>;
      case 'Delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'Return Requested':
        return <Badge variant="warning">Return Requested</Badge>;
      case 'Returned':
        return <Badge variant="info">Returned</Badge>;
      case 'Cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/store' }, { label: 'My Orders' }]} />

        {/* Header & Tabs matching Fig 8.14 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Orders ({orders.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">Track progress, cancel before dispatch, or initiate 7-day returns.</p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {(['All', 'Active', 'Delivered', 'Cancelled'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No orders found</h3>
              <p className="text-xs text-slate-500">You don't have any orders matching the "{activeTab}" filter.</p>
              <Link to="/products" className="inline-block mt-2">
                <Button size="sm">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Placed On</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredOrders.map(order => {
                    const canCancel = ['Confirmed', 'Processing'].includes(order.status);
                    const canReturn = order.status === 'Delivered' && isOrderInsideReturnWindow(order);
                    const isOutsideWindow = order.status === 'Delivered' && !isOrderInsideReturnWindow(order);

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-mono font-bold text-primary">
                          {order.orderId}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {order.items[0] && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-800">
                                <ProductImage
                                  src={order.items[0].image}
                                  productId={order.items[0].productId}
                                  imageKey={order.items[0].image}
                                  size="sm"
                                  className="w-full h-full"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                                {order.items.map(i => `${i.name} (×${i.qty})`).join(', ')}
                              </p>
                              <p className="text-[11px] text-slate-400">{order.items.length} unique line item(s) • To: {order.shippingAddress.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Track Action */}
                            <button
                              onClick={() => setTrackingOrder(order)}
                              className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-bold text-[11px] flex items-center gap-1 border border-blue-200 dark:border-blue-800 transition-colors shadow-2xs"
                            >
                              <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              <span>Track Map</span>
                            </button>

                            {/* Cancel Action (FR-23) */}
                            {canCancel && (
                              <button
                                onClick={() => setCancelOrder(order)}
                                className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 font-semibold text-[11px]"
                              >
                                Cancel
                              </button>
                            )}

                            {/* Return Action (FR-24) */}
                            {canReturn && (
                              <button
                                onClick={() => setReturnOrder(order)}
                                className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 font-semibold text-[11px]"
                              >
                                Return
                              </button>
                            )}
                            {isOutsideWindow && (
                              <span className="text-[10px] text-slate-400 italic">
                                Return Expired
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tracking Details Modal with Interactive Live Map */}
        {trackingOrder && (
          <Modal
            isOpen={true}
            onClose={() => setTrackingOrder(null)}
            title={`Live Order Route & Map Tracking: ${trackingOrder.orderId}`}
            maxWidth="3xl"
          >
            <div className="space-y-6">
              {/* Interactive Live Map Component */}
              <OrderTrackingMap order={trackingOrder} height="360px" />

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Status: {trackingOrder.status}</p>
                  <p className="text-slate-500">Destination: {trackingOrder.shippingAddress.street}, {trackingOrder.shippingAddress.city} - {trackingOrder.shippingAddress.pincode}</p>
                </div>
                {getStatusBadge(trackingOrder.status)}
              </div>

              {/* Status Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Fulfillment Status History
                </h4>
                <div className="space-y-3 border-l-2 border-primary/30 pl-4 ml-2">
                  {trackingOrder.statusTimeline.map((item, idx) => (
                    <div key={idx} className="relative text-xs space-y-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary absolute -left-[21px] top-1 ring-4 ring-white dark:ring-slate-900" />
                      <p className="font-bold text-slate-900 dark:text-white">{item.status} ({item.changedBy})</p>
                      <p className="text-slate-500 text-[11px]">{new Date(item.timestamp).toLocaleString('en-IN')}</p>
                      {item.note && <p className="text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded">{item.note}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Items in order with real pictures */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Package Items ({trackingOrder.items.length}):</h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {trackingOrder.items.map(it => (
                    <div key={it.sku} className="py-2 flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200/70 dark:border-slate-800">
                          <ProductImage
                            src={it.image}
                            productId={it.productId}
                            imageKey={it.image}
                            size="sm"
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{it.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">SKU: {it.sku} × {it.qty}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">₹{(it.unitPrice * it.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Cancel Order Modal */}
        {cancelOrder && (
          <Modal
            isOpen={true}
            onClose={() => setCancelOrder(null)}
            title={`Cancel Order ${cancelOrder.orderId}`}
          >
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to cancel this order? This action is irreversible. Product inventory will be automatically restored to the catalogue and payment refunded.
              </p>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Cancellation Reason:</label>
                <select
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800"
                >
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Found a better price">Found a better price</option>
                  <option value="Delivery delay expected">Delivery delay expected</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setCancelOrder(null)}>Keep Order</Button>
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700" onClick={handleConfirmCancel}>Confirm Cancellation</Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Return Order Modal */}
        {returnOrder && (
          <Modal
            isOpen={true}
            onClose={() => setReturnOrder(null)}
            title={`Request Return for ${returnOrder.orderId}`}
          >
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                You are requesting a return within the 7-day delivery policy window (FR-24). The distributor will schedule a doorstep return pickup.
              </p>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Return Reason:</label>
                <select
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800"
                >
                  <option value="Defective or damaged product">Defective or damaged product</option>
                  <option value="Product not as described">Product not as described</option>
                  <option value="Missing components/accessories">Missing components/accessories</option>
                  <option value="Incorrect item dispatched">Incorrect item dispatched</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setReturnOrder(null)}>Cancel</Button>
                <Button size="sm" onClick={handleConfirmReturn}>Submit Return Request</Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </StoreLayout>
  );
};
