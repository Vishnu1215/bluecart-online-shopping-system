import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Phone, User, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const CustomerRegister: React.FC = () => {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Real-time password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';

    // Email regex
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    // Indian mobile (+91 pattern or 10 digits starting 6-9)
    const cleanMobile = formData.mobile.replace(/[\s-]/g, '');
    if (!cleanMobile) {
      errs.mobile = 'Mobile number is required.';
    } else if (!/^(\+91)?[6-9]\d{9}$/.test(cleanMobile)) {
      errs.mobile = 'Enter a valid Indian mobile number (10 digits starting with 6–9).';
    }

    // Password criteria: min 8, uppercase, lowercase, number
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      errs.password = 'Must contain uppercase, lowercase letters and at least one number.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const cleanMobile = formData.mobile.startsWith('+91') 
      ? formData.mobile 
      : `+91 ${formData.mobile.replace(/\D/g, '')}`;

    const res = await register({
      name: fullName,
      email: formData.email.trim(),
      mobile: cleanMobile,
      password: formData.password
    });
    setIsLoading(false);

    if (res.success) {
      success('Account created successfully! Please sign in with your credentials.');
      navigate('/login');
    } else {
      setErrors({ email: res.error || 'Registration failed.' });
      toastError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/login" className="flex items-center justify-center gap-2 mb-2 text-primary hover:underline text-xs font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
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
          Create Customer Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          Register with email and password to begin shopping (Figure 8.2, FR-01)
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 shadow-xl rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Ananya"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                error={errors.firstName}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Last Name"
                placeholder="Rao"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                error={errors.lastName}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="ananya.rao@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Mobile Number (India)"
              placeholder="+91 98765 43210"
              value={formData.mobile}
              onChange={e => setFormData({ ...formData, mobile: e.target.value })}
              error={errors.mobile}
              helperText="10-digit Indian phone number"
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />

            <div>
              <Input
                label="Password"
                isPassword
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              {/* Password strength visual meter */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${
                      strength <= 2 ? 'w-1/3 bg-rose-500' : strength <= 4 ? 'w-2/3 bg-amber-500' : 'w-full bg-emerald-500'
                    }`} />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Strength: {strength <= 2 ? 'Weak' : strength <= 4 ? 'Good' : 'Strong'} (Min 8 chars, mixed case & numbers)
                  </p>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              isPassword
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              size="lg"
              isLoading={isLoading}
              icon={<UserPlus className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            <span>Already have a customer account? </span>
            <Link to="/login" className="font-bold text-primary hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
