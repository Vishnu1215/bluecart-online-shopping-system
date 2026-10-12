import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Key, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';

interface DemoAccountsBoxProps {
  onQuickFill: (email: string, password: string) => void;
  targetRole?: UserRole;
}

export const DemoAccountsBox: React.FC<DemoAccountsBoxProps> = ({
  onQuickFill,
  targetRole
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const accounts = [
    {
      role: 'customer' as UserRole,
      title: 'Customer',
      name: 'Ananya Rao',
      email: 'ananya.rao@example.com',
      password: 'Customer@123',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
    },
    {
      role: 'vendor' as UserRole,
      title: 'Vendor (Distributor)',
      name: 'Vikram Malhotra (TechWest)',
      email: 'vendor@techwest.example',
      password: 'Vendor@123',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
    },
    {
      role: 'admin' as UserRole,
      title: 'Administrator',
      name: 'Rajesh Kumar',
      email: 'admin@shop.example',
      password: 'Admin@123',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
    }
  ];

  const filtered = targetRole 
    ? accounts.filter(a => a.role === targetRole)
    : accounts;

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Key className="w-3.5 h-3.5 text-primary" />
          <span>Demo Credentials & Quick-Fill</span>
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="p-3 pt-0 space-y-2 border-t border-slate-200/50 dark:border-slate-800/50">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 py-1">
            Click any account to automatically populate credentials:
          </p>
          <div className="space-y-1.5">
            {filtered.map(acc => (
              <div
                key={acc.email}
                onClick={() => onQuickFill(acc.email, acc.password)}
                className="group flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary cursor-pointer hover:shadow-sm transition-all"
              >
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${acc.badgeColor}`}>
                      {acc.title}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {acc.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {acc.email} • {acc.password}
                  </span>
                </div>

                <button
                  type="button"
                  className="text-xs text-primary font-medium group-hover:underline px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Fill</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
