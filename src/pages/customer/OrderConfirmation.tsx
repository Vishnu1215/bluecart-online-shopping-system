import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { Button } from '../../components/ui/Button';
import { ordersApi } from '../../api/orders.api';
import { Order } from '../../types';
import { OrderTrackingMap } from '../../components/tracking/OrderTrackingMap';
import { ProductImage } from '../../components/ui/ProductImage';
import { 
  CheckCircle2, Package, Truck, Clock, ArrowRight, 
  Download, Mail, ShieldCheck, MapPin 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    const loadOrder = async () => {
      if (!orderId) return;
      const res = await ordersApi.getOrderById(orderId);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    };
    loadOrder();
  }, [orderId]);

  if (!order) {
    return (
      <StoreLayout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <p className="text-xs text-slate-500">Loading order confirmation...</p>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Success Hero Header matching Fig 8.13 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Payment Verified & Authorized
          </span>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Order Placed Successfully!
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Thank you, <strong>{order.customerName}</strong>! We've received your payment and our vendors have been notified to prepare your shipment.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              Order ID: <strong className="font-mono text-primary">{order.orderId}</strong>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              Total Amount: <strong className="text-slate-900 dark:text-white">₹{order.totalAmount.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* 4-Stage Timeline Card matching Fig 8.13 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Order Status Pipeline</h3>

          <div className="grid grid-cols-4 gap-2 text-center">
            {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((st, idx) => {
              const isPastOrCurrent = idx === 0; // confirmed
              return (
                <div key={st} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isPastOrCurrent 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mt-2">{st}</span>
                  <span className="text-[10px] text-slate-400">
                    {idx === 0 ? 'Payment verified' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Shipment Route & Dispatch Map */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              <span>Live Shipment Dispatch & Route Map</span>
            </h3>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">GPS Dispatch Active</span>
          </div>
          <OrderTrackingMap order={order} height="360px" />
        </div>

        {/* Order Details & Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Items Ordered ({order.items.length})</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {order.items.map(it => (
                <div key={it.sku} className="py-2.5 flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200/70 dark:border-slate-800">
                      <ProductImage
                        src={it.image}
                        productId={it.productId}
                        imageKey={it.image}
                        size="sm"
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{it.name}</p>
                      <p className="text-slate-400 text-[11px]">SKU: {it.sku} × {it.qty}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{(it.unitPrice * it.qty).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delivery Address</h3>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="pt-2 text-primary font-medium">Estimated Delivery: 3 - 5 business days</p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
          >
            <Mail className="w-4 h-4" /> View Simulated Confirmation Email (FR-31)
          </button>

          <div className="flex gap-3">
            <Link to="/orders">
              <Button variant="outline" size="sm">Track in My Orders</Button>
            </Link>
            <Link to="/products">
              <Button size="sm">Continue Shopping <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </div>
        </div>

        {/* Simulated Email Modal (FR-31) */}
        {showEmailModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>Simulated Dispatch — noreply@bluecart.example</span>
                </div>
                <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">×</button>
              </div>

              <div className="space-y-2 text-xs">
                <p><strong>To:</strong> {order.customerEmail}</p>
                <p><strong>Subject:</strong> Your BlueCart Order {order.orderId} has been Confirmed!</p>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-2 border">
                  <p>Hi {order.customerName},</p>
                  <p>Thank you for purchasing with BlueCart! Your payment of ₹{order.totalAmount.toLocaleString('en-IN')} has been settled.</p>
                  <p>We are dispatching your items to {order.shippingAddress.city}, {order.shippingAddress.state}.</p>
                  <p className="pt-2 text-primary font-semibold">Track live progress: #/orders</p>
                </div>
              </div>

              <div className="text-right">
                <Button size="sm" onClick={() => setShowEmailModal(false)}>Close Email</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};
