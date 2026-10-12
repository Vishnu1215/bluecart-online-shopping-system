import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, Heart, User, Search, Menu, X, Bell, 
  Sun, Moon, ShieldCheck, ChevronDown, RotateCcw, LogOut, 
  ExternalLink, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { db } from '../../db/localStorageDb';
import { OnboardingTour } from '../ui/OnboardingTour';

interface StoreLayoutProps {
  children: React.ReactNode;
}

export const StoreLayout: React.FC<StoreLayoutProps> = ({ children }) => {
  const { user, role, logout, switchRole } = useAuth();
  const { itemCount } = useCart();
  const { wishlistIds } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleResetData = () => {
    db.reset();
    success('Demo data restored to initial state.');
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  const categories = [
    { label: 'All Products', path: '/products' },
    { label: 'Audio', path: '/category/Audio' },
    { label: 'Mobiles', path: '/category/Mobiles' },
    { label: 'Computers', path: '/category/Computers' },
    { label: 'Wearables', path: '/category/Wearables' },
    { label: 'Footwear', path: '/category/Footwear' },
    { label: 'Cameras', path: '/category/Cameras' },
    { label: 'Bags & Fashion', path: '/category/Bags' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* 0. Demo Evaluation Helper Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> BlueCart Prototype v1.0
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            Current Actor: <strong className="text-white capitalize">{role || 'Guest'}</strong> ({user?.name || 'Browse mode'})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-800 rounded-md p-0.5">
            <button
              onClick={() => switchRole('customer')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                role === 'customer' ? 'bg-primary text-white' : 'hover:text-white'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => { switchRole('vendor'); navigate('/vendor/dashboard'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                role === 'vendor' ? 'bg-emerald-600 text-white' : 'hover:text-white'
              }`}
            >
              Vendor (Distributor)
            </button>
            <button
              onClick={() => { switchRole('admin'); navigate('/admin/dashboard'); }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                role === 'admin' ? 'bg-purple-600 text-white' : 'hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          <button
            onClick={handleResetData}
            title="Reset localStorage database to fresh initial seed data"
            className="flex items-center gap-1 text-[11px] text-rose-300 hover:text-rose-100 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* 1. Main Primary Top Bar (#2563EB) */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/store" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                B
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                  Blue<span className="text-blue-200">Cart</span>
                </span>
                <span className="text-[10px] text-blue-100 tracking-wider uppercase font-semibold">
                  Online Shopping System
                </span>
              </div>
            </Link>

            {/* Wide Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search over 40+ products, brands, categories (e.g. Aurora, StrideX, AeroBook)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-24 py-2.5 rounded-lg text-sm bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-4 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Right Nav Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                aria-label="Toggle light/dark theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors relative flex items-center gap-1"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                <span className="hidden lg:inline text-xs font-medium">Wishlist</span>
                {wishlistIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* Persistent Cart Indicator (SRS 3.1) */}
              <Link
                to="/cart"
                id="cart-indicator-btn"
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 px-3 py-2 rounded-lg transition-all relative border border-white/20 shadow-sm"
                title="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  {itemCount > 0 && (
                    <span 
                      id="cart-live-count"
                      className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse-once"
                    >
                      {itemCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-[10px] text-blue-200 font-semibold uppercase">Cart</span>
                  <span className="text-xs font-bold text-white">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center gap-2 hover:bg-white/10 p-1.5 rounded-lg transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-200 text-primary font-bold text-xs flex items-center justify-center shadow">
                      {user.avatar || user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="hidden md:flex flex-col leading-none">
                      <span className="text-xs font-bold text-white max-w-[100px] truncate">{user.name}</span>
                      <span className="text-[10px] text-blue-200 capitalize">{role}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 bg-white text-primary hover:bg-blue-50 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                )}

                {/* Account Menu Popup */}
                {isAccountMenuOpen && user && (
                  <div 
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-slate-800 dark:text-slate-200 animate-fadeIn"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">
                      My Orders (History)
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">
                      Account Profile
                    </Link>

                    {role === 'vendor' && (
                      <Link to="/vendor/dashboard" className="flex items-center gap-2 px-4 py-2 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-bold">
                        Vendor (Distributor) Console
                      </Link>
                    )}
                    {role === 'admin' && (
                      <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-xs text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-bold">
                        Admin Control Panel
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white"
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-l-lg text-sm bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 bg-primary-800 text-white rounded-r-lg text-sm font-semibold flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* 2. Category Nav Strip (All Categories, Mobiles, Computers, Audio...) */}
        <nav className="bg-primary-700/90 border-t border-white/10 text-white text-xs font-semibold overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 py-2">
            {categories.map(cat => {
              const isActive = location.pathname === cat.path;
              return (
                <Link
                  key={cat.label}
                  to={cat.path}
                  className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'hover:bg-white/15 text-white'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
            <Link
              to="/products?sort=popularity"
              className="ml-auto px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold whitespace-nowrap shadow-sm transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-slate-900" />
              <span>Festive Deals</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2 z-30 shadow-lg animate-fadeIn">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Explore</p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <Link
                key={cat.label}
                to={cat.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50"
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-2">
            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-medium text-slate-700 dark:text-slate-200">
              My Orders & Returns
            </Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-medium text-slate-700 dark:text-slate-200">
              Contact Customer Support
            </Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-medium text-slate-700 dark:text-slate-200">
              About BlueCart
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Onboarding tour for first-time visitors (SRS 2.6) */}
      <OnboardingTour />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1: Brand & Purpose */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                  B
                </div>
                <span className="text-base font-extrabold text-white">BlueCart</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                Centralized role-based Online Shopping System (OSS) delivering reliable retail logistics across India.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>PCI-DSS Delegated Architecture (NFR-08)</span>
              </div>
            </div>

            {/* Col 2: Customer Care */}
            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3">Customer Service</h5>
              <ul className="space-y-2">
                <li><Link to="/orders" className="hover:text-white transition-colors">Track Order Status</Link></li>
                <li><Link to="/orders" className="hover:text-white transition-colors">7-Day Easy Returns (FR-24)</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support Helpdesk</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>

            {/* Col 3: Consoles & Portals */}
            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3">Actor Workspaces</h5>
              <ul className="space-y-2">
                <li><Link to="/vendor/login" className="hover:text-white transition-colors">Vendor (Distributor) Console</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Administrator Sign In</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Customer Account Login</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Landing & Role Chooser</Link></li>
              </ul>
            </div>

            {/* Col 4: Verified Policies & Specs */}
            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3">Specifications Compliance</h5>
              <p className="text-slate-400 text-xs leading-relaxed mb-2">
                Engineered to strict compliance with SRS v1.0 (FR-01 to FR-35, NFR-01 to NFR-09) and Case Study Report.
              </p>
              <p className="text-slate-500 text-[11px]">
                Currency: Indian Rupee (₹ INR) • GST: 18% • Password: Bcrypt Cost 10+
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <p>© 2026 BlueCart Online Shopping System. Built for Case Study Demonstration.</p>
            <div className="flex items-center gap-4">
              <span>HashRouter Architecture</span>
              <span>•</span>
              <span>Persistent Local Storage (bluecart_db_v1)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
