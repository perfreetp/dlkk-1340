import { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Edit2,
  Trash2,
  Settings as SettingsIcon,
  Shield,
  FileText,
  DollarSign,
  AlertTriangle,
  Cpu,
  Save,
  Calendar,
  User,
  Clock,
  Home,
  ShoppingBag,
  BarChart3,
  CheckSquare,
  Square,
  Gauge,
  Droplets,
  Thermometer,
  RefreshCw,
} from 'lucide-react';
import { mockRoles, mockOperationLogs } from '@/data/mockData';
import { formatDateTime } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

type TabKey = 'basic' | 'roles' | 'logs';

interface BasicConfig {
  pricePerLiter: string;
  tdsMax: string;
  phMin: string;
  phMax: string;
  chlorineMax: string;
  lowWaterThreshold: string;
  offlineTimeout: string;
  autoRestartInterval: string;
}

const initialBasicConfig: BasicConfig = {
  pricePerLiter: '0.5',
  tdsMax: '300',
  phMin: '6.5',
  phMax: '8.5',
  chlorineMax: '0.5',
  lowWaterThreshold: '20',
  offlineTimeout: '30',
  autoRestartInterval: '1440',
};

interface PermissionModule {
  key: string;
  label: string;
  icon: React.ReactNode;
  permissions: { key: string; label: string }[];
}

const permissionModules: PermissionModule[] = [
  {
    key: 'dashboard',
    label: '首页看板',
    icon: <Home className="w-4 h-4" />,
    permissions: [
      { key: 'dashboard:view', label: '查看' },
    ],
  },
  {
    key: 'devices',
    label: '设备管理',
    icon: <Cpu className="w-4 h-4" />,
    permissions: [
      { key: 'devices:view', label: '查看' },
      { key: 'devices:edit', label: '编辑' },
      { key: 'devices:delete', label: '删除' },
    ],
  },
  {
    key: 'orders',
    label: '订单流水',
    icon: <ShoppingBag className="w-4 h-4" />,
    permissions: [
      { key: 'orders:view', label: '查看' },
      { key: 'orders:edit', label: '编辑' },
      { key: 'orders:delete', label: '删除' },
    ],
  },
  {
    key: 'packages',
    label: '充值套餐',
    icon: <DollarSign className="w-4 h-4" />,
    permissions: [
      { key: 'packages:view', label: '查看' },
      { key: 'packages:edit', label: '编辑' },
      { key: 'packages:delete', label: '删除' },
    ],
  },
  {
    key: 'alarms',
    label: '告警工单',
    icon: <AlertTriangle className="w-4 h-4" />,
    permissions: [
      { key: 'alarms:view', label: '查看' },
      { key: 'alarms:edit', label: '编辑' },
      { key: 'alarms:delete', label: '删除' },
    ],
  },
  {
    key: 'users',
    label: '用户账户',
    icon: <User className="w-4 h-4" />,
    permissions: [
      { key: 'users:view', label: '查看' },
      { key: 'users:edit', label: '编辑' },
      { key: 'users:delete', label: '删除' },
    ],
  },
  {
    key: 'reports',
    label: '统计报表',
    icon: <BarChart3 className="w-4 h-4" />,
    permissions: [
      { key: 'reports:view', label: '查看' },
      { key: 'reports:edit', label: '编辑' },
    ],
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: <SettingsIcon className="w-4 h-4" />,
    permissions: [
      { key: 'settings:view', label: '查看' },
      { key: 'settings:edit', label: '编辑' },
    ],
  },
];

interface RoleModalProps {
  role?: Role;
  onClose: () => void;
  onSave: (role: Role) => void;
}

