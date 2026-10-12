import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, Mail, AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { DemoAccountsBox } from '../../components/ui/DemoAccountsBox';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const CustomerLogin: React.FC = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Inline validation errors (<= 200ms)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [lockoutCountdown, setLockoutCountdown] = useState<number | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutCountdown === null || lockoutCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockoutCountdown(prev => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutCountdown]);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!emailOrUsername.trim()) {
      newErrors.email = 'Email or username is required.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setGeneralError(null);

    const result = await login(emailOrUsername, password, rememberMe, 'customer');
    setIsLoading(false);

    if (result.success) {
      success('Welcome back to BlueCart!');
      const from = (location.state as any)?.from?.pathname || '/store';
      navigate(from, { replace: true });
    } else {
      setGeneralError(result.error || 'Invalid credentials.');
      if (result.lockRemainingSeconds) {
        setLockoutCountdown(result.lockRemainingSeconds);
      }
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmailOrUsername(fillEmail);
    setPassword(fillPass);
    setErrors({});
    setGeneralError(null);
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-2 text-primary hover:underline text-xs font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Role Chooser
        </Link>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xl shadow">
            B
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            BlueCart
          </span>
        </div>
        <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white">
          Customer Sign In
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          Sign in to manage your cart, orders and profile (Figure 8.1)
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 space-y-4">
        {/* Lockout Warning Banner (Algorithm 6.4.1, FR-07) */}
        {lockoutCountdown !== null && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs flex items-start gap-3 animate-fadeIn">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Account Temporarily Locked (HTTP 423)</p>
              <p className="mt-1 leading-relaxed">
                Security Lockout active due to 5 consecutive failed login attempts (FR-07).
              </p>
              <p className="mt-2 font-mono font-bold text-base text-rose-600 dark:text-rose-400">
                Try again in: {formatCountdown(lockoutCountdown)}
              </p>
            </div>
          </div>
        )}

        {/* General Error */}
        {generalError && lockoutCountdown === null && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email or Username"
              type="text"
              placeholder="e.g. ananya.rao@example.com"
              value={emailOrUsername}
              onChange={e => {
                setEmailOrUsername(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              disabled={isLoading || (lockoutCountdown !== null && lockoutCountdown > 0)}
            />

            <Input
              label="Password"
              isPassword
              placeholder="Enter your password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              required
              disabled={isLoading || (lockoutCountdown !== null && lockoutCountdown > 0)}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <span>Remember me (24h token)</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
              disabled={lockoutCountdown !== null && lockoutCountdown > 0}
              icon={<LogIn className="w-4 h-4" />}
            >
              Sign In to BlueCart
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            <span>Don't have an account? </span>
            <Link to="/register" className="font-bold text-primary hover:underline">
              Create an account (FR-01)
            </Link>
          </div>
        </div>

        {/* Collapsible Demo Accounts Box */}
        <DemoAccountsBox onQuickFill={handleQuickFill} targetRole="customer" />
      </div>
    </div>
  );
};
