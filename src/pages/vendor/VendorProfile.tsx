import React, { useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usersApi } from '../../api/users.api';
import { Building2, Phone, Mail, KeyRound, Check } from 'lucide-react';

export const VendorProfile: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || 'TechWest Retail');
  const [mobile, setMobile] = useState(user?.mobile || '+91 91234 56789');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const res = await usersApi.updateProfile(user.id, { name, mobile });
    if (res.success) {
      refreshUser();
      success('Vendor business profile updated.');
    } else {
      error(res.error || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword.length < 8) {
      error('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('Passwords do not match.');
      return;
    }
    const res = await usersApi.changePassword(user.id, currentPassword, newPassword);
    if (res.success) {
      success('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      error(res.error || 'Failed to change password');
    }
  };

  return (
    <ConsoleLayout role="vendor" title="Vendor (Distributor) Profile">
      <div className="max-w-4xl space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {name}
              </h1>
              <p className="text-xs text-slate-500">{user?.email} · B2B Distributor</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Distributor Status: Approved (Verified)
              </span>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={logout} className="text-rose-600 border-rose-200 hover:bg-rose-50">
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Edit Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" /> Store Credentials
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <Input
                label="Store Name / Registered Legal Entity"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Input
                label="Contact Email"
                value={user?.email || ''}
                disabled
                helperText="Primary email linked to vendor account"
              />
              <Input
                label="Official Phone (+91)"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
              />
              <Button type="submit" size="sm">Save Details</Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" /> Change Console Password
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <Button type="submit" size="sm">Update Password</Button>
            </form>
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
};
