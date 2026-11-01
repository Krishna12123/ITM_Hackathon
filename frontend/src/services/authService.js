import { supabase } from '../lib/supabaseClient.js';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api/auth`
  : '/api/auth';

export const TOKEN_STORAGE_KEY = 'yaatrasaathi_jwt_token';
export const USER_STORAGE_KEY = 'yaatrasaathi_active_user';
const LEGACY_STORAGE_KEY = 'yatrasaathi_active_auth_session';

/**
 * Standard Demo Profiles for Testing & Exploration
 */
export const DEFAULT_PROFILES = {
  user: {
    id: 'usr-bhavna-001',
    name: 'Bhavna Sharma',
    handle: '@bhavna_explorer',
    email: 'bhavna.sharma@yaatrasaathi.org',
    role: 'USER',
    roleTitle: 'Community Explorer & Contributor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Heritage and community tourism scout exploring Bundelkhand & North-East India. Passionate about folk oral traditions, rural farming homestays, and reviving indigenous crafts.',
    location: 'Madhya Pradesh, India',
    joined: 'October 2026',
    verified: true
  },
  admin: {
    id: 'adm-yaatra-001',
    name: 'YaatraSaathi Administrator',
    handle: '@admin_yaatra',
    email: 'admin@yaatrasathi.com',
    role: 'ADMIN',
    roleTitle: 'Lead System Administrator & Chief Curator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Platform administrator and lead curator overseeing community moderation, geospatial routing pipelines, and verification protocols across India.',
    location: 'Jaipur, Rajasthan, India',
    joined: 'August 2025',
    verified: true
  }
};

/**
 * Normalize role strings safely
 * @param {string} rawRole 
 * @returns {'ADMIN' | 'USER'}
 */
export function normalizeRole(rawRole) {
  if (!rawRole || typeof rawRole !== 'string') return 'USER';
  const upper = rawRole.trim().toUpperCase();
  if (upper === 'ADMIN' || upper === 'ADMINISTRATOR' || upper === 'MODERATOR') {
    return 'ADMIN';
  }
  return 'USER';
}

/**
 * Security check: Verifies if user has ADMIN role
 * @param {Object} currentUser 
 * @returns {boolean}
 */
export function hasAdminPrivileges(currentUser) {
  if (!currentUser) return false;
  return normalizeRole(currentUser.role) === 'ADMIN';
}

/**
 * Get stored JWT auth token
 * @returns {string|null}
 */
export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  } catch (e) {
    return null;
  }
}

/**
 * Get current active user from local storage
 * @returns {Object|null}
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      return {
        ...user,
        role: normalizeRole(user.role)
      };
    }
  } catch (e) {
    console.warn('Failed to parse current user from localStorage:', e);
  }
  return null;
}

/**
 * Retrieve current authenticated session
 * Returns { isAuthenticated: boolean, user: Object|null, token: string|null }
 */
export async function getAuthenticatedSession() {
  const token = getAuthToken();
  const cachedUser = getCurrentUser();

  if (token && cachedUser) {
    return {
      isAuthenticated: true,
      user: cachedUser,
      token,
      source: 'jwt_session'
    };
  }

  // Check Supabase if configured
  try {
    if (supabase && supabase.auth && typeof supabase.auth.getSession === 'function') {
      const { data, error } = await supabase.auth.getSession();
      if (!error && data?.session?.user) {
        const u = data.session.user;
        const role = normalizeRole(u.app_metadata?.role || u.user_metadata?.role || u.role);
        const profile = {
          id: u.id,
          email: u.email,
          name: u.user_metadata?.full_name || u.user_metadata?.name || 'Explorer',
          role,
          roleTitle: role === 'ADMIN' ? 'System Administrator' : 'Community Explorer',
          avatar: u.user_metadata?.avatar_url || null,
          location: u.user_metadata?.location || 'India',
          joined: new Date(u.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
        return {
          isAuthenticated: true,
          user: profile,
          token: data.session.access_token || null,
          source: 'supabase'
        };
      }
    }
  } catch (err) {
    // Supabase optional
  }

  // Not authenticated: visitor/guest state
  return {
    isAuthenticated: false,
    user: null,
    token: null,
    source: 'visitor'
  };
}

/**
 * Admin Login: Authenticates via Backend with Email & Password
 * @param {string} email 
 * @param {string} password 
 */
export async function adminLogin(email, password) {
  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password })
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data.detail || (res.status === 429
        ? 'Too many failed login attempts. Account temporarily locked.'
        : 'Invalid admin credentials');
      const err = new Error(errorMsg);
      err.status = res.status;
      throw err;
    }

    // Persist JWT and active user
    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

    // Dispatch broadcast event for navbar and listeners
    window.dispatchEvent(new CustomEvent('yaatrasaathi_auth_change', {
      detail: { user: data.user, isAuthenticated: true }
    }));

    return {
      success: true,
      user: data.user,
      token: data.access_token
    };
  } catch (err) {
    console.error('Admin login error:', err);
    throw err;
  }
}

/**
 * User Login with Google OAuth 2.0
 * @param {string} credential Google ID Token or testing token
 * @param {Object} [userData] Optional profile information
 */
export async function googleLogin(credential, userData = null) {
  try {
    const res = await fetch(`${API_BASE}/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, user_data: userData })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || 'Google authentication failed');
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

    window.dispatchEvent(new CustomEvent('yaatrasaathi_auth_change', {
      detail: { user: data.user, isAuthenticated: true }
    }));

    return {
      success: true,
      user: data.user,
      token: data.access_token
    };
  } catch (err) {
    console.error('Google login error:', err);
    throw err;
  }
}

