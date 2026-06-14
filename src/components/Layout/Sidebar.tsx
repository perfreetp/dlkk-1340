import {
  LayoutDashboard,
  Cpu,
  Receipt,
  CreditCard,
  AlertTriangle,
  Users,
  BarChart3,
  Settings,
  Droplets,
} from 'lucide-react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  permission: string;
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: '首页看板', icon: LayoutDashboard, permission: 'dashboard' },
  { key: 'devices', label: '设备管理', icon: Cpu, permission: 'devices' },
  { key: 'orders', label: '订单流水', icon: Receipt, permission: 'orders' },
  { key: 'packages', label: '充值套餐', icon: CreditCard, permission: 'packages' },
  { key: 'alarms', label: '告警工单', icon: AlertTriangle, permission: 'alarms' },
  { key: 'users', label: '用户账户', icon: Users, permission: 'users' },
  { key: 'reports', label: '统计报表', icon: BarChart3, permission: 'reports' },
  { key: 'settings', label: '系统设置', icon: Settings, permission: 'settings' },
];

export default function Sidebar() {
  const { sidebarCollapsed, currentPage, setCurrentPage } = useGlobalStore();
  const { hasPermission } = useAuthStore();

  const visibleItems = menuItems.filter((item) => hasPermission(item.permission));

  return (
    <aside
      className={cn(
        'flex flex-col bg-primary-800 h-screen transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div
        className={cn(
          'flex items-center h-16 px-4 border-b border-primary-700 flex-shrink-0',
          sidebarCollapsed ? 'justify-center' : 'gap-3'
        )}
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center flex-shrink-0">
          <Droplets className="text-white" size={22} />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col">
            <span className="text-white font-semibold text-base leading-tight">直饮水管理</span>
            <span className="text-primary-300 text-xs">智能运营平台</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={cn(
                'nav-item w-full',
                sidebarCollapsed ? 'justify-center px-0' : '',
                isActive
                  ? 'nav-item-active'
                  : 'text-primary-200 hover:bg-primary-700/50 hover:text-white'
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!sidebarCollapsed && (
        <div className="px-4 py-4 border-t border-primary-700">
          <div className="text-xs text-primary-400">版本 v1.0.0</div>
        </div>
      )}
    </aside>
  );
}
