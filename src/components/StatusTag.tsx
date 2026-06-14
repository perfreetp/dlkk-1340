import type {
  DeviceStatus,
  OrderStatus,
  AlarmStatus,
  AlarmLevel,
  UserStatus,
  PackageStatus,
  RefundStatus,
} from '@/types';
import { cn } from '@/lib/utils';

type StatusType =
  | DeviceStatus
  | OrderStatus
  | AlarmStatus
  | AlarmLevel
  | UserStatus
  | PackageStatus
  | RefundStatus;

type StatusCategory = 'device' | 'order' | 'alarm' | 'alarmLevel' | 'user' | 'package' | 'refund';

interface StatusTagProps {
  status: StatusType;
  category: StatusCategory;
  showDot?: boolean;
  className?: string;
}

const deviceStatusMap: Record<DeviceStatus, { label: string; className: string; dotClass: string }> = {
  online: { label: '在线', className: 'bg-success-50 text-success-700 border-success-200', dotClass: 'bg-success-500' },
  offline: { label: '离线', className: 'bg-neutral-100 text-neutral-600 border-neutral-200', dotClass: 'bg-neutral-400' },
  warning: { label: '告警', className: 'bg-warning-50 text-warning-700 border-warning-200', dotClass: 'bg-warning-500' },
};

const orderStatusMap: Record<OrderStatus, { label: string; className: string; dotClass: string }> = {
  success: { label: '成功', className: 'bg-success-50 text-success-700 border-success-200', dotClass: 'bg-success-500' },
  failed: { label: '失败', className: 'bg-danger-50 text-danger-700 border-danger-200', dotClass: 'bg-danger-500' },
  refunded: { label: '已退款', className: 'bg-neutral-100 text-neutral-600 border-neutral-200', dotClass: 'bg-neutral-400' },
};

const alarmStatusMap: Record<AlarmStatus, { label: string; className: string; dotClass: string }> = {
  pending: { label: '待处理', className: 'bg-danger-50 text-danger-700 border-danger-200', dotClass: 'bg-danger-500' },
  assigned: { label: '已派单', className: 'bg-warning-50 text-warning-700 border-warning-200', dotClass: 'bg-warning-500' },
  processing: { label: '处理中', className: 'bg-accent-50 text-accent-700 border-accent-200', dotClass: 'bg-accent-500' },
  resolved: { label: '已解决', className: 'bg-success-50 text-success-700 border-success-200', dotClass: 'bg-success-500' },
  closed: { label: '已关闭', className: 'bg-neutral-100 text-neutral-600 border-neutral-200', dotClass: 'bg-neutral-400' },
};

const alarmLevelMap: Record<AlarmLevel, { label: string; className: string; dotClass: string }> = {
  critical: { label: '严重', className: 'bg-danger-50 text-danger-700 border-danger-200', dotClass: 'bg-danger-500' },
  warning: { label: '警告', className: 'bg-warning-50 text-warning-700 border-warning-200', dotClass: 'bg-warning-500' },
  info: { label: '提示', className: 'bg-accent-50 text-accent-700 border-accent-200', dotClass: 'bg-accent-500' },
};

const userStatusMap: Record<UserStatus, { label: string; className: string; dotClass: string }> = {
  normal: { label: '正常', className: 'bg-success-50 text-success-700 border-success-200', dotClass: 'bg-success-500' },
  blocked: { label: '已封禁', className: 'bg-danger-50 text-danger-700 border-danger-200', dotClass: 'bg-danger-500' },
};

const packageStatusMap: Record<PackageStatus, { label: string; className: string; dotClass: string }> = {
  on: { label: '上架', className: 'bg-success-50 text-success-700 border-success-200', dotClass: 'bg-success-500' },
  off: { label: '下架', className: 'bg-neutral-100 text-neutral-600 border-neutral-200', dotClass: 'bg-neutral-400' },
};

const refundStatusMap: Record<RefundStatus, { label: string; className: string; dotClass: string }> = {
  pending: { label: '待审核', className: 'bg-warning-50 text-warning-700 border-warning-200', dotClass: 'bg-warning-500' },
  approved: { label: '已通过', className: 'bg-success-50 text-success-700 border-success-200', dotClass: 'bg-success-500' },
  rejected: { label: '已拒绝', className: 'bg-danger-50 text-danger-700 border-danger-200', dotClass: 'bg-danger-500' },
};

const statusMaps: Record<StatusCategory, Record<string, { label: string; className: string; dotClass: string }>> = {
  device: deviceStatusMap,
  order: orderStatusMap,
  alarm: alarmStatusMap,
  alarmLevel: alarmLevelMap,
  user: userStatusMap,
  package: packageStatusMap,
  refund: refundStatusMap,
};

export default function StatusTag({ status, category, showDot = true, className }: StatusTagProps) {
  const config = statusMaps[category][status] ?? {
    label: status,
    className: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    dotClass: 'bg-neutral-400',
  };

  return (
    <span
      className={cn(
        'tag border',
        config.className,
        className
      )}
    >
      {showDot && <span className={cn('status-dot', config.dotClass)} />}
      {config.label}
    </span>
  );
}
