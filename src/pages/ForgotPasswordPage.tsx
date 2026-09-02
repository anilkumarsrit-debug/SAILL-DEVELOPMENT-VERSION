import React, { useState } from 'react';
import { Mail, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { PasswordResetService } from '../services/PasswordResetService';
import { Page } from '../types';

interface ForgotPasswordPageProps {
  onNavigate: (page: Page) => void;
  onSelectTokenForReset?: (token: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigate,
  onSelectTokenForReset
}) => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setMessage(null);
    setDevResetUrl(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    if (!trimmed.includes('@') || !trimmed.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await PasswordResetService.requestPasswordReset(trimmed);
      if (!result.success && result.isRateLimited) {
        setErrorMessage(result.message);
      } else {
        setMessage(result.message);
        if (result.devResetUrl) {
          setDevResetUrl(result.devResetUrl);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while requesting password recovery.');
    } finally {
      setIsLoading(false);
    }
  };

  const extractTokenFromUrl = (url: string): string | null => {
    try {
      const parsed = new URL(url);
      return parsed.searchParams.get('token');
    } catch {
      const match = url.match(/token=([^&]+)/);
      return match ? match[1] : null;
    }
  };

  const handleOpenDevReset = () => {
    if (devResetUrl) {
      const token = extractTokenFromUrl(devResetUrl);
      if (token && onSelectTokenForReset) {
        onSelectTokenForReset(token);
      } else if (token) {
        window.location.href = devResetUrl;
      } else {
        onNavigate('reset-password');
      }
    } else {
      onNavigate('reset-password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header & Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Reset your SAILL password
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
          Enter the email address associated with your Administrator, Faculty, or Student account.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl sm:px-10 border border-slate-200/80">
          {message ? (
            <div className="space-y-6">
              <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 mr-3 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-900">
                      Request Submitted
                    </h3>
                    <p className="mt-1 text-sm text-emerald-800 leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>
              </div>

              {/* DEVELOPMENT MODE TESTING PANEL */}
              {devResetUrl && (
                <div className="rounded-xl bg-amber-50/90 border border-amber-300/80 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-md">
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      DEVELOPMENT MODE ONLY
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    A simulated password reset token was generated for testing in AI Studio:
                  </p>
                  <button
                    onClick={handleOpenDevReset}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors focus:outline-none"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Password Reset Form
                  </button>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Login
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="rounded-xl bg-rose-50 p-4 border border-rose-200 flex items-start">
                  <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 mr-3 shrink-0" />
                  <p className="text-sm text-rose-800 font-medium">{errorMessage}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@srit.ac.in"
                    className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
