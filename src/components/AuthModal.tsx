import React, { useState } from 'react';
import { X, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = () => {
    setLoading(true);
    setError(null);

    // Simulated standard Google OAuth client flow
    setTimeout(() => {
      const googleUser: UserProfile = {
        id: `user_g_${Date.now()}`,
        name: 'Christopher Juru',
        email: 'christopherjuru@gmail.com',
        role: 'CUSTOMER',
        authProvider: 'google',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        viewHistory: [],
        createdAt: new Date().toISOString(),
      };
      setLoading(false);
      onAuthSuccess(googleUser);
      onClose();
    }, 700);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (mode === 'register' && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user: UserProfile = {
        id: `user_mail_${Date.now()}`,
        name: mode === 'register' ? fullName.trim() : email.split('@')[0],
        email: email.trim().toLowerCase(),
        role: 'CUSTOMER',
        authProvider: 'email',
        viewHistory: [],
        createdAt: new Date().toISOString(),
      };
      setLoading(false);
      onAuthSuccess(user);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#232f3e] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-black text-xl tracking-tight text-white">
              Fox<span className="text-[#f68b1e]">Price</span>
            </span>
            <span className="text-xs bg-[#f68b1e] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Google OAuth Provider */}
          <div>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-lg shadow-xs text-xs font-semibold transition-all cursor-pointer hover:shadow"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 dark:border-gray-700 w-full" />
            <span className="bg-white dark:bg-[#1a222d] px-3 text-[11px] text-gray-500 uppercase tracking-wider absolute font-medium">
              or with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Christopher Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3.5 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#f68b1e]"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3.5 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#f68b1e]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset instructions sent to your email.')}
                    className="text-[11px] text-[#f68b1e] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-3.5 pr-9 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#f68b1e]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f68b1e] hover:bg-[#e07b16] text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer mt-2"
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to FoxPrice' : 'Register Account'}
            </button>
          </form>

          {/* Toggle login / register */}
          <div className="text-center pt-2 text-xs text-gray-500 dark:text-gray-400">
            {mode === 'login' ? (
              <p>
                Don&apos;t have a FoxPrice account?{' '}
                <button
                  onClick={() => { setMode('register'); setError(null); }}
                  className="text-[#f68b1e] font-bold hover:underline cursor-pointer"
                >
                  Create one here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-[#f68b1e] font-bold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="bg-gray-50 dark:bg-[#151c24] p-3 text-center border-t border-gray-200 dark:border-gray-800 text-[11px] text-gray-500 flex items-center justify-center gap-1.5 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted with 256-Bit SSL Protection · Official Buyer Guarantee</span>
        </div>
      </div>
    </div>
  );
};
