import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const Forbidden403: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full text-center space-y-4 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">403 Forbidden</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Access Denied. You do not possess the required Role-Based Access Control (RBAC) permissions (FR-05) to view this console.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Role Chooser
            </Button>
          </Link>
          <Link to="/store">
            <Button size="sm">
              <Home className="w-4 h-4 mr-1.5" /> Storefront
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
