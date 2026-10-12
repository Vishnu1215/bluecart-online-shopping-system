import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Lock, Mail, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { DemoAccountsBox } from '../../components/ui/DemoAccountsBox';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const VendorLogin: React.FC = () => {
  const { login } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrors({
        email: !email ? 'Vendor email required' : undefined,
        password: !password ? 'Password required' : undefined
      });
      return;
    }

    setIsLoading(true);
    setGeneralError(null);

    const res = await login(email, password, true, 'vendor');
    setIsLoading(false);

    if (res.success) {
      success('Welcome to the Vendor (Distributor) Console!');
      navigate('/vendor/dashboard');
    } else {
      setGeneralError(res.error || 'Invalid vendor credentials.');
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setErrors({});
    setGeneralError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-2 text-emerald-400 hover:underline text-xs font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Role Chooser
        </Link>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
            <Store className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Blue<span className="text-emerald-400">Cart</span>
          </span>
        </div>
        <h2 className="text-center text-xl font-bold text-white">
          Vendor (Distributor) Console Sign In
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Manage assigned catalog, update stock and fulfill order requests
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 space-y-4">
        {generalError && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <div className="bg-slate-800/90 py-8 px-6 shadow-2xl rounded-2xl border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Distributor Account Email"
              type="email"
              placeholder="vendor@techwest.example"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4 text-emerald-400" />}
              required
              disabled={isLoading}
            />

            <Input
              label="Password"
              isPassword
              placeholder="Enter vendor password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4 text-emerald-400" />}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="success"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
              icon={<Store className="w-4 h-4" />}
            >
              Enter Vendor Console
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700 text-center text-xs text-slate-400">
            <span>Need distributor approval? </span>
            <span className="text-slate-300">
              Only platform administrators can approve vendor accounts (SRS 5.5).
            </span>
          </div>
        </div>

        <DemoAccountsBox onQuickFill={handleQuickFill} targetRole="vendor" />
      </div>
    </div>
  );
};
