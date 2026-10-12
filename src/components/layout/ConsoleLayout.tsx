import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Truck, 
  BarChart3, Tag, MessageSquare, History, Shield, Store, 
  LogOut, Bell, Menu, X, Sun, Moon, ChevronDown, Check, 
  RotateCcw, Sparkles, Building2, Star, CreditCard 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { db } from '../../db/localStorageDb';
import { notificationsApi } from '../../api/notifications.api';
import { Notification } from '../../types';

interface ConsoleLayoutProps {
  role: 'vendor' | 'admin';
  title: string;
  children: React.ReactNode;
}

export const ConsoleLayout: React.FC<ConsoleLayoutProps> = ({ role, title, children }) => {
  const { user, logout, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      const targetId = role === 'admin' ? 'usr_admin' : (user?.id || 'vendor');
      const res = await notificationsApi.getNotifications(targetId);
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    };
    fetchNotifs();
  }, [role, user]);

  const handleMarkAllRead = async () => {
    const targetId = role === 'admin' ? 'usr_admin' : (user?.id || 'vendor');
    await notificationsApi.markAllAsRead(targetId);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    success('All notifications marked as read.');
  };

  const handleResetData = () => {
    db.reset();
    success('Demo data restored to initial state.');
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  const vendorNavItems = [
    { label: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
    { label: 'My Products', path: '/vendor/products', icon: Package },
    { label: 'Inventory & Stock', path: '/vendor/inventory', icon: Package },
    { label: 'Order Requests', path: '/vendor/orders', icon: ShoppingCart },
    { label: 'Shipments & Deliveries', path: '/vendor/shipments', icon: Truck },
    { label: 'Promotions & Discounts', path: '/vendor/discounts', icon: Tag },
    { label: 'Reports & Analytics', path: '/vendor/reports', icon: BarChart3 },
    { label: 'Vendor Profile', path: '/vendor/profile', icon: Building2 },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Vendors', path: '/admin/vendors', icon: Building2 },
    { label: 'Inventory Threshold', path: '/admin/inventory', icon: Package },
    { label: 'Coupons & Promos', path: '/admin/coupons', icon: Tag },
    { label: 'Reviews Moderation', path: '/admin/reviews', icon: Star },
    { label: 'Payments Ledger', path: '/admin/payments', icon: CreditCard },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'Audit Log (NFR-09)', path: '/admin/audit', icon: History },
    { label: 'Customer Messages', path: '/admin/messages', icon: MessageSquare },
  ];

  const navItems = role === 'vendor' ? vendorNavItems : adminNavItems;
  const consoleLabel = role === 'vendor' ? 'Vendor (Distributor)' : 'Administrator';
  const consoleColor = role === 'vendor' ? 'text-emerald-400' : 'text-purple-400';
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* 1. Left Navy Sidebar (#0F1B3D) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F1B3D] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 border-r border-slate-800 shadow-xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Role Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-[#0A122A]">
          <Link to={role === 'vendor' ? '/vendor/dashboard' : '/admin/dashboard'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-base shadow">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-white tracking-tight leading-tight">
                Blue<span className="text-blue-400">Cart</span>
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${consoleColor}`}>
                {consoleLabel}
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </p>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-slate-800 bg-[#0A122A]/80 space-y-2">
          <Link
            to="/store"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-blue-300 hover:bg-slate-800/60 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Customer Storefront</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Main Console Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Top bar with Title & Profile */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Demo Switcher */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <span className="px-2 text-slate-400">Switch:</span>
              <button
                onClick={() => { switchRole('customer'); navigate('/store'); }}
                className="px-2 py-0.5 rounded hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                Customer
              </button>
              <button
                onClick={() => { switchRole('vendor'); navigate('/vendor/dashboard'); }}
                className={`px-2 py-0.5 rounded transition-colors ${role === 'vendor' ? 'bg-emerald-600 text-white' : 'hover:bg-white'}`}
              >
                Vendor
              </button>
              <button
                onClick={() => { switchRole('admin'); navigate('/admin/dashboard'); }}
                className={`px-2 py-0.5 rounded transition-colors ${role === 'admin' ? 'bg-purple-600 text-white' : 'hover:bg-white'}`}
              >
                Admin
              </button>
            </div>

            {/* Reset Data Button */}
            <button
              onClick={handleResetData}
              title="Reset data"
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden xl:inline">Reset DB</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer */}
              {isNotifOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-fadeIn"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
                      <p className="text-[11px] text-slate-500">{unreadCount} unread alerts</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">No notifications</p>
                    ) : (
                      notifications.slice(0, 8).map(n => (
                        <div key={n.id} className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${!n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow">
                  {user?.avatar || (role === 'admin' ? 'RK' : 'VM')}
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {user?.name || (role === 'admin' ? 'Rajesh Kumar' : 'Vikram Malhotra')}
                  </span>
                  <span className={`text-[10px] font-semibold ${consoleColor}`}>
                    {consoleLabel}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-fadeIn"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Link 
                    to={role === 'vendor' ? '/vendor/profile' : '/admin/dashboard'} 
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                  >
                    Console Settings
                  </Link>
                  <Link 
                    to="/store" 
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                  >
                    Back to Storefront
                  </Link>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
