import React, { useState } from 'react';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usersApi } from '../../api/users.api';
import { 
  User, MapPin, KeyRound, Bell, ShieldCheck, 
  Trash2, Plus, Check 
} from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'password' | 'notifications'>('profile');

  // Personal details
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification toggles (FR-32)
  const [orderNotifs, setOrderNotifs] = useState(user?.preferences?.orderNotifications ?? true);
  const [shippingNotifs, setShippingNotifs] = useState(user?.preferences?.shippingNotifications ?? true);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const res = await usersApi.updateProfile(user.id, { name, mobile });
    if (res.success) {
      refreshUser();
      success('Personal details updated successfully.');
    } else {
      error(res.error || 'Failed to update details');
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

  const handleSavePreferences = async () => {
    if (!user) return;
    const res = await usersApi.updatePreferences(user.id, {
      orderNotifications: orderNotifs,
      shippingNotifications: shippingNotifs
    });
    if (res.success) {
      refreshUser();
      success('Notification preferences updated.');
    }
  };

  return (
    <StoreLayout>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <Breadcrumbs items={[{ label: 'Home', path: '/store' }, { label: 'My Account & Settings' }]} />

        {/* Profile Header & Tabs matching Fig 8.15 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {user?.name || 'Customer Profile'}
              </h1>
              <p className="text-xs text-slate-500">{user?.email} · {user?.mobile}</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Account Status: {user?.status || 'Active'}
              </span>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={logout} className="text-rose-600 hover:bg-rose-50 border-rose-200">
            Sign Out
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'profile' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <User className="w-4 h-4" /> Personal Details
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'addresses' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <MapPin className="w-4 h-4" /> Saved Addresses
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'password' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <KeyRound className="w-4 h-4" /> Change Password
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'notifications' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Bell className="w-4 h-4" /> Notifications (FR-32)
          </button>
        </div>

        {/* Tab Body */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Update Personal Details</h3>
              <Input
                label="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                helperText="Email cannot be changed directly."
              />
              <Input
                label="Mobile Number (+91)"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
              />
              <Button type="submit" size="sm">Save Changes</Button>
            </form>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Manage Addresses</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(user?.savedAddresses || []).map(addr => (
                  <div key={addr.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 dark:text-white">{addr.name}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-bold">Default</span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{addr.street}, {addr.city}</p>
                    <p className="text-slate-500">{addr.state} - {addr.pincode}</p>
                    <p className="text-slate-500 font-mono">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Update Password</h3>
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
                helperText="Minimum 8 characters with letters and numbers."
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <Button type="submit" size="sm">Change Password</Button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-lg space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dispatch Preferences (FR-32)</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Order Confirmation Alerts (FR-31)</p>
                    <p className="text-[11px] text-slate-500">Receive in-app & simulated email on order placement</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={orderNotifs}
                    onChange={e => setOrderNotifs(e.target.checked)}
                    className="rounded text-primary focus:ring-primary w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Fulfillment & Status Updates (FR-32)</p>
                    <p className="text-[11px] text-slate-500">Receive alerts when vendor moves order to Shipped or Delivered</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={shippingNotifs}
                    onChange={e => setShippingNotifs(e.target.checked)}
                    className="rounded text-primary focus:ring-primary w-4 h-4"
                  />
                </label>
              </div>

              <Button onClick={handleSavePreferences} size="sm">
                Save Preferences
              </Button>
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
};
