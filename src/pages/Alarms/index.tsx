import { useState, useMemo } from 'react';
import {
  Search,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  X,
  User,
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  Edit3,
  XCircle,
  History,
  Cpu,
  MapPin,
  MessageSquare,
  CheckSquare,
} from 'lucide-react';
import { mockAlarms, mockDevices, maintenanceStaff } from '@/data/mockData';
import { formatDateTime, getStatusText } from '@/utils/format';
import StatusTag from '@/components/StatusTag';
import { cn } from '@/lib/utils';
import type { Alarm, AlarmLevel, AlarmType, AlarmStatus } from '@/types';

const alarmTypeStyleMap: Record<AlarmType, { label: string; className: string }> = {
  water_low: { label: '水量不足', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  tds_high: { label: 'TDS超标', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  device_offline: { label: '设备离线', className: 'bg-neutral-100 text-neutral-700 border-neutral-300' },
  leak: { label: '漏水检测', className: 'bg-danger-50 text-danger-700 border-danger-200' },
  other: { label: '其他', className: 'bg-accent-50 text-accent-700 border-accent-200' },
};

const alarmLevelColorMap: Record<AlarmLevel, string> = {
  critical: 'bg-danger-500',
  warning: 'bg-warning-500',
  info: 'bg-accent-500',
};

const progressColorMap = (progress: number) => {
  if (progress >= 80) return 'bg-success-500';
  if (progress >= 40) return 'bg-accent-500';
  return 'bg-warning-500';
};

function AlarmTypeTag({ type }: { type: AlarmType }) {
  const config = alarmTypeStyleMap[type];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
}

function StatCard({ title, value, icon, iconBg, iconColor, valueColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-5 hover:shadow-cardHover transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-500 mb-2">{title}</p>
          <p className={cn('text-2xl font-bold', valueColor || 'text-neutral-900')}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

interface AssignModalProps {
  alarm: Alarm;
  onClose: () => void;
  onConfirm: (alarmId: string, staffId: string, staffName: string, remark: string) => void;
}

function AssignModal({ alarm, onClose, onConfirm }: AssignModalProps) {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [remark, setRemark] = useState('');

  const handleConfirm = () => {
    if (!selectedStaff) return;
    const staff = maintenanceStaff.find((s) => s.id === selectedStaff);
    if (staff) {
      onConfirm(alarm.id, staff.id, staff.name, remark);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-cardHover w-full max-w-md overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Send className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">分派工单</h3>
              <p className="text-xs text-neutral-500">{alarm.alarmNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">选择维修人员</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white appearance-none cursor-pointer"
              >
                <option value="">请选择维修人员</option>
                {maintenanceStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">备注说明</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="请输入分派备注说明..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedStaff}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            确认分派
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProgressModalProps {
  alarm: Alarm;
  onClose: () => void;
  onConfirm: (alarmId: string, progress: number, note: string, completed: boolean) => void;
}

function ProgressModal({ alarm, onClose, onConfirm }: ProgressModalProps) {
  const [progress, setProgress] = useState(alarm.progress);
  const [note, setNote] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleConfirm = () => {
    onConfirm(alarm.id, completed ? 100 : progress, note, completed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-cardHover w-full max-w-md overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">登记处理进度</h3>
              <p className="text-xs text-neutral-500">{alarm.alarmNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-neutral-700">处理进度</label>
              <span className="text-sm font-bold text-primary-600">{completed ? 100 : progress}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={completed ? 100 : progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              disabled={completed}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600 disabled:opacity-60"
            />
            <div className="flex justify-between mt-1 text-xs text-neutral-400">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">处理说明</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="请输入处理说明..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors resize-none"
            />
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-lg bg-success-50 border border-success-200 cursor-pointer hover:bg-success-100/60 transition-colors">
            <CheckSquare
              className={cn(
                'w-5 h-5 transition-colors',
                completed ? 'text-success-600' : 'text-neutral-400'
              )}
            />
            <div>
              <span className={cn('text-sm font-medium', completed ? 'text-success-700' : 'text-neutral-700')}>
                标记为已完成
              </span>
              <p className="text-xs text-neutral-500 mt-0.5">勾选后进度将自动设为 100%，工单状态变更为已解决</p>
            </div>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="sr-only"
            />
          </label>
        </div>

        <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors shadow-soft flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            确认登记
          </button>
        </div>
      </div>
    </div>
  );
}

interface DetailDrawerProps {
  alarm: Alarm;
  onClose: () => void;
}

function DetailDrawer({ alarm, onClose }: DetailDrawerProps) {
  const device = mockDevices.find((d) => d.id === alarm.deviceId);

  const handleHistory = () => [
    { time: alarm.createdAt, action: '告警产生', operator: '系统', detail: alarm.description },
    ...(alarm.assigneeName
      ? [{ time: alarm.createdAt, action: '工单分派', operator: '系统管理员', detail: `分派给 ${alarm.assigneeName}` }]
      : []),
    ...(alarm.progress > 0
      ? [{ time: alarm.createdAt, action: '进度更新', operator: alarm.assigneeName || '维修人员', detail: `处理进度更新至 ${alarm.progress}%` }]
      : []),
    ...(alarm.status === 'resolved' || alarm.status === 'closed'
      ? [{ time: alarm.resolvedAt || alarm.createdAt, action: '工单解决', operator: alarm.assigneeName || '维修人员', detail: '告警已处理完成' }]
      : []),
  ];

  const history = handleHistory();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto animate-slide-right">
        <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">告警详情</h2>
            <p className="text-sm text-neutral-500 mt-0.5">{alarm.alarmNo}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div
            className={cn(
              'rounded-xl p-5 text-white',
              alarm.level === 'critical'
                ? 'bg-gradient-to-br from-danger-500 to-danger-600'
                : alarm.level === 'warning'
                ? 'bg-gradient-to-br from-warning-500 to-warning-600'
                : 'bg-gradient-to-br from-accent-500 to-accent-600'
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/70">告警编号</p>
                <p className="text-xl font-bold mt-1">{alarm.alarmNo}</p>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <StatusTag status={alarm.level} category="alarmLevel" />
                <StatusTag status={alarm.status} category="alarm" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{alarm.description}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-primary-600" />
              告警信息
            </h3>
            <div className="bg-neutral-50 rounded-xl divide-y divide-neutral-200">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-neutral-500">告警编号</span>
                <span className="text-sm font-medium text-neutral-900 font-mono">{alarm.alarmNo}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-neutral-500">告警级别</span>
                <StatusTag status={alarm.level} category="alarmLevel" />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-neutral-500">告警类型</span>
                <AlarmTypeTag type={alarm.type} />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-neutral-500">工单状态</span>
                <StatusTag status={alarm.status} category="alarm" />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-neutral-500">告警描述</span>
                <span className="text-sm font-medium text-neutral-900">{alarm.description}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-neutral-500">处理进度</span>
                <div className="flex items-center gap-2 w-40">
                  <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', progressColorMap(alarm.progress))}
                      style={{ width: `${alarm.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-700 w-10 text-right">{alarm.progress}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-neutral-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  创建时间
                </span>
                <span className="text-sm font-medium text-neutral-900">{formatDateTime(alarm.createdAt)}</span>
              </div>
              {alarm.resolvedAt && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-neutral-500 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    解决时间
                  </span>
                  <span className="text-sm font-medium text-neutral-900">{formatDateTime(alarm.resolvedAt)}</span>
                </div>
              )}
              {alarm.remark && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-neutral-500 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    备注说明
                  </span>
                  <span className="text-sm font-medium text-neutral-900">{alarm.remark}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-primary-600" />
              处理人员
            </h3>
            <div className="bg-neutral-50 rounded-xl p-4">
              {alarm.assigneeName ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                    {alarm.assigneeName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{alarm.assigneeName}</p>
                    <p className="text-xs text-neutral-500">维修人员</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <User className="w-4 h-4" />
                  暂未分派
                </div>
              )}
            </div>
          </div>

          {device && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary-600" />
                关联设备
              </h3>
              <div className="bg-neutral-50 rounded-xl divide-y divide-neutral-200">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-neutral-500">设备编号</span>
                  <span className="text-sm font-medium text-neutral-900 font-mono">{device.deviceNo}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-neutral-500">设备状态</span>
                  <StatusTag status={device.status} category="device" />
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-neutral-500 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    所在位置
                  </span>
                  <span className="text-sm font-medium text-neutral-900">
                    {device.building} {device.floor} {device.location}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-primary-600" />
              处理历史
            </h3>
            <div className="bg-neutral-50 rounded-xl p-4">
              <div className="relative">
                <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-neutral-200" />
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <div key={index} className="relative pl-8">
                      <div
                        className={cn(
                          'absolute left-1.5 top-1 w-3 h-3 rounded-full border-2 border-white',
                          index === 0 ? 'bg-danger-500' : index === history.length - 1 ? 'bg-success-500' : 'bg-primary-500'
                        )}
                      />
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-neutral-900">{item.action}</span>
                          <span className="text-xs text-neutral-400">{formatDateTime(item.time)}</span>
                        </div>
                        <p className="text-xs text-neutral-500">操作人：{item.operator}</p>
                        <p className="text-sm text-neutral-700 mt-1">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Alarms() {
  const [searchText, setSearchText] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | AlarmLevel>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | AlarmType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AlarmStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  const [alarms, setAlarms] = useState<Alarm[]>(mockAlarms);
  const [assigningAlarm, setAssigningAlarm] = useState<Alarm | null>(null);
  const [progressAlarm, setProgressAlarm] = useState<Alarm | null>(null);
  const [detailAlarm, setDetailAlarm] = useState<Alarm | null>(null);

  const filteredAlarms = useMemo(() => {
    return alarms.filter((alarm) => {
      if (searchText) {
        const lowerSearch = searchText.toLowerCase();
        const matchAlarmNo = alarm.alarmNo.toLowerCase().includes(lowerSearch);
        const matchDeviceNo = alarm.deviceNo.toLowerCase().includes(lowerSearch);
        if (!matchAlarmNo && !matchDeviceNo) return false;
      }
      if (levelFilter !== 'all' && alarm.level !== levelFilter) return false;
      if (typeFilter !== 'all' && alarm.type !== typeFilter) return false;
      if (statusFilter !== 'all' && alarm.status !== statusFilter) return false;
      return true;
    });
  }, [alarms, searchText, levelFilter, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredAlarms.length / pageSize);
  const paginatedAlarms = filteredAlarms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = useMemo(() => {
    const pending = alarms.filter((a) => a.status === 'pending').length;
    const processing = alarms.filter((a) => a.status === 'assigned' || a.status === 'processing').length;
    const resolved = alarms.filter((a) => a.status === 'resolved' || a.status === 'closed').length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNew = alarms.filter((a) => new Date(a.createdAt) >= today).length;
    return { pending, processing, resolved, todayNew };
  }, [alarms]);

  const handleAssign = (alarmId: string, staffId: string, staffName: string, remark: string) => {
    setAlarms((prev) =>
      prev.map((a) =>
        a.id === alarmId
          ? { ...a, status: 'assigned' as AlarmStatus, assigneeId: staffId, assigneeName: staffName, remark, progress: 20 }
          : a
      )
    );
    setAssigningAlarm(null);
  };

  const handleProgress = (alarmId: string, progress: number, note: string, completed: boolean) => {
    setAlarms((prev) =>
      prev.map((a) =>
        a.id === alarmId
          ? {
              ...a,
              progress,
              status: completed ? ('resolved' as AlarmStatus) : progress >= 80 ? ('processing' as AlarmStatus) : a.status,
              resolvedAt: completed ? new Date().toISOString() : a.resolvedAt,
              remark: note || a.remark,
            }
          : a
      )
    );
    setProgressAlarm(null);
  };

  const handleClose = (alarmId: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === alarmId ? { ...a, status: 'closed' as AlarmStatus } : a))
    );
  };

  const handleReset = () => {
    setSearchText('');
    setLevelFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">告警工单</h1>
          <p className="text-sm text-neutral-500 mt-1">管理和处理所有设备告警工单</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="待处理告警"
          value={stats.pending}
          icon={<AlertCircle className="w-6 h-6" />}
          iconBg="bg-danger-50"
          iconColor="text-danger-600"
          valueColor="text-danger-600"
        />
        <StatCard
          title="处理中告警"
          value={stats.processing}
          icon={<Clock className="w-6 h-6" />}
          iconBg="bg-warning-50"
          iconColor="text-warning-600"
          valueColor="text-warning-600"
        />
        <StatCard
          title="已解决告警"
          value={stats.resolved}
          icon={<CheckCircle className="w-6 h-6" />}
          iconBg="bg-success-50"
          iconColor="text-success-600"
          valueColor="text-success-600"
        />
        <StatCard
          title="今日新增"
          value={stats.todayNew}
          icon={<Plus className="w-6 h-6" />}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          valueColor="text-primary-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">搜索告警</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="告警编号 / 设备编号"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">告警级别</label>
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value as 'all' | AlarmLevel);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white"
            >
              <option value="all">全部</option>
              <option value="critical">严重</option>
              <option value="warning">警告</option>
              <option value="info">提示</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">告警类型</label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as 'all' | AlarmType);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white"
            >
              <option value="all">全部</option>
              <option value="water_low">水量不足</option>
              <option value="tds_high">TDS超标</option>
              <option value="device_offline">设备离线</option>
              <option value="leak">漏水检测</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">工单状态</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | AlarmStatus);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white"
            >
              <option value="all">全部</option>
              <option value="pending">待处理</option>
              <option value="assigned">已分派</option>
              <option value="processing">处理中</option>
              <option value="resolved">已解决</option>
              <option value="closed">已关闭</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div className="text-sm text-neutral-500">
            共 <span className="font-semibold text-neutral-700">{filteredAlarms.length}</span> 条记录
          </div>
          <button
            onClick={handleReset}
            className="h-9 px-4 rounded-lg border border-neutral-200 text-sm text-neutral-600 font-medium hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            重置筛选
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {paginatedAlarms.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-card p-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <AlertTriangle className="w-12 h-12 text-neutral-300" />
              <p className="text-sm text-neutral-500">暂无告警工单数据</p>
            </div>
          </div>
        ) : (
          paginatedAlarms.map((alarm) => (
            <div
              key={alarm.id}
              className="relative bg-white rounded-xl shadow-card hover:shadow-cardHover transition-all duration-300 overflow-hidden"
            >
              <div className={cn('absolute left-0 top-0 bottom-0 w-1', alarmLevelColorMap[alarm.level])} />

              <div className="p-5 pl-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-semibold text-neutral-900">{alarm.alarmNo}</span>
                    <StatusTag status={alarm.level} category="alarmLevel" />
                    <AlarmTypeTag type={alarm.type} />
                    <StatusTag status={alarm.status} category="alarm" />
                  </div>
                  <button
                    onClick={() => setDetailAlarm(alarm)}
                    className="p-1.5 rounded-md text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    title="查看详情"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <Cpu className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-sm text-neutral-500">设备：</span>
                  <span className="text-sm font-medium text-neutral-900 font-mono">{alarm.deviceNo}</span>
                </div>

                <p className="text-sm text-neutral-700 mb-4 line-clamp-2">{alarm.description}</p>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="text-xs text-neutral-500">
                        {alarm.assigneeName ? `处理人：${alarm.assigneeName}` : '暂未分派'}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-neutral-600">{alarm.progress}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', progressColorMap(alarm.progress))}
                      style={{ width: `${alarm.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDateTime(alarm.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {alarm.status === 'pending' && (
                      <button
                        onClick={() => setAssigningAlarm(alarm)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center gap-1 shadow-soft"
                      >
                        <Send className="w-3.5 h-3.5" />
                        分派
                      </button>
                    )}
                    {(alarm.status === 'assigned' || alarm.status === 'processing') && (
                      <button
                        onClick={() => setProgressAlarm(alarm)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-600 text-white hover:bg-accent-700 transition-colors flex items-center gap-1 shadow-soft"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        登记进度
                      </button>
                    )}
                    {(alarm.status === 'resolved' || alarm.status === 'processing' || alarm.status === 'assigned') && (
                      <button
                        onClick={() => setDetailAlarm(alarm)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        详情
                      </button>
                    )}
                    {(alarm.status === 'resolved') && (
                      <button
                        onClick={() => handleClose(alarm.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        关闭工单
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 0 && (
        <div className="bg-white rounded-xl shadow-card px-5 py-4 flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            第 <span className="font-medium text-neutral-700">{currentPage}</span> / {totalPages} 页
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors',
                    currentPage === pageNum
                      ? 'bg-primary-600 text-white shadow-soft'
                      : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {assigningAlarm && (
        <AssignModal alarm={assigningAlarm} onClose={() => setAssigningAlarm(null)} onConfirm={handleAssign} />
      )}

      {progressAlarm && (
        <ProgressModal alarm={progressAlarm} onClose={() => setProgressAlarm(null)} onConfirm={handleProgress} />
      )}

      {detailAlarm && <DetailDrawer alarm={detailAlarm} onClose={() => setDetailAlarm(null)} />}
    </div>
  );
}
