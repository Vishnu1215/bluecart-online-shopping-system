import React, { useState } from 'react';
import { StoreLayout } from '../../components/layout/StoreLayout';
import { ShieldCheck, Truck, Clock, Award, Users, Store, HeartHandshake, Sparkles } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <StoreLayout>
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
            About BlueCart OSS
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
            Next-Generation Role-Based Commerce Platform
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            BlueCart bridges consumer convenience and distributor governance. Powered by an IEEE 830-compliant specification, BlueCart enables seamless digital retail, verifiable stock management, and granular multi-tenant operations.
          </p>
        </div>

        {/* Stats Grid - Figure 8.17 stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-sm hover:border-primary/40 transition-colors">
            <p className="text-3xl font-extrabold text-primary">₹18.4L+</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Platform GMV</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-sm hover:border-primary/40 transition-colors">
            <p className="text-3xl font-extrabold text-emerald-600">1,280+</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Orders Fulfilled</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-sm hover:border-primary/40 transition-colors">
            <p className="text-3xl font-extrabold text-purple-600">9,700+</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Active Customers</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-sm hover:border-primary/40 transition-colors">
            <p className="text-3xl font-extrabold text-amber-500">99.8%</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Fulfillment Rate</p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-primary flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Strict Role Governance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Three strictly separated actors: Customers shop, Vendors (Distributors) fulfill their own catalog, and Administrators oversee system compliance and immutable audit trails.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Reliable Order Lifecycle</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              A finite state machine governs every transaction from Confirmed through Processing, Shipped, Delivered, to Returns. Real-time notifications keep customers updated.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Verified Feedback</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Reviews are restricted strictly to customers with verified deliveries. Automatic score recalculations guarantee trustworthy product ratings.
            </p>
          </div>
        </div>

        {/* Project Context Footer Card */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">Software Engineering Case Study</h4>
          </div>
          <h2 className="text-xl font-bold">Online Shopping System (OSS v1.0)</h2>
          <p className="text-xs text-blue-200 mt-2 leading-relaxed max-w-3xl">
            Designed and authored by Vishnu Teja Karampuri (1601-24-737-112) under the guidance of B Swathi (Assistant Professor, Dept. of IT, Chaitanya Bharathi Institute of Technology, Hyderabad). All 35 Functional Requirements and 9 Non-Functional Requirements are implemented and verifiable in this prototype.
          </p>
        </div>
      </div>
    </StoreLayout>
  );
};
