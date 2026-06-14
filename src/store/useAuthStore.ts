import { create } from 'zustand';
import type { AuthUser, UserRole } from '@/types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  getRolePermissions: () => string[];
  getFirstAllowedPage: () => string;
}

const mockUsers: Record<string, { password: string; role: UserRole; name: string }> = {
  admin: { password: '123456', role: 'admin', name: '系统管理员' },
  property: { password: '123456', role: 'property', name: '物业管理员' },
  operator: { password: '123456', role: 'operator', name: '运营人员' },
  maintenance: { password: '123456', role: 'maintenance', name: '维修人员' },
};

const rolePermissions: Record<UserRole, string[]> = {
  admin: ['all'],
  property: ['dashboard', 'devices', 'orders', 'alarms', 'users', 'reports'],
  operator: ['dashboard', 'packages', 'users', 'orders', 'reports'],
  maintenance: ['dashboard', 'alarms', 'devices'],
};

const pageOrder = ['dashboard', 'devices', 'orders', 'packages', 'alarms', 'users', 'reports', 'settings'];

function getStoredUser(): { user: AuthUser | null; isAuthenticated: boolean } {
  try {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      const parsed = JSON.parse(stored) as AuthUser;
      if (parsed.id && parsed.role) {
        return { user: parsed, isAuthenticated: true };
      }
    }
  } catch {}
  return { user: null, isAuthenticated: false };
}

const initial = getStoredUser();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initial.user,
  isAuthenticated: initial.isAuthenticated,

  login: (username, password) => {
    const userInfo = mockUsers[username];
    if (userInfo && userInfo.password === password) {
      const user: AuthUser = {
        id: `user-${username}`,
        username,
        name: userInfo.name,
        role: userInfo.role,
      };
      set({ user, isAuthenticated: true });
      localStorage.setItem('auth_user', JSON.stringify(user));
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('auth_user');
  },

  hasPermission: (permission) => {
    const state = get();
    if (!state.user) return false;
    const perms = rolePermissions[state.user.role];
    return perms.includes('all') || perms.includes(permission);
  },

  getRolePermissions: () => {
    const state = get();
    if (!state.user) return [];
    const perms = rolePermissions[state.user.role];
    if (perms.includes('all')) return pageOrder;
    return perms;
  },

  getFirstAllowedPage: () => {
    const perms = get().getRolePermissions();
    return perms[0] || 'dashboard';
  },
}));
