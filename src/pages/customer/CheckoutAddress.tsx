import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { Stepper } from '../../components/ui/Stepper';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { checkoutApi } from '../../api/checkout.api';
import { Address } from '../../types';
import { MapPin, Truck, Check, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';

export const CheckoutAddress: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, pricing } = useCart();
  const { error } = useToast();

  const [addresses, setAddresses] = useState<Address[]>(user?.savedAddresses || [
    {
      id: 'addr_1',
      name: user?.name || 'Ananya Rao',
      phone: user?.mobile || '+91 98765 43210',
      street: 'Plot 42, Road No. 7, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      isDefault: true
    }
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr_1');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [sameAsBilling, setSameAsBilling] = useState<boolean>(true);

  // New Address Form toggle
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isVerifyingStock, setIsVerifyingStock] = useState(false);

  const steps = [
    { label: 'Cart', completed: true },
    { label: 'Address & Shipping', current: true },
    { label: 'Payment' },
    { label: 'Confirmation' }
  ];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!newAddr.name.trim()) errs.name = 'Full name is required';
    if (!/^\+?[0-9\s-]{10,14}$/.test(newAddr.phone)) errs.phone = 'Valid phone (+91 pattern) required';
    if (!newAddr.street.trim()) errs.street = 'Street address is required';
    if (!newAddr.city.trim()) errs.city = 'City is required';
    if (!newAddr.state.trim()) errs.state = 'State is required';
    if (!/^[1-9][0-9]{5}$/.test(newAddr.pincode)) errs.pincode = 'Valid 6-digit Indian PIN required';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const created: Address = {
      id: `addr_${Date.now()}`,
      ...newAddr
    };
    setAddresses([...addresses, created]);
    setSelectedAddressId(created.id);
    setShowNewForm(false);
    setNewAddr({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
  };

  const handleProceedToPayment = async () => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // FR-17 Re-validate stock before allowing checkout
    setIsVerifyingStock(true);
    const stockCheck = await checkoutApi.validateStock(user?.id || 'guest_user');
    setIsVerifyingStock(false);

    if (!stockCheck.success) {
      error(stockCheck.error || 'One or more items in your cart exceed available stock. Redirecting to cart...');
      navigate('/cart');
      return;
    }

    const chosen = addresses.find(a => a.id === selectedAddressId) || addresses[0];
    sessionStorage.setItem('bluecart_checkout_address', JSON.stringify(chosen));
    sessionStorage.setItem('bluecart_checkout_shipping', shippingMethod);
    navigate('/checkout/payment');
  };

  return (
    <StoreLayout>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        <Stepper steps={steps} currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (Left 8 cols) matching Fig 8.11 */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Select Delivery Address (FR-18)
                </h2>
                {!showNewForm && (
                  <button
                    onClick={() => setShowNewForm(true)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {/* Saved Addresses Radio Cards */}
              {!showNewForm && (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <label
                      key={addr.id}
                      className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === addr.id 
                          ? 'border-primary bg-blue-50/40 dark:bg-blue-950/20 ring-1 ring-primary' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="selected_address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 text-primary focus:ring-primary"
                        />
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-slate-900 dark:text-white">{addr.name} ({addr.phone})</p>
                          <p className="text-slate-600 dark:text-slate-300">{addr.street}, {addr.city}</p>
                          <p className="text-slate-500">{addr.state} — {addr.pincode}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* New Address Form */}
              {showNewForm && (
                <form onSubmit={handleAddNewAddress} className="space-y-4 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/70">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    New Shipping Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Full Name"
                      value={newAddr.name}
                      onChange={e => setNewAddr({ ...newAddr, name: e.target.value })}
                      error={formErrors.name}
                      placeholder="Ananya Rao"
                    />
                    <Input
                      label="Phone (+91)"
                      value={newAddr.phone}
                      onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
                      error={formErrors.phone}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <Input
                    label="Street Address"
                    value={newAddr.street}
                    onChange={e => setNewAddr({ ...newAddr, street: e.target.value })}
                    error={formErrors.street}
                    placeholder="Plot / Flat, Building, Road"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="City"
                      value={newAddr.city}
                      onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                      error={formErrors.city}
                      placeholder="Hyderabad"
                    />
                    <Input
                      label="State"
                      value={newAddr.state}
                      onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}
                      error={formErrors.state}
                      placeholder="Telangana"
                    />
                    <Input
                      label="Pincode (6 digits)"
                      value={newAddr.pincode}
                      onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })}
                      error={formErrors.pincode}
                      placeholder="500033"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowNewForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      Save & Use
                    </Button>
                  </div>
                </form>
              )}

              {/* Billing Address checkbox */}
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={e => setSameAsBilling(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Billing address is same as shipping address</span>
              </label>
            </div>

            {/* Shipping Method Option matching Fig 8.11 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" /> Delivery Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                    shippingMethod === 'standard' 
                      ? 'border-primary bg-blue-50/40 dark:bg-blue-950/20' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Standard Delivery</p>
                      <p className="text-[11px] text-slate-500">4 - 5 business days</p>
                    </div>
                    <span className="text-xs font-extrabold text-primary">₹49 (Free &gt; ₹5,000)</span>
                  </div>
                  <input
                    type="radio"
                    name="shipping_opt"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="sr-only"
                  />
                </label>

                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                    shippingMethod === 'express' 
                      ? 'border-primary bg-blue-50/40 dark:bg-blue-950/20' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Express Delivery</p>
                      <p className="text-[11px] text-slate-500">1 - 2 business days</p>
                    </div>
                    <span className="text-xs font-extrabold text-primary">₹149</span>
                  </div>
                  <input
                    type="radio"
                    name="shipping_opt"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/cart')}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Cart
              </Button>
              <Button size="lg" onClick={handleProceedToPayment} disabled={isVerifyingStock}>
                {isVerifyingStock ? 'Verifying Stock...' : 'Proceed to Payment'} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Order Summary ({items.length} items)</h3>
            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {items.map(it => (
                <div key={it.productId} className="pt-2 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400 line-clamp-1">{it.name} × {it.qty}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{(it.price * it.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{pricing.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {pricing.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{pricing.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Tax (18% GST)</span>
                <span>₹{pricing.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span>₹{shippingMethod === 'express' ? 149 : (pricing.freeShippingApplied ? 0 : 49)}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between text-base font-extrabold text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span>₹{(pricing.discountedSubtotal + pricing.taxAmount + (shippingMethod === 'express' ? 149 : (pricing.freeShippingApplied ? 0 : 49))).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};
