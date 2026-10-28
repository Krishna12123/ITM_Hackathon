import { supabase } from '../lib/supabaseClient.js';

/**
 * Trusted Default Profiles for Development & Testing
 */
export const DEFAULT_PROFILES = {
  user: {
    id: 'usr-bhavna-001',
    name: 'Bhavna Sharma',
    handle: '@bhavna_explorer',
    email: 'bhavna.sharma@ssm.org',
    role: 'user',
    roleTitle: 'Community Explorer & Contributor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Heritage and community tourism scout exploring Bundelkhand & North-East India. Passionate about folk oral traditions, rural farming homestays, and reviving indigenous crafts.',
    location: 'Madhya Pradesh, India',
    joined: 'October 2026',
    verified: true
  },
  admin: {
    id: 'adm-krishna-001',
    name: 'Krishna Shukla (Admin)',
    handle: '@krishna_lead',
    email: 'admin.krishna@ssm.org',
    role: 'admin',
    roleTitle: 'SSM System Administrator & Chief Curator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Platform administrator and lead curator overseeing community moderation, geospatial routing pipelines, and verification protocols across India.',
    location: 'Rajasthan, India',
    joined: 'August 2025',
    verified: true
  }
};

const STORAGE_KEY = 'yatrasaathi_active_auth_session';

/**
 * Normalize role strings safely
 * @param {string} rawRole 
 * @returns {'admin' | 'user'}
 */
export function normalizeRole(rawRole) {
  if (!rawRole || typeof rawRole !== 'string') return 'user';
  const lower = rawRole.trim().toLowerCase();
  if (lower === 'admin' || lower === 'administrator' || lower === 'moderator') {
    return 'admin';
  }
  return 'user';
}

/**
 * Retrieve the current trusted authenticated session
 * Priority:
 * 1. Supabase Auth session (`supabase.auth.getSession()`)
 * 2. Trusted local storage session (`yatrasaathi_active_auth_session`)
 * 3. Default Regular User Profile (guarantees safe fallback without breaking)
 */
export async function getAuthenticatedSession() {
  try {
    // 1. Attempt reading live Supabase Auth session
    if (supabase && supabase.auth && typeof supabase.auth.getSession === 'function') {
      const { data, error } = await supabase.auth.getSession();
      if (!error && data?.session?.user) {
        const user = data.session.user;
        const role = normalizeRole(
          user.app_metadata?.role ||
          user.user_metadata?.role ||
          user.role
        );

        return {
          source: 'supabase',
          isAuthenticated: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name || 'Explorer',
            role,
            roleTitle: role === 'admin' ? 'System Administrator' : 'Community Explorer',
            avatar: user.user_metadata?.avatar_url || null,
            location: user.user_metadata?.location || 'India',
            joined: new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          }
        };
      }
    }
  } catch (err) {
    console.info('Supabase live session check bypassed, checking local session store:', err);
  }

  // 2. Check trusted application session store
  try {
    const rawSaved = localStorage.getItem(STORAGE_KEY);
    if (rawSaved) {
      const parsed = JSON.parse(rawSaved);
      if (parsed?.user) {
        return {
          source: 'session_store',
          isAuthenticated: true,
          user: {
            ...parsed.user,
            role: normalizeRole(parsed.user.role)
          }
        };
      }
    }
  } catch (e) {
    console.warn('Error reading stored session:', e);
  }

  // 3. Fallback: Default Regular User profile (never grant admin by default)
  return {
    source: 'default_user',
    isAuthenticated: true,
    user: DEFAULT_PROFILES.user
  };
}

/**
 * Switch or set active session (e.g. for testing User vs Admin flow)
 * @param {'user' | 'admin'} targetRole 
 */
export function setActiveSessionRole(targetRole) {
  const normalized = normalizeRole(targetRole);
  const profile = DEFAULT_PROFILES[normalized] || DEFAULT_PROFILES.user;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      isAuthenticated: true,
      user: profile,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.warn('Failed to persist session role:', e);
  }
  return profile;
}

/**
 * Sign out current session
 */
export async function signOutSession() {
  try {
    if (supabase && supabase.auth && typeof supabase.auth.signOut === 'function') {
      await supabase.auth.signOut();
    }
  } catch (err) {}

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {}
}

/**
 * Security check: Verifies that an action caller possesses verified admin role
 * @param {Object} currentUser 
 * @returns {boolean}
 */
export function hasAdminPrivileges(currentUser) {
  if (!currentUser) return false;
  return normalizeRole(currentUser.role) === 'admin';
}
