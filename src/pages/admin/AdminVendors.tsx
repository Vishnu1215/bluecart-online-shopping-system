import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { vendorsApi } from '../../api/vendors.api';
import { useToast } from '../../context/ToastContext';
import { Vendor } from '../../types';
import { Building2, Plus, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export const AdminVendors: React.FC = () => {
  const { success, error } = useToast();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [commissionRate, setCommissionRate] = useState('10');

  const loadVendors = async () => {
    const res = await vendorsApi.getVendors();
    if (res.success && res.data) {
      setVendors(res.data);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactEmail.trim()) return;

    const res = await vendorsApi.createVendor({
      name,
      contactEmail,
      phone,
      commissionRate: parseFloat(commissionRate)
    }, 'admin');

    if (res.success) {
      success(`Distributor "${name}" created and approved!`);
      setIsModalOpen(false);
      setName('');
      setContactEmail('');
      setPhone('');
      loadVendors();
    } else {
      error(res.error || 'Failed to create vendor');
    }
  };

  const handleApprove = async (vendorId: string) => {
    const res = await vendorsApi.updateStatus(vendorId, 'Approved', 'admin');
    if (res.success) {
      success('Vendor approved! Catalog access granted.');
      loadVendors();
    }
  };

  const handleDeactivate = async (vendorId: string) => {
    const res = await vendorsApi.updateStatus(vendorId, 'Suspended', 'admin');
    if (res.success) {
      success('Vendor suspended.');
      loadVendors();
    }
  };

  return (
    <ConsoleLayout role="admin" title="Vendor (Distributor) Governance (SRS 5.5)">
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" /> Approved Distributor Partners
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Per SRS 5.5, only Administrators may provision, approve, or deactivate vendor accounts. Pending vendors must be verified before login.
            </p>
          </div>
          <Button size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Create Vendor Partner
          </Button>
        </div>

        {/* Vendors Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4">Vendor ID</th>
                  <th className="py-3 px-4">Distributor Entity</th>
                  <th className="py-3 px-4">Contact Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Commission</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vendors.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{v.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{v.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{v.contactEmail}</td>
                    <td className="py-3.5 px-4 text-slate-500">{v.phone}</td>
                    <td className="py-3.5 px-4 font-semibold">{v.commissionRate}%</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={v.status === 'Approved' ? 'success' : v.status === 'Pending' ? 'warning' : 'danger'}>
                        {v.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {v.status === 'Pending' && (
                        <Button size="sm" onClick={() => handleApprove(v.id)} className="bg-emerald-600 hover:bg-emerald-700">
                          Approve Distributor
                        </Button>
                      )}
                      {v.status === 'Approved' && (
                        <button
                          onClick={() => handleDeactivate(v.id)}
                          className="px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded font-semibold text-[11px]"
                        >
                          Suspend
                        </button>
                      )}
                      {v.status === 'Suspended' && (
                        <button
                          onClick={() => handleApprove(v.id)}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded font-semibold text-[11px]"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Vendor Modal */}
        {isModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsModalOpen(false)}
            title="Create Authorized Vendor / Distributor (SRS 5.5)"
          >
            <form onSubmit={handleCreateVendor} className="space-y-4 text-xs">
              <Input
                label="Distributor Company Name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. UrbanStride Retail"
              />
              <Input
                label="Official Contact Email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="partner@urbanstride.example"
              />
              <Input
                label="Phone (+91)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98111 22334"
              />
              <Input
                label="Agreed Commission Rate (%)"
                type="number"
                value={commissionRate}
                onChange={e => setCommissionRate(e.target.value)}
                placeholder="10"
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit">
                  Provision & Authorize
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </ConsoleLayout>
  );
};
