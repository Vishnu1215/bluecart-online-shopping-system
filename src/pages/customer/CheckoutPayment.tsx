import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { Stepper } from '../../components/ui/Stepper';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { checkoutApi, PaymentDetails } from '../../api/checkout.api';
import { 
  CreditCard, Smartphone, Building, Banknote, 
  ShieldCheck, AlertTriangle, ArrowLeft, Loader2, Lock 
} from 'lucide-react';

export const CheckoutPayment: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, pricing, clearCart } = useCart();
  const { error, success } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('card');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Card fields (Luhn verified)
  const [cardNumber, setCardNumber] = useState('4532 0150 1234 5678');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Ananya Rao');

  // UPI field
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');

  // Netbanking field
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const shippingMethod = (sessionStorage.getItem('bluecart_checkout_shipping') || 'standard') as 'standard' | 'express';
  const shippingAddress = JSON.parse(sessionStorage.getItem('bluecart_checkout_address') || 'null');

  const steps = [
    { label: 'Cart', completed: true },
    { label: 'Address & Shipping', completed: true },
    { label: 'Payment', current: true },
    { label: 'Confirmation' }
  ];

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 13 || cleanNum.length > 19) {
        errs.cardNumber = 'Card number must be 13-19 digits';
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
        errs.cardExpiry = 'Format MM/YY required';
      }
      if (!/^\d{3,4}$/.test(cardCvv)) {
        errs.cardCvv = 'CVV must be 3 or 4 digits';
      }
      if (!cardHolder.trim()) {
        errs.cardHolder = 'Cardholder name is required';
      }
    } else if (paymentMethod === 'upi') {
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
        errs.upiId = 'Valid UPI ID format required (e.g. name@bank)';
      }
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;

    if (!shippingAddress) {
      error('Please select shipping address first.');
      navigate('/checkout/address');
      return;
    }

    setIsProcessing(true);

    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
      card: paymentMethod === 'card' ? {
        cardNumber: cardNumber.replace(/\s+/g, ''),
        expiryDate: cardExpiry,
        cvv: cardCvv,
        cardholderName: cardHolder
      } : undefined,
      upiId: paymentMethod === 'upi' ? upiId : undefined,
      bankName: paymentMethod === 'netbanking' ? selectedBank : undefined
    };

    const res = await checkoutApi.processCheckout({
      userId: user?.id || 'usr_ananya',
      shippingAddress,
      billingAddress: shippingAddress,
      shippingMethod,
      paymentDetails,
      simulateFailure // TC-17 simulation toggle
    });

    setIsProcessing(false);

    if (res.success && res.data) {
      await clearCart();
      success('Payment approved! Order created successfully.');
      navigate(`/checkout/confirmation/${res.data.order.orderId}`);
    } else {
      error(res.error || 'Payment transaction failed. Please retry.');
    }
  };

  return (
    <StoreLayout>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        <Stepper steps={steps} currentStep={3} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Payment Options (Left 8 cols) matching Fig 8.12 */}
          <div className="lg:col-span-8 space-y-6">
            {/* PCI-DSS Security Notice Banner (NFR-08) */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold">PCI-DSS 256-Bit Encrypted Payment Gateway</p>
                  <p className="text-slate-300 text-[11px]">Card credentials are never stored on this platform (NFR-08).</p>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-400 hidden sm:block" />
            </div>

            {/* Payment Method Tabs */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Choose Payment Method (FR-19)</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-primary bg-blue-50/50 dark:bg-blue-950/20 text-primary' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1.5" />
                  <span className="text-xs font-bold">Credit/Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                    paymentMethod === 'upi' 
                      ? 'border-primary bg-blue-50/50 dark:bg-blue-950/20 text-primary' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mb-1.5" />
                  <span className="text-xs font-bold">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                    paymentMethod === 'netbanking' 
                      ? 'border-primary bg-blue-50/50 dark:bg-blue-950/20 text-primary' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-600'
                  }`}
                >
                  <Building className="w-5 h-5 mb-1.5" />
                  <span className="text-xs font-bold">Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                    paymentMethod === 'cod' 
                      ? 'border-primary bg-blue-50/50 dark:bg-blue-950/20 text-primary' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-600'
                  }`}
                >
                  <Banknote className="w-5 h-5 mb-1.5" />
                  <span className="text-xs font-bold">Cash on Delivery</span>
                </button>
              </div>

              {/* Form Content based on method */}
              <form onSubmit={handlePayNow} className="space-y-4 pt-2">
                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <Input
                      label="Cardholder Name"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      error={formErrors.cardHolder}
                      placeholder="Name as on card"
                    />
                    <Input
                      label="Card Number (Luhn Validated)"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      error={formErrors.cardNumber}
                      placeholder="16-digit card number"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Expiry Date"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        error={formErrors.cardExpiry}
                        placeholder="MM/YY"
                      />
                      <Input
                        label="CVV / CVC"
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        error={formErrors.cardCvv}
                        placeholder="3 or 4 digits"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-3">
                    <Input
                      label="Virtual Payment Address (UPI ID)"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      error={formErrors.upiId}
                      placeholder="mobile@upi or user@okhdfcbank"
                    />
                    <p className="text-[11px] text-slate-400">A payment prompt will be dispatched to your UPI application.</p>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <p className="font-bold">Cash on Delivery Policy</p>
                    <p>Pay upon delivery via Cash or QR scan at doorstep. Valid ID may be required by courier agent.</p>
                  </div>
                )}

                {/* Simulate Failed Payment Toggle (Testing Requirement TC-17) */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 cursor-pointer text-xs text-rose-700 dark:text-rose-400">
                    <input
                      type="checkbox"
                      checked={simulateFailure}
                      onChange={e => setSimulateFailure(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span>Simulate failed payment (Test TC-17: Cart & stock kept, retry allowed)</span>
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button type="button" variant="outline" size="sm" onClick={() => navigate('/checkout/address')}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button type="submit" size="lg" disabled={isProcessing} className="min-w-[160px]">
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Authorizing...
                      </span>
                    ) : (
                      `Pay ₹${(pricing.discountedSubtotal + pricing.taxAmount + (shippingMethod === 'express' ? 149 : (pricing.freeShippingApplied ? 0 : 49))).toLocaleString('en-IN')}`
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delivery Details</h3>
            {shippingAddress && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 text-xs space-y-1">
                <p className="font-bold">{shippingAddress.name}</p>
                <p className="text-slate-500">{shippingAddress.street}, {shippingAddress.city}</p>
                <p className="text-slate-500">{shippingAddress.state} - {shippingAddress.pincode}</p>
                <p className="text-primary font-medium pt-1">Method: {shippingMethod === 'express' ? 'Express (1-2 days)' : 'Standard (4-5 days)'}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
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
                <span>Total Payable</span>
                <span>₹{(pricing.discountedSubtotal + pricing.taxAmount + (shippingMethod === 'express' ? 149 : (pricing.freeShippingApplied ? 0 : 49))).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};
