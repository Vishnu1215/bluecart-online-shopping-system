import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ShieldAlert, ArrowLeft, History } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { DemoAccountsBox } from '../../components/ui/DemoAccountsBox';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [lockoutCountdown, setLockoutCountdown] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lockoutCountdown === null || lockoutCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockoutCountdown(prev => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrors({
        email: !email ? 'Admin email is required.' : undefined,
        password: !password ? 'Password is required.' : undefined
      });
      return;
    }

    setIsLoading(true);
    setGeneralError(null);

    const res = await login(email, password, true, 'admin');
    setIsLoading(false);

    if (res.success) {
      success('Authenticated into Administrator Control Panel');
      navigate('/admin/dashboard');
    } else {
      setGeneralError(res.error || 'Invalid administrator credentials.');
      if (res.lockRemainingSeconds) {
        setLockoutCountdown(res.lockRemainingSeconds);
      }
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
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
    <div className="min-h-screen bg-[#0A122A] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-2 text-purple-400 hover:underline text-xs font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Role Chooser
        </Link>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Blue<span className="text-purple-400">Cart</span> Admin
          </span>
        </div>
        <h2 className="text-center text-xl font-bold text-white">
          Administrator Sign In
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Privileged System Control & Governance (Figure 8.19)
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 space-y-4">
        {/* Mandatory Security Banner from Report Fig 8.19 */}
        <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-800/80 text-purple-200 text-xs flex items-start gap-3 shadow-lg">
          <History className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-bold text-white">Administrative Security Policy Notice (FR-07, NFR-09)</p>
            <p className="mt-1 text-purple-300">
              Accounts lock for 15 minutes after 5 failed attempts. All admin actions are written to the immutable audit log.
            </p>
          </div>
        </div>

        {/* Lockout alert */}
        {lockoutCountdown !== null && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Administrative Account Locked (HTTP 423)</p>
              <p className="mt-1">5 consecutive authentication failures detected. Please wait for cooldown.</p>
              <p className="mt-2 font-mono font-bold text-base text-rose-400">
                Unlock in: {formatCountdown(lockoutCountdown)}
              </p>
            </div>
          </div>
        )}

        {generalError && lockoutCountdown === null && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <div className="bg-[#0F1B3D] py-8 px-6 shadow-2xl rounded-2xl border border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Administrator Email"
              type="email"
              placeholder="admin@shop.example"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4 text-purple-400" />}
              required
              disabled={isLoading || (lockoutCountdown !== null && lockoutCountdown > 0)}
            />

            <Input
              label="Security Password"
              isPassword
              placeholder="Enter administrator password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4 text-purple-400" />}
              required
              disabled={isLoading || (lockoutCountdown !== null && lockoutCountdown > 0)}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 !bg-purple-600 hover:!bg-purple-700 !shadow-purple-600/30"
              size="lg"
              isLoading={isLoading}
              disabled={lockoutCountdown !== null && lockoutCountdown > 0}
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Authenticate & Open Panel
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Privileged internal portal • Session expires in 24 hours</span>
          </div>
        </div>

        <DemoAccountsBox onQuickFill={handleQuickFill} targetRole="admin" />
      </div>
    </div>
  );
};
