import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { OrderTrackingMap } from '../../components/tracking/OrderTrackingMap';
import { ordersApi } from '../../api/orders.api';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import { Truck, CheckCircle2, Clock, Package, Calendar, MapPin } from 'lucide-react';

export const VendorShipments: React.FC = () => {
  const { user } = useAuth();
  const vendorId = user?.vendorId || 'vnd_techwest';

  const [orders, setOrders] = useState<Order[]>([]);
  const [filterDate, setFilterDate] = useState('all');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      const res = await ordersApi.getOrders({ vendorId });
      if (res.success && res.data) {
        setOrders(res.data.orders);
      }
    };
    loadOrders();
  }, [vendorId]);

  const processingOrders = orders.filter(o => o.status === 'Processing');
  const shippedOrders = orders.filter(o => o.status === 'Shipped');
  const deliveredOrders = orders.filter(o => ['Delivered', 'Returned'].includes(o.status));

  return (
    <ConsoleLayout role="vendor" title="Shipments & Delivery Management">
      <div className="space-y-8">
        {/* Kanban Board Strip (Processing | Shipped | Delivered) */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Active Shipment Flow Board
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Processing */}
            <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" /> Processing ({processingOrders.length})
                </span>
              </div>
              <div className="space-y-3">
                {processingOrders.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center py-4">No shipments being packed</p>
                ) : (
                  processingOrders.map(o => (
                    <div key={o.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 text-xs space-y-1.5 shadow-sm">
                      <div className="flex justify-between font-mono font-bold text-primary">
                        <span>{o.orderId}</span>
                        <span className="text-slate-500 font-sans font-normal text-[10px]">{o.shippingMethod}</span>
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{o.customerName}</p>
                      <p className="text-[11px] text-slate-500">{o.shippingAddress.city}, {o.shippingAddress.state}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 2: Shipped */}
            <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" /> In Transit ({shippedOrders.length})
                </span>
              </div>
              <div className="space-y-3">
                {shippedOrders.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center py-4">No parcels in transit</p>
                ) : (
                  shippedOrders.map(o => (
                    <div key={o.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 text-xs space-y-1.5 shadow-sm">
                      <div className="flex justify-between font-mono font-bold text-primary">
                        <span>{o.orderId}</span>
                        <Badge variant="warning">Shipped</Badge>
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{o.customerName}</p>
                      <p className="text-[11px] text-slate-500">{o.shippingAddress.city}, {o.shippingAddress.pincode}</p>
                      <button
                        onClick={() => setTrackingOrder(o)}
                        className="w-full mt-2 py-1 px-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-bold text-[10px] flex items-center justify-center gap-1 border border-blue-200 dark:border-blue-800 transition-colors"
                      >
                        <MapPin className="w-3 h-3" /> View Live GPS Route
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column 3: Delivered */}
            <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Delivered ({deliveredOrders.length})
                </span>
              </div>
              <div className="space-y-3">
                {deliveredOrders.slice(0, 5).map(o => (
                  <div key={o.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 text-xs space-y-1.5 shadow-sm">
                    <div className="flex justify-between font-mono font-bold text-emerald-600">
                      <span>{o.orderId}</span>
                      <Badge variant="success">Delivered</Badge>
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{o.customerName}</p>
                    <p className="text-[11px] text-slate-400">Settled & Verified</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery History Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delivery History</h3>
              <p className="text-xs text-slate-500">Historical logs of all fulfilled and returned shipments</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {deliveredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{order.orderId}</td>
                    <td className="py-3 px-4 font-medium">{order.customerName}</td>
                    <td className="py-3 px-4 text-slate-500">{order.shippingAddress.city}, {order.shippingAddress.state}</td>
                    <td className="py-3 px-4">{order.items.length} item(s)</td>
                    <td className="py-3 px-4">
                      <Badge variant={order.status === 'Delivered' ? 'success' : 'info'}>{order.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispatch Route Tracking Modal */}
        {trackingOrder && (
          <Modal
            isOpen={true}
            onClose={() => setTrackingOrder(null)}
            title={`Active Dispatch Route Map: ${trackingOrder.orderId}`}
            maxWidth="3xl"
          >
            <div className="space-y-4">
              <OrderTrackingMap order={trackingOrder} height="360px" />
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Customer: {trackingOrder.customerName}</p>
                  <p className="text-slate-500">Destination: {trackingOrder.shippingAddress.street}, {trackingOrder.shippingAddress.city} - {trackingOrder.shippingAddress.pincode}</p>
                </div>
                <Badge variant="warning">{trackingOrder.status}</Badge>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </ConsoleLayout>
  );
};
