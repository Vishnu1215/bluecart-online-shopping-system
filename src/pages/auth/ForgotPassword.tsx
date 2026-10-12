import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { authApi } from '../../api/auth.api';
import { useToast } from '../../context/ToastContext';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetData, setResetData] = useState<{ token: string; expiresAt: string; email: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid registered email.');
      return;
    }

    setIsLoading(true);
    setError('');

    const res = await authApi.requestPasswordReset(email);
    setIsLoading(false);

    if (res.success && res.data) {
      setResetData({
        token: res.data.token,
        expiresAt: res.data.expiresAt,
        email: email.trim()
      });
      setIsModalOpen(true);
    } else {
      setError(res.error || 'Failed to generate reset link.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/login" className="flex items-center justify-center gap-2 mb-2 text-primary hover:underline text-xs font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
        <h2 className="text-center text-xl font-bold text-slate-900 dark:text-white">
          Reset Forgotten Password
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          We will simulate dispatching a time-limited 15-minute verification link (FR-06)
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Account Email"
              type="email"
              placeholder="e.g. ananya.rao@example.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              error={error}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
              icon={<Send className="w-4 h-4" />}
            >
              Send Password Reset Link
            </Button>
          </form>
        </div>
      </div>

      {/* Simulated Email Inbox Modal */}
      {resetData && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="📬 Simulated Email Inbox (FR-06 Verification)"
          subtitle="Showing outgoing email dispatched by BlueCart Notification Service"
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span><strong>To:</strong> {resetData.email}</span>
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Clock className="w-3.5 h-3.5" /> Expires in 15 mins
                </span>
              </div>
              <p><strong>Subject:</strong> Reset your BlueCart password</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                <p>Hello,</p>
                <p className="mt-1">
                  We received a request to reset your password. Click the secure verification link below. This link expires in 15 minutes.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* Valid Link */}
              <Link
                to={`/reset-password?token=${resetData.token}&email=${encodeURIComponent(resetData.email)}`}
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                <Button variant="primary" className="w-full" size="md">
                  Open Valid Reset Link <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>

              {/* Demonstrable Expired Link */}
              <Link
                to={`/reset-password?token=expired_token_demo&email=${encodeURIComponent(resetData.email)}&expired=true`}
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                <Button variant="outline" className="w-full text-rose-600 border-rose-300" size="md">
                  Demo Expired Link (401)
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
