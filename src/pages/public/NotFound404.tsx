import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';

export const NotFound404: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full text-center space-y-4 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-primary flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">404 Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested route or shopping resource could not be found. Please check the URL or return to the main store.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Home
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