function RoleModal({ role, onClose, onSave }: RoleModalProps) {
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissions?.includes('all')
      ? permissionModules.flatMap((m) => m.permissions.map((p) => p.key))
      : role?.permissions || []
  );

  const handleTogglePermission = (permKey: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permKey)
        ? prev.filter((p) => p !== permKey)
        : [...prev, permKey]
    );
  };

  const handleToggleModule = (moduleKey: string) => {
    const module = permissionModules.find((m) => m.key === moduleKey);
    if (!module) return;
    const modulePerms = module.permissions.map((p) => p.key);
    const allSelected = modulePerms.every((p) => selectedPermissions.includes(p));
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((p) => !modulePerms.includes(p)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...modulePerms])));
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('请输入角色名称');
      return;
    }
    const newRole: Role = {
      id: role?.id || `role-${Date.now()}`,
      name,
      description,
      permissions: selectedPermissions,
    };
    onSave(newRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-cardHover w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                {role ? '编辑角色' : '新增角色'}
              </h3>
              <p className="text-xs text-neutral-500">配置角色信息与权限</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">角色名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入角色名称"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">角色描述</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请输入角色描述"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label-field">权限配置</label>
            <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
                {permissionModules.map((module) => {
                  const modulePerms = module.permissions.map((p) => p.key);
                  const allSelected = modulePerms.every((p) => selectedPermissions.includes(p));
                  const someSelected = modulePerms.some((p) => selectedPermissions.includes(p));
                  return (
                    <div key={module.key} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-primary-600">{module.icon}</span>
                          <span className="text-sm font-semibold text-neutral-900">{module.label}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleModule(module.key)}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                            allSelected
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-neutral-500 hover:bg-neutral-100'
                          )}
                        >
                          {allSelected ? (
                            <CheckSquare className="w-3.5 h-3.5" />
                          ) : someSelected ? (
                            <Square className="w-3.5 h-3.5 text-neutral-300" />
                          ) : (
                            <Square className="w-3.5 h-3.5" />
                          )}
                          {allSelected ? '已全选' : '全选'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {module.permissions.map((perm) => {
                          const isSelected = selectedPermissions.includes(perm.key);
                          return (
                            <button
                              key={perm.key}
                              type="button"
                              onClick={() => handleTogglePermission(perm.key)}
                              className={cn(
                                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                                isSelected
                                  ? 'bg-primary-50 text-primary-700 border-primary-200'
                                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300 hover:text-primary-600'
                              )}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-3.5 h-3.5" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-neutral-300" />
                              )}
                              {perm.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors shadow-soft flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabKey>('basic');

  const [basicConfig, setBasicConfig] = useState<BasicConfig>(initialBasicConfig);

  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);

  const [logSearch, setLogSearch] = useState('');
  const [logModule, setLogModule] = useState<string>('all');
  const [logStartDate, setLogStartDate] = useState('');
  const [logEndDate, setLogEndDate] = useState('');
  const [logPage, setLogPage] = useState(1);
  const [logPageSize] = useState(10);

  const logModules = useMemo(() => {
    const modules = new Set(mockOperationLogs.map((l) => l.module));
    return Array.from(modules);
  }, []);

  const filteredLogs = useMemo(() => {
    return mockOperationLogs.filter((log) => {
      if (logSearch) {
        const lowerSearch = logSearch.toLowerCase();
        const matchUser = log.userName.toLowerCase().includes(lowerSearch);
        const matchDetail = log.detail.toLowerCase().includes(lowerSearch);
        const matchAction = log.action.toLowerCase().includes(lowerSearch);
        if (!matchUser && !matchDetail && !matchAction) return false;
      }
      if (logModule !== 'all' && log.module !== logModule) return false;
      if (logStartDate) {
        if (new Date(log.createdAt) < new Date(logStartDate)) return false;
      }
      if (logEndDate) {
        const endDate = new Date(logEndDate);
        endDate.setHours(23, 59, 59, 999);
        if (new Date(log.createdAt) > endDate) return false;
      }
      return true;
    });
  }, [logSearch, logModule, logStartDate, logEndDate]);

  const totalLogPages = Math.ceil(filteredLogs.length / logPageSize);
  const paginatedLogs = filteredLogs.slice(
    (logPage - 1) * logPageSize,
    logPage * logPageSize
  );

  const handleSaveBasicConfig = () => {
    alert('基础配置已保存');
  };

  const handleSaveRole = (role: Role) => {
    if (editingRole) {
      setRoles((prev) => prev.map((r) => (r.id === role.id ? role : r)));
    } else {
      setRoles((prev) => [...prev, role]);
    }
    setRoleModalOpen(false);
    setEditingRole(undefined);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleModalOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    if (confirm('确定要删除该角色吗？')) {
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
    }
  };

  const getPermissionCount = (permissions: string[]) => {
    if (permissions.includes('all')) {
      return permissionModules.reduce((sum, m) => sum + m.permissions.length, 0);
    }
    return permissions.length;
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'basic', label: '基础配置', icon: <SettingsIcon className="w-4 h-4" /> },
    { key: 'roles', label: '角色管理', icon: <Shield className="w-4 h-4" /> },
    { key: 'logs', label: '操作日志', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">系统设置</h1>
          <p className="text-sm text-neutral-500 mt-1">管理系统基础配置、角色权限与操作日志</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="flex items-center border-b border-neutral-100 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-600 rounded-t" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'basic' && (
          <div className="p-6 space-y-6">
            <div className="bg-neutral-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">价格参数</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="label-field">默认出水单价 (元/升)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">¥</span>
                    <input
                      type="number"
                      value={basicConfig.pricePerLiter}
                      onChange={(e) => setBasicConfig({ ...basicConfig, pricePerLiter: e.target.value })}
                      step="0.01"
                      min="0"
                      className="input-field pl-7"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-warning-600" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">告警阈值</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="label-field flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-neutral-400" />
                    TDS 上限 (mg/L)
                  </label>
                  <input
                    type="number"
                    value={basicConfig.tdsMax}
                    onChange={(e) => setBasicConfig({ ...basicConfig, tdsMax: e.target.value })}
                    min="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-neutral-400" />
                    PH 最小值
                  </label>
                  <input
                    type="number"
                    value={basicConfig.phMin}
                    onChange={(e) => setBasicConfig({ ...basicConfig, phMin: e.target.value })}
                    step="0.1"
                    min="0"
                    max="14"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-neutral-400" />
                    PH 最大值
                  </label>
                  <input
                    type="number"
                    value={basicConfig.phMax}
                    onChange={(e) => setBasicConfig({ ...basicConfig, phMax: e.target.value })}
                    step="0.1"
                    min="0"
                    max="14"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-neutral-400" />
                    余氯上限 (mg/L)
                  </label>
                  <input
                    type="number"
                    value={basicConfig.chlorineMax}
                    onChange={(e) => setBasicConfig({ ...basicConfig, chlorineMax: e.target.value })}
                    step="0.01"
                    min="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">低水量阈值 (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={basicConfig.lowWaterThreshold}
                      onChange={(e) => setBasicConfig({ ...basicConfig, lowWaterThreshold: e.target.value })}
                      min="0"
                      max="100"
                      className="input-field pr-7"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-accent-600" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">设备参数</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="label-field flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    离线判定时长 (分钟)
                  </label>
                  <input
                    type="number"
                    value={basicConfig.offlineTimeout}
                    onChange={(e) => setBasicConfig({ ...basicConfig, offlineTimeout: e.target.value })}
                    min="1"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                    自动重启间隔 (分钟)
                  </label>
                  <input
                    type="number"
                    value={basicConfig.autoRestartInterval}
                    onChange={(e) => setBasicConfig({ ...basicConfig, autoRestartInterval: e.target.value })}
                    min="0"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveBasicConfig}
                className="px-6 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors shadow-soft flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存设置
              </button>
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div>
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">角色列表</h3>
                <p className="text-xs text-neutral-500 mt-0.5">共 {roles.length} 个角色</p>
              </div>
              <button
                onClick={() => {
                  setEditingRole(undefined);
                  setRoleModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors shadow-soft flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                新增角色
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">角色名称</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">描述</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">权限数量</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Shield className="w-12 h-12 text-neutral-300" />
                          <p className="text-sm text-neutral-500">暂无角色数据</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    roles.map((role, index) => (
                      <tr
                        key={role.id}
                        className={cn(
                          index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50',
                          'hover:bg-primary-50/50 transition-colors cursor-default'
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                              <Shield className="w-4 h-4 text-primary-600" />
                            </div>
                            <span className="text-sm font-medium text-neutral-900">{role.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-600">{role.description}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700 border border-accent-200">
                            {getPermissionCount(role.permissions)} 项
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEditRole(role)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                              title="编辑权限"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              编辑权限
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-danger-600 hover:bg-danger-50 transition-colors"
                              title="删除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <div className="p-5 border-b border-neutral-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs text-neutral-500 mb-1.5">搜索</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="搜索操作人 / 操作内容 / 操作动作"
                      value={logSearch}
                      onChange={(e) => {
                        setLogSearch(e.target.value);
                        setLogPage(1);
                      }}
                      className="w-full h-9 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">所属模块</label>
                  <select
                    value={logModule}
                    onChange={(e) => {
                      setLogModule(e.target.value);
                      setLogPage(1);
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white"
                  >
                    <option value="all">全部模块</option>
                    {logModules.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">开始日期</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                      <input
                        type="date"
                        value={logStartDate}
                        onChange={(e) => {
                          setLogStartDate(e.target.value);
                          setLogPage(1);
                        }}
                        className="w-full h-9 pl-9 pr-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">结束日期</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                      <input
                        type="date"
                        value={logEndDate}
                        onChange={(e) => {
                          setLogEndDate(e.target.value);
                          setLogPage(1);
                        }}
                        className="w-full h-9 pl-9 pr-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">时间</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">操作人</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">所属模块</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">操作动作</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">详细内容</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">IP 地址</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-12 h-12 text-neutral-300" />
                          <p className="text-sm text-neutral-500">暂无日志数据</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log, index) => (
                      <tr
                        key={log.id}
                        className={cn(
                          index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50',
                          'hover:bg-primary-50/50 transition-colors cursor-default'
                        )}
                      >
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-sm text-neutral-500">
                            <Clock className="w-3.5 h-3.5 text-neutral-400" />
                            {formatDateTime(log.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary-700">
                                {log.userName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-neutral-900">{log.userName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                            {log.module}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-700 font-medium">{log.action}</td>
                        <td className="px-4 py-3 text-sm text-neutral-600 max-w-[250px] truncate" title={log.detail}>
                          {log.detail}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-neutral-500">{log.ip}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalLogPages > 0 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-100">
                <div className="text-sm text-neutral-500">
                  共 <span className="font-semibold text-neutral-700">{filteredLogs.length}</span> 条记录，
                  第 <span className="font-medium text-neutral-700">{logPage}</span> / {totalLogPages} 页
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                    disabled={logPage === 1}
                    className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(5, totalLogPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalLogPages <= 5) {
                      pageNum = i + 1;
                    } else if (logPage <= 3) {
                      pageNum = i + 1;
                    } else if (logPage >= totalLogPages - 2) {
                      pageNum = totalLogPages - 4 + i;
                    } else {
                      pageNum = logPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setLogPage(pageNum)}
                        className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors',
                          logPage === pageNum
                            ? 'bg-primary-600 text-white shadow-soft'
                            : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setLogPage((p) => Math.min(totalLogPages, p + 1))}
                    disabled={logPage === totalLogPages}
                    className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {roleModalOpen && (
        <RoleModal
          role={editingRole}
          onClose={() => {
            setRoleModalOpen(false);
            setEditingRole(undefined);
          }}
          onSave={handleSaveRole}
        />
      )}
    </div>
  );
}
