import { create } from 'zustand';
import type { AuthUser, UserRole } from '@/types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
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

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

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
}));
