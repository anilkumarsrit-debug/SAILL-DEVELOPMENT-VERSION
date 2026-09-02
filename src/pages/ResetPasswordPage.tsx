import React, { useState, useEffect } from 'react';
import { KeyRound, Eye, EyeOff, CheckCircle2, XCircle, AlertCircle, ArrowLeft, ShieldCheck, Check } from 'lucide-react';
import { PasswordResetService, PasswordStrengthResult } from '../services/PasswordResetService';
import { Page } from '../types';

interface ResetPasswordPageProps {
  token?: string | null;
  onNavigate: (page: Page) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  token: initialToken,
  onNavigate
}) => {
  const [token, setToken] = useState<string | null>(initialToken || null);
  const [isValidatingToken, setIsValidatingToken] = useState<boolean>(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{ email?: string; role?: string; userName?: string } | null>(null);

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Extract token from URL search query if not passed via props
  useEffect(() => {
    let activeToken = initialToken;
    if (!activeToken) {
      const searchParams = new URLSearchParams(window.location.search);
      activeToken = searchParams.get('token');
    }
    setToken(activeToken);

    if (activeToken) {
      validateToken(activeToken);
    } else {
      setIsValidatingToken(false);
      setTokenError('No password reset token provided. Please request a new password reset.');
    }
  }, [initialToken]);

  const validateToken = async (rawToken: string) => {
    setIsValidatingToken(true);
    setTokenError(null);

    try {
      const result = await PasswordResetService.validateResetToken(rawToken);
      if (result.valid) {
        setUserInfo({
          email: result.email,
          role: result.role,
          userName: result.userName
        });
      } else {
        setTokenError(result.error || 'This password reset link is invalid or has expired.');
      }
    } catch (err: any) {
      setTokenError(err.message || 'Failed to validate password reset token.');
    } finally {
      setIsValidatingToken(false);
    }
  };

  const strength: PasswordStrengthResult = PasswordResetService.validatePasswordStrength(newPassword);
  const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!token) {
      setSubmitError('Missing reset token.');
      return;
    }

    if (!strength.isValid) {
      setSubmitError('Please ensure your password meets all security criteria.');
      return;
    }

    if (!passwordsMatch) {
      setSubmitError('New password and confirmation password do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await PasswordResetService.resetPasswordWithToken(token, newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred while resetting password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthBarColor = () => {
    if (newPassword.length === 0) return 'bg-slate-200';
    if (strength.score === 'strong') return 'bg-emerald-500';
    if (strength.score === 'medium') return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header & Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
          <KeyRound className="w-9 h-9" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create a new password
        </h2>
        {userInfo?.userName && (
          <p className="mt-2 text-sm text-slate-600">
            Account: <span className="font-semibold text-slate-900">{userInfo.userName}</span>{' '}
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-mono uppercase ml-1">
              {userInfo.role}
            </span>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl sm:px-10 border border-slate-200/80">
          {isValidatingToken ? (
            <div className="py-12 text-center space-y-4">
              <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm font-medium text-slate-600">Validating password reset link...</p>
            </div>
          ) : tokenError ? (
            <div className="space-y-6">
              <div className="rounded-xl bg-rose-50 p-4 border border-rose-200">
                <div className="flex items-start">
                  <XCircle className="w-5 h-5 text-rose-600 mt-0.5 mr-3 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-rose-900">Link Invalid or Expired</h3>
                    <p className="mt-1 text-sm text-rose-800 leading-relaxed">{tokenError}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
                >
                  Request New Password Reset
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="w-full flex items-center justify-center py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Login
                </button>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="space-y-6">
              <div className="rounded-xl bg-emerald-50 p-5 border border-emerald-200 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-900">Password Reset Successful</h3>
                <p className="mt-2 text-sm text-emerald-800 leading-relaxed">
                  Your password has been updated successfully. You can now log in with your new credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
              >
                Proceed to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="rounded-xl bg-rose-50 p-4 border border-rose-200 flex items-start">
                  <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 mr-3 shrink-0" />
                  <p className="text-sm text-rose-800 font-medium">{submitError}</p>
                </div>
              )}

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  New Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new secure password"
                    className="block w-full pr-10 pl-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Strength Meter Bar */}
                {newPassword.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Password Strength:</span>
                      <span className="font-semibold capitalize text-slate-700">{strength.score}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthBarColor()}`}
                        style={{
                          width:
                            strength.score === 'strong'
                              ? '100%'
                              : strength.score === 'medium'
                              ? '60%'
                              : newPassword.length > 0
                              ? '30%'
                              : '0%'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="block w-full pr-10 pl-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {confirmPassword.length > 0 && (
                  <p
                    className={`mt-1.5 text-xs font-medium flex items-center ${
                      passwordsMatch ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1" /> Passwords match
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Passwords do not match
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Password Policy Criteria Checklist */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Password Requirements
                </p>
                <ul className="space-y-1.5 text-xs">
                  <li className={`flex items-center ${strength.checks.length ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                    {strength.checks.length ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 border border-slate-300 rounded-full mr-2 shrink-0 inline-block" />
                    )}
                    At least 8 characters long
                  </li>
                  <li className={`flex items-center ${strength.checks.uppercase ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                    {strength.checks.uppercase ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 border border-slate-300 rounded-full mr-2 shrink-0 inline-block" />
                    )}
                    At least one uppercase letter (A–Z)
                  </li>
                  <li className={`flex items-center ${strength.checks.lowercase ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                    {strength.checks.lowercase ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 border border-slate-300 rounded-full mr-2 shrink-0 inline-block" />
                    )}
                    At least one lowercase letter (a–z)
                  </li>
                  <li className={`flex items-center ${strength.checks.number ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                    {strength.checks.number ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 border border-slate-300 rounded-full mr-2 shrink-0 inline-block" />
                    )}
                    At least one number (0–9)
                  </li>
                  <li className={`flex items-center ${strength.checks.special ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                    {strength.checks.special ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 border border-slate-300 rounded-full mr-2 shrink-0 inline-block" />
                    )}
                    At least one special character (!@#$%^&*)
                  </li>
                </ul>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !strength.isValid || !passwordsMatch}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Password...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Cancel & Return to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
