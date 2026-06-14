export type DeviceStatus = 'online' | 'offline' | 'warning';
export type OrderStatus = 'success' | 'failed' | 'refunded';
export type PayMethod = 'balance' | 'wechat' | 'alipay';
export type PackageStatus = 'on' | 'off';
export type AlarmLevel = 'critical' | 'warning' | 'info';
export type AlarmType = 'water_low' | 'tds_high' | 'device_offline' | 'leak' | 'other';
export type AlarmStatus = 'pending' | 'assigned' | 'processing' | 'resolved' | 'closed';
export type UserStatus = 'normal' | 'blocked';
export type RefundStatus = 'pending' | 'approved' | 'rejected';
export type UserRole = 'admin' | 'property' | 'operator' | 'maintenance';

export interface Device {
  id: string;
  deviceNo: string;
  building: string;
  floor: string;
  location: string;
  status: DeviceStatus;
  waterLevel: number;
  tds: number;
  ph: number;
  chlorine: number;
  temperature: number;
  pricePerLiter: number;
  totalWater: number;
  lastMaintenance: string;
  lng: number;
  lat: number;
}

export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  userName: string;
  deviceId: string;
  deviceNo: string;
  waterAmount: number;
  amount: number;
  payMethod: PayMethod;
  status: OrderStatus;
  createdAt: string;
  duration: number;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  bonus: number;
  totalValue: number;
  status: PackageStatus;
  sort: number;
  createdAt: string;
}

export interface Coupon {
  id: string;
  name: string;
  amount: number;
  validFrom: string;
  validTo: string;
  used: boolean;
}

export interface Alarm {
  id: string;
  alarmNo: string;
  deviceId: string;
  deviceNo: string;
  type: AlarmType;
  level: AlarmLevel;
  status: AlarmStatus;
  description: string;
  assigneeId?: string;
  assigneeName?: string;
  createdAt: string;
  resolvedAt?: string;
  progress: number;
  remark?: string;
}

export interface User {
  id: string;
  userNo: string;
  name: string;
  phone: string;
  balance: number;
  totalRecharge: number;
  totalConsume: number;
  status: UserStatus;
  coupons: Coupon[];
  createdAt: string;
}

export interface RefundRequest {
  id: string;
  refundNo: string;
  userId: string;
  userName: string;
  orderId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
}

export interface OperationLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  detail: string;
  ip: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  warningDevices: number;
  todayOrders: number;
  todayRevenue: number;
  pendingAlarms: number;
  totalUsers: number;
}

export interface WaterTrendItem {
  date: string;
  volume: number;
  revenue: number;
}

export interface DeviceUsageItem {
  deviceNo: string;
  usage: number;
}

export type TimeDimension = 'day' | 'week' | 'month';
export type ReportTab = 'water' | 'revenue' | 'device' | 'user';

export interface BuildingWaterItem {
  building: string;
  volume: number;
}

export interface RevenueCompareItem {
  date: string;
  recharge: number;
  consume: number;
}

export interface PackageSaleItem {
  name: string;
  value: number;
}

export interface DeviceRankItem {
  deviceNo: string;
  building: string;
  usage: number;
}

export interface FaultTypeItem {
  name: string;
  value: number;
}

export interface AlarmTrendItem {
  date: string;
  count: number;
}

export interface UserGrowthItem {
  date: string;
  total: number;
  newUsers: number;
}

export interface RechargeDistributionItem {
  range: string;
  count: number;
}

export interface ActiveTimeHeatItem {
  hour: string;
  weekday: number;
  weekend: number;
}
