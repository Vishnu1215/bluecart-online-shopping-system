import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { couponsApi } from '../../api/coupons.api';
import { useToast } from '../../context/ToastContext';
import { Coupon } from '../../types';
import { Tag, Plus, CheckCircle2, AlertCircle, Ban } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const { success, error } = useToast();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New coupon form
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'flat'>('percent');
  const [value, setValue] = useState('10');
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split('T')[0]);
  const [validTo, setValidTo] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [usageLimit, setUsageLimit] = useState('100');

  const loadCoupons = async () => {
    const res = await couponsApi.getCoupons();
    if (res.success && res.data) {
      setCoupons(res.data);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value || !usageLimit) return;

    const res = await couponsApi.createCoupon({
      code: code.trim().toUpperCase(),
      type,
      value: parseFloat(value),
      validFrom,
      validTo,
      usageLimit: parseInt(usageLimit, 10)
    }, 'admin');

    if (res.success) {
      success(`Coupon "${code.toUpperCase()}" created successfully!`);
      setIsModalOpen(false);
      setCode('');
      loadCoupons();
    } else {
      error(res.error || 'Failed to create coupon');
    }
  };

  const handleToggleStatus = async (c: Coupon) => {
    const res = await couponsApi.updateCoupon(c.id, { isActive: !c.isActive }, 'admin');
    if (res.success) {
      success(`Coupon status updated.`);
      loadCoupons();
    }
  };

  return (
    <ConsoleLayout role="admin" title="Coupons & Promotional Rules (FR-28, Fig 8.20)">
      <div className="space-y-6">
        {/* Banner matching Fig 8.20 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" /> Active Promotional Campaigns
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure flat or percentage discount vouchers with strict usage bounds, validity dates, and automatic exhaustion triggers (FR-28, FR-29).
            </p>
          </div>
          <Button size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> + New Coupon (FR-28)
          </Button>
        </div>

        {/* Coupons Table matching Fig 8.20 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount Value</th>
                  <th className="py-3 px-4">Validity Window</th>
                  <th className="py-3 px-4">Usage Counter</th>
                  <th className="py-3 px-4">Status Pill</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {coupons.map(c => {
                  const isExpired = new Date(c.validTo).getTime() < Date.now();
                  const isNearlyExhausted = c.usedCount >= c.usageLimit * 0.8 && c.usedCount < c.usageLimit;
                  const isExhausted = c.usedCount >= c.usageLimit;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-mono font-extrabold text-primary">{c.code}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} Flat Off`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {c.validFrom} to {c.validTo}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {c.usedCount}
                        </span>{' '}
                        / {c.usageLimit} claims
                      </td>
                      <td className="py-3.5 px-4">
                        {!c.isActive ? (
                          <Badge variant="danger">Disabled</Badge>
                        ) : isExpired ? (
                          <Badge variant="danger">Expired</Badge>
                        ) : isExhausted ? (
                          <Badge variant="danger">Exhausted</Badge>
                        ) : isNearlyExhausted ? (
                          <Badge variant="warning">Nearly Used</Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(c)}
                        >
                          {c.isActive ? 'Disable' : 'Enable'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Coupon Modal */}
        {isModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsModalOpen(false)}
            title="Create New Coupon (FR-28)"
          >
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <Input
                label="Coupon Code (Unique Uppercase)"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FESTIVE200"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <Input
                  label="Discount Value"
                  type="number"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  placeholder="10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Valid From"
                  type="date"
                  value={validFrom}
                  onChange={e => setValidFrom(e.target.value)}
                />
                <Input
                  label="Valid Until"
                  type="date"
                  value={validTo}
                  onChange={e => setValidTo(e.target.value)}
                />
              </div>

              <Input
                label="Total Usage Limit"
                type="number"
                value={usageLimit}
                onChange={e => setUsageLimit(e.target.value)}
                placeholder="100"
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit">
                  Save Coupon
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </ConsoleLayout>
  );
};
