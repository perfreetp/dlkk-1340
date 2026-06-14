import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  ChevronRight,
  Bell,
  User,
  LogOut,
  UserCircle,
  ChevronDown,
} from 'lucide-react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

const pageTitleMap: Record<string, string> = {
  dashboard: '首页看板',
  devices: '设备管理',
  orders: '订单流水',
  packages: '充值套餐',
  alarms: '告警工单',
  users: '用户账户',
  reports: '统计报表',
  settings: '系统设置',
};

const roleLabelMap: Record<string, string> = {
  admin: '系统管理员',
  property: '物业管理员',
  operator: '运营人员',
  maintenance: '维修人员',
};

export default function Topbar() {
  const { sidebarCollapsed, toggleSidebar, currentPage } = useGlobalStore();
  const { user, logout } = useAuthStore();
  const [unreadCount] = useState(5);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTitle = pageTitleMap[currentPage] || '首页看板';

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors"
          aria-label={sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}
        >
          <Menu size={20} />
        </button>

        <nav className="hidden sm:flex items-center text-sm">
          <span className="text-neutral-500">首页</span>
          <ChevronRight size={14} className="mx-1.5 text-neutral-400" />
          <span className="text-primary-600 font-medium">{currentTitle}</span>
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          className="relative p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors"
          aria-label="通知"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-neutral-800 leading-tight">
                {user?.name || '未登录'}
              </span>
              <span className="text-xs text-neutral-500 leading-tight">
                {user?.role ? roleLabelMap[user.role] : ''}
              </span>
            </div>
            <ChevronDown size={14} className={cn('text-neutral-500 transition-transform', userMenuOpen && 'rotate-180')} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-cardHover border border-neutral-100 py-1 z-50 animate-fade-in">
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <UserCircle size={16} className="text-neutral-500" />
                个人中心
              </button>
              <div className="h-px bg-neutral-100 my-1" />
              <button
                onClick={() => {
                  logout();
                  setUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
              >
                <LogOut size={16} />
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
