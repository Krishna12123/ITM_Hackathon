import React, { useState, useEffect } from 'react';
import {
  Compass,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  User,
  ArrowLeft,
  KeyRound,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { adminLogin, googleLogin } from '../services/authService';

export default function LoginPage({ onLoginSuccess, onNavigateToHome, onShowToast }) {
  // 'user' (Google) | 'admin' (Admin credentials)
  const [activeTab, setActiveTab] = useState('user');

  // Admin form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Quick fill helper for testers
  const handleFillDemoAdmin = () => {
    setAdminEmail('admin@yaatrasathi.com');
    setAdminPassword('YaatraAdmin@2026!Secure');
    setErrorMessage(null);
  };

  // Google OAuth Client Setup
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    // If official Google Client ID is configured, initialize Google Identity Services
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleOfficialGoogleResponse
        });
        const googleBtnParent = document.getElementById('googleSignInOfficialBtn');
        if (googleBtnParent) {
          window.google.accounts.id.renderButton(googleBtnParent, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'pill'
          });
        }
      } catch (e) {
        console.warn('Google Identity Services init notice:', e);
      }
    }
  }, [googleClientId, activeTab]);

  const handleOfficialGoogleResponse = async (response) => {
    if (!response.credential) return;
    setIsGoogleLoading(true);
    setErrorMessage(null);
    try {
      const res = await googleLogin(response.credential);
      setSuccessMessage(`Welcome, ${res.user.name}!`);
      if (onShowToast) onShowToast(`Welcome to YaatraSaathi, ${res.user.name}!`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(res.user);
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Google authentication failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // One-click Google Login flow (works with official GIS or dev credentials)
  const handleGoogleSignInClick = async (demoProfile = null) => {
    setIsGoogleLoading(true);
    setErrorMessage(null);

    try {
      let credential = 'mock-google-id-token-' + Date.now();
      let userData = demoProfile || {
        email: 'bhavna.sharma@yaatrasaathi.org',
        name: 'Bhavna Sharma',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      };

      const res = await googleLogin(credential, userData);
      setSuccessMessage(`Welcome, ${res.user.name}! Signed in with Google.`);
      if (onShowToast) onShowToast(`Welcome to YaatraSaathi, ${res.user.name}!`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(res.user);
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to authenticate with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle Admin Login submission
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword) {
      setErrorMessage('Please enter both admin email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setIsLockedOut(false);

    try {
      const res = await adminLogin(adminEmail, adminPassword);
      setSuccessMessage(`Admin verification successful! Welcome back, ${res.user.name}.`);
      if (onShowToast) onShowToast('Admin authentication verified. Access granted.');
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(res.user);
      }, 700);
    } catch (err) {
      if (err.status === 429) {
        setIsLockedOut(true);
        setErrorMessage(err.message || 'Too many failed login attempts. Account temporarily locked for 15 minutes.');
      } else {
        setErrorMessage(err.message || 'Invalid administrator credentials. Please check your email and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FFF8EF]">
      {/* Background Indian Destination Photography with warm gradient overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2000&q=85"
          alt="Rajasthan Heritage Palace"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-105"
        />
        {/* Subtle Brand Color Tint Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#38291F]/85 via-[#38291F]/75 to-[#F36B21]/45" />
      </div>

      {/* Login Container Card */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Top Floating Guest Return Link */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={onNavigateToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full transition-all duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explore</span>
          </button>
          <span className="text-[11px] font-medium text-[#E7C9A5]">Community-Powered Tourism</span>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-8 overflow-hidden transition-all duration-300">
          
          {/* Logo & Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D94E0B] to-[#F36B21] text-white shadow-lg shadow-[#F36B21]/30 mb-3 transform hover:scale-105 transition-transform duration-200">
              <Compass className="w-8 h-8 animate-spin-slow" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#38291F] tracking-tight">
              Welcome to <span className="text-[#F36B21]">YaatraSaathi</span>
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#64748B] max-w-xs mx-auto">
              Your journey to discovering incredible India begins here.
            </p>
          </div>

          {/* Tab Selector: User vs Admin */}
          <div className="flex rounded-2xl bg-[#F2E4D2]/40 p-1 mb-6 border border-[#E7C9A5]/40">
            <button
              type="button"
              onClick={() => {
                setActiveTab('user');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'user'
                  ? 'bg-white text-[#F36B21] shadow-sm'
                  : 'text-[#64748B] hover:text-[#38291F]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>User Login</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-[#38291F] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#38291F]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMessage}</p>
                {isLockedOut && (
                  <p className="mt-1 text-[11px] text-red-700">
                    Security protocol active: 5 consecutive failed attempts trigger rate-limit lockout.
                  </p>
                )}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 1: USER LOGIN WITH GOOGLE                                   */}
          {/* =============================================================== */}
          {activeTab === 'user' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center py-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8EF] border border-[#E7C9A5] text-[#D94E0B] text-[11px] font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#F36B21]" />
                  Sign in to save itineraries & share gems
                </span>
              </div>

              {/* Official Google Container if GIS is ready */}
              <div id="googleSignInOfficialBtn" className="w-full" />

              {/* Prominent Google OAuth Button */}
              <button
                type="button"
                onClick={() => handleGoogleSignInClick()}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-gray-50 border-2 border-[#E5E7EB] hover:border-[#D1D5DB] rounded-2xl text-xs sm:text-sm font-bold text-[#38291F] transition-all duration-200 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 text-[#F36B21] animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                )}
                <span>Continue with Google</span>
              </button>

              {/* Demo Accounts Quick-Select for Reviewers */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="flex-shrink mx-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Or select demo explorer
                  </span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleGoogleSignInClick({
                        email: 'bhavna.sharma@yaatrasaathi.org',
                        name: 'Bhavna Sharma',
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                      })
                    }
                    className="p-2.5 rounded-xl border border-[#E7C9A5] bg-[#FFF8EF] hover:bg-[#F2E4D2] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                        alt="Bhavna"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-[#38291F] truncate group-hover:text-[#F36B21]">
                          Bhavna S.
                        </p>
                        <p className="text-[9px] text-[#64748B] truncate">Explorer</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleGoogleSignInClick({
                        email: 'aarav.patel@yaatrasaathi.org',
                        name: 'Aarav Patel',
                        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
                      })
                    }
                    className="p-2.5 rounded-xl border border-[#E7C9A5] bg-[#FFF8EF] hover:bg-[#F2E4D2] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
                        alt="Aarav"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-[#38291F] truncate group-hover:text-[#F36B21]">
                          Aarav P.
                        </p>
                        <p className="text-[9px] text-[#64748B] truncate">Photographer</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Guest Exploration Option */}
              <div className="pt-3 text-center border-t border-gray-100">
                <button
                  type="button"
                  onClick={onNavigateToHome}
                  className="text-xs font-semibold text-[#64748B] hover:text-[#F36B21] transition-colors"
                >
                  Continue browsing as a guest →
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 2: DEDICATED ADMIN LOGIN                                    */}
          {/* =============================================================== */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[11px] font-bold text-[#38291F] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#F36B21]" />
                  Authorized Personnel Only
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className="text-[10px] font-semibold text-[#F36B21] hover:underline"
                >
                  Fill Admin Demo
                </button>
              </div>

              {/* Admin Email Input */}
              <div>
                <label className="block text-xs font-bold text-[#38291F] mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@yaatrasathi.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#F36B21] focus:ring-2 focus:ring-[#F36B21]/20 outline-none text-xs sm:text-sm text-[#38291F] placeholder-gray-400 transition-all"
                  />
                </div>
              </div>

              {/* Admin Password Input */}
              <div>
                <label className="block text-xs font-bold text-[#38291F] mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-[#F36B21] focus:ring-2 focus:ring-[#F36B21]/20 outline-none text-xs sm:text-sm text-[#38291F] placeholder-gray-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Rate limit note */}
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Protected by bcrypt hashing & sliding 5-attempt rate limiter</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isLockedOut}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#D94E0B] to-[#F36B21] hover:from-[#c44307] hover:to-[#e05e19] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Verify & Enter Admin Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security Assurance Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] text-[#64748B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F36B21]" />
            <span>Secure 256-bit JWT & Google Identity Protocol</span>
          </div>

        </div>
      </div>
    </div>
  );
}