/**
 * Sign out current session
 */
export async function signOutSession() {
  const token = getAuthToken();

  try {
    if (token) {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    }
  } catch (e) {
    // Network fail on logout is safe to ignore
  }

  try {
    if (supabase && supabase.auth && typeof supabase.auth.signOut === 'function') {
      await supabase.auth.signOut();
    }
  } catch (e) {}

  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);

  window.dispatchEvent(new CustomEvent('yaatrasaathi_auth_change', {
    detail: { user: null, isAuthenticated: false }
  }));

  return { success: true };
}

/**
 * Admin Moderation API: Fetch submissions queue (Protected by require_admin)
 */
export async function fetchModerationQueue() {
  const token = getAuthToken();
  if (!token) throw new Error('Authentication required');

  const res = await fetch(`${API_BASE}/admin/moderation-queue`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to fetch moderation queue');
  }

  return await res.json();
}

/**
 * Admin Moderation API: Take action on a submission
 * @param {string} submissionId 
 * @param {'approve'|'reject'|'request-changes'} action 
 * @param {string} reason 
 */
export async function executeModerationDecision(submissionId, action, reason = '') {
  const token = getAuthToken();
  if (!token) throw new Error('Authentication required');

  const res = await fetch(`${API_BASE}/admin/moderation/${submissionId}/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ action, reason })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to execute moderation action');
  }

  return await res.json();
}

/**
 * Developer helper: Switch active session for testing
 * @param {'USER'|'ADMIN'|'user'|'admin'} targetRole 
 */
export function setActiveSessionRole(targetRole) {
  const normalized = normalizeRole(targetRole);
  const profile = normalized === 'ADMIN' ? DEFAULT_PROFILES.admin : DEFAULT_PROFILES.user;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    // Simulated token for test helper
    localStorage.setItem(TOKEN_STORAGE_KEY, `mock-token-${profile.role.toLowerCase()}`);
    window.dispatchEvent(new CustomEvent('yaatrasaathi_auth_change', {
      detail: { user: profile, isAuthenticated: true }
    }));
  } catch (e) {
    console.warn('Failed to switch role:', e);
  }
  return profile;
}
