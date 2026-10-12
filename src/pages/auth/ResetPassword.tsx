import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authApi } from '../../api/auth.api';
import { useToast } from '../../context/ToastContext';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { success } = useToast();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const isExpired = searchParams.get('expired') === 'true';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) {
      setError('This verification link has expired. Please request a new link.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    const res = await authApi.resetPassword(email, token, password);
    setIsLoading(false);

    if (res.success) {
      success('Password successfully reset! Please sign in with your new password.');
      navigate('/login');
    } else {
      setError(res.error || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/login" className="flex items-center justify-center gap-2 mb-2 text-primary hover:underline text-xs font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
        <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white">
          Create New Password
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          Resetting password for: <strong className="text-slate-800 dark:text-slate-200">{email || 'your account'}</strong>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        {isExpired ? (
          <div className="bg-white dark:bg-slate-900 p-8 shadow-xl rounded-2xl border border-rose-200 dark:border-rose-900 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reset Link Expired (FR-06)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              For your security, verification links expire after 15 minutes. This token is no longer valid.
            </p>
            <Link to="/forgot-password">
              <Button variant="primary" className="w-full mt-2">
                Request a New Link
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-2xl border border-slate-200/80 dark:border-slate-800">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs flex items-center gap-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New Password"
                isPassword
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
                disabled={isLoading}
              />

              <Input
                label="Confirm New Password"
                isPassword
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                size="lg"
                isLoading={isLoading}
              >
                Save New Password
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
