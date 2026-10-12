import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Store, Shield, ArrowRight, CheckCircle2, Zap, Award, Layers } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const RoleChooser: React.FC = () => {
  const roles = [
    {
      role: 'customer',
      title: 'Customer Storefront',
      badge: 'Public & Consumer',
      description: 'Explore 40+ products, filter with multi-faceted faceted search, manage live carts, apply coupons, and track 4-stage orders.',
      features: ['Personalized Cart & Wishlist', 'Instant Coupon Discounts (SAVE10)', '7-Day Return Verification (FR-24)', 'Verified Purchaser Ratings (FR-25)'],
      loginPath: '/login',
      storePath: '/store',
      icon: ShoppingBag,
      color: 'bg-blue-600',
      borderHover: 'hover:border-blue-500',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
    },
    {
      role: 'vendor',
      title: 'Vendor (Distributor)',
      badge: 'B2B Partner Portal',
      description: 'Manage assigned catalogues, adjust stock and pricing, fulfill orders through state transitions, and export CSV revenue analytics.',
      features: ['Auto SKU Generation (FR-09)', 'Fulfillment Lifecycle (Table 5.4)', 'Time-Bound Discounts (FR-30)', 'Low-Stock Restock Logging (FR-34)'],
      loginPath: '/vendor/login',
      storePath: '/vendor/dashboard',
      icon: Store,
      color: 'bg-emerald-600',
      borderHover: 'hover:border-emerald-500',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
    },
    {
      role: 'admin',
      title: 'Administrator',
      badge: 'Platform Governance',
      description: 'Comprehensive system oversight. Product soft-delete, order override with mandatory audit reasoning, customer status control, and moderation.',
      features: ['Logged Order Overrides (SRS 5.5)', 'Customer Lock/Suspend Controls', 'Immutable Audit Logs (NFR-09)', 'Vendor Approvals (SRS 5.5)'],
      loginPath: '/admin/login',
      storePath: '/admin/dashboard',
      icon: Shield,
      color: 'bg-purple-600',
      borderHover: 'hover:border-purple-500',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-md">
            B
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">BlueCart</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Online Shopping System (OSS)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/store">
            <Button variant="outline" size="sm">
              Explore Storefront
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-primary text-xs font-bold mb-6 border border-blue-200 dark:border-blue-800">
          <Zap className="w-4 h-4 text-primary" />
          <span>Complete Prototype v1.0 • SRS & Case Study Verified</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white max-w-3xl leading-tight mb-4">
          Select Your Workspace to Begin Exploring BlueCart
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mb-12">
          Experience role-segregated e-commerce designed for seamless customer shopping, vendor fulfillment operations, and administrative governance.
        </p>

        {/* 3 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl text-left">
          {roles.map(r => {
            const Icon = r.icon;
            return (
              <div
                key={r.role}
                className={`relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between ${r.borderHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${r.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${r.badgeColor}`}>
                      {r.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {r.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {r.description}
                  </p>

                  <div className="space-y-2 mb-8">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Capabilities
                    </p>
                    {r.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link to={r.loginPath} className="block w-full">
                    <Button variant="primary" className="w-full" size="md">
                      Log In as {r.title} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link to={r.storePath} className="block w-full text-center">
                    <span className="text-xs text-slate-500 hover:text-primary font-medium hover:underline">
                      Quick Enter Dashboard →
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 BlueCart Online Shopping System. Strict Compliance with SRS v1.0 & Case Study Chapter 8.</p>
      </footer>
    </div>
  );
};
