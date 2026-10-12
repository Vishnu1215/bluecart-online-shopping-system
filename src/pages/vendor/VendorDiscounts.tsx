import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { productsApi } from '../../api/products.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Product } from '../../types';
import { Tag, Plus, Calendar, Clock, Sparkles } from 'lucide-react';

export const VendorDiscounts: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const vendorId = user?.vendorId || 'vnd_techwest';

  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [discountPercent, setDiscountPercent] = useState('15');
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split('T')[0]);
  const [validTo, setValidTo] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);

  const loadProducts = async () => {
    const res = await productsApi.getProducts({ vendorId, limit: 100, includeInactive: true });
    if (res.success && res.data) {
      setProducts(res.data.products);
      if (res.data.products.length > 0) {
        setSelectedProductId(res.data.products[0].id);
      }
    }
  };

  useEffect(() => {
    loadProducts();
  }, [vendorId]);

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !discountPercent) return;

    const pct = parseInt(discountPercent, 10);
    if (pct <= 0 || pct > 90) {
      error('Discount must be between 1% and 90%');
      return;
    }

    const res = await productsApi.applyTimeDiscount(selectedProductId, {
      percent: pct,
      validFrom,
      validTo,
      description: 'Vendor Promotional Flash Sale'
    });

    if (res.success) {
      success('Time-bound discount applied to product listing!');
      setIsModalOpen(false);
      loadProducts();
    } else {
      error(res.error || 'Failed to apply discount');
    }
  };

  return (
    <ConsoleLayout role="vendor" title="Promotions & Time-Bound Discounts (FR-30)">
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" /> Flash Sales & Listing Discounts (FR-30)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Apply limited-time percentage discounts on your own catalog listings. Dispatched automatically to the storefront during the validity period.
            </p>
          </div>
          <Button size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Create Flash Discount
          </Button>
        </div>

        {/* Listings Discount Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Product Title</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4">Active Flash Discount</th>
                  <th className="py-3 px-4">Validity Window</th>
                  <th className="py-3 px-4">Effective Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map(p => {
                  const hasDiscount = !!p.timeDiscount;
                  const effPrice = hasDiscount 
                    ? Math.round(p.price * (1 - p.timeDiscount!.percent / 100))
                    : p.price;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">{p.sku}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                      <td className="py-3.5 px-4">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4">
                        {hasDiscount ? (
                          <Badge variant="success">{p.timeDiscount!.percent}% OFF Flash</Badge>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {hasDiscount ? `${p.timeDiscount!.validFrom} to ${p.timeDiscount!.validTo}` : '—'}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                        ₹{effPrice.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Discount Modal */}
        {isModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsModalOpen(false)}
            title="Configure Time-Bound Discount (FR-30)"
          >
            <form onSubmit={handleApplyDiscount} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Product Listing</label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-xs"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.sku} — {p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>

              <Input
                label="Discount Percentage (%)"
                type="number"
                value={discountPercent}
                onChange={e => setDiscountPercent(e.target.value)}
                placeholder="15"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Date"
                  type="date"
                  value={validFrom}
                  onChange={e => setValidFrom(e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={validTo}
                  onChange={e => setValidTo(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Apply Discount
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </ConsoleLayout>
  );
};
