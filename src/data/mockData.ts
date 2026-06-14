import type {
  Device,
  Order,
  Package,
  Alarm,
  User,
  RefundRequest,
  OperationLog,
  Role,
  WaterTrendItem,
  DeviceUsageItem,
  DashboardStats,
  TimeDimension,
  BuildingWaterItem,
  RevenueCompareItem,
  PackageSaleItem,
  DeviceRankItem,
  FaultTypeItem,
  AlarmTrendItem,
  UserGrowthItem,
  RechargeDistributionItem,
  ActiveTimeHeatItem,
} from '@/types';

const buildings = ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼'];
const floors = ['1层', '2层', '3层', '4层', '5层', '6层', '7层', '8层', '9层', '10层'];
const locations = ['大厅入口', '电梯间旁', '地下车库', '走廊尽头', '健身区'];

export const mockDevices: Device[] = Array.from({ length: 32 }, (_, i) => {
  const statuses: Device['status'][] = ['online', 'online', 'online', 'online', 'online', 'offline', 'warning'];
  return {
    id: `dev-${i + 1}`,
    deviceNo: `WD${String(1001 + i).padStart(6, '0')}`,
    building: buildings[i % buildings.length],
    floor: floors[Math.floor(i / buildings.length) % floors.length],
    location: locations[i % locations.length],
    status: statuses[i % statuses.length],
    waterLevel: Math.floor(Math.random() * 100),
    tds: Math.floor(Math.random() * 200) + 20,
    ph: Number((Math.random() * 2 + 6).toFixed(1)),
    chlorine: Number((Math.random() * 0.5 + 0.1).toFixed(2)),
    temperature: Math.floor(Math.random() * 15) + 15,
    pricePerLiter: 0.5,
    totalWater: Math.floor(Math.random() * 50000) + 5000,
    lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    lng: 116.397 + (Math.random() - 0.5) * 0.05,
    lat: 39.907 + (Math.random() - 0.5) * 0.05,
  };
});

const userNames = ['张伟', '王芳', '李娜', '刘强', '陈静', '杨洋', '赵磊', '黄丽', '周杰', '吴敏',
  '徐涛', '孙艳', '胡斌', '朱红', '高翔', '林慧', '何军', '郭敏', '罗勇', '梁婷'];

export const mockUsers: User[] = userNames.map((name, i) => ({
  id: `user-${i + 1}`,
  userNo: `U${String(10001 + i).padStart(6, '0')}`,
  name,
  phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
  balance: Math.floor(Math.random() * 500) + 50,
  totalRecharge: Math.floor(Math.random() * 2000) + 500,
  totalConsume: Math.floor(Math.random() * 1500) + 100,
  status: i === 5 || i === 17 ? 'blocked' : 'normal',
  coupons: [
    {
      id: `cpn-${i}-1`,
      name: '新人优惠券',
      amount: 10,
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      used: false,
    },
  ],
  createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
}));

export const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => {
  const statuses: Order['status'][] = ['success', 'success', 'success', 'success', 'failed', 'refunded'];
  const payMethods: Order['payMethod'][] = ['balance', 'balance', 'wechat', 'alipay'];
  const user = mockUsers[i % mockUsers.length];
  const device = mockDevices[i % mockDevices.length];
  const waterAmount = Number((Math.random() * 10 + 1).toFixed(1));
  return {
    id: `ord-${i + 1}`,
    orderNo: `O${Date.now()}${String(i).padStart(4, '0')}`,
    userId: user.id,
    userName: user.name,
    deviceId: device.id,
    deviceNo: device.deviceNo,
    waterAmount,
    amount: Number((waterAmount * device.pricePerLiter).toFixed(2)),
    payMethod: payMethods[i % payMethods.length],
    status: statuses[i % statuses.length],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: Math.floor(Math.random() * 180) + 30,
  };
});

export const mockPackages: Package[] = [
  { id: 'pkg-1', name: '体验套餐', price: 10, bonus: 2, totalValue: 12, status: 'on', sort: 1, createdAt: '2025-01-01' },
  { id: 'pkg-2', name: '标准套餐', price: 50, bonus: 15, totalValue: 65, status: 'on', sort: 2, createdAt: '2025-01-01' },
  { id: 'pkg-3', name: '超值套餐', price: 100, bonus: 40, totalValue: 140, status: 'on', sort: 3, createdAt: '2025-01-01' },
  { id: 'pkg-4', name: '家庭套餐', price: 200, bonus: 100, totalValue: 300, status: 'on', sort: 4, createdAt: '2025-01-01' },
  { id: 'pkg-5', name: '年度套餐', price: 500, bonus: 300, totalValue: 800, status: 'off', sort: 5, createdAt: '2025-01-01' },
  { id: 'pkg-6', name: '企业套餐', price: 1000, bonus: 700, totalValue: 1700, status: 'off', sort: 6, createdAt: '2025-03-15' },
];

const alarmTypes: Alarm['type'][] = ['water_low', 'tds_high', 'device_offline', 'leak', 'other'];
const alarmLevels: Alarm['level'][] = ['critical', 'warning', 'info'];
const alarmStatuses: Alarm['status'][] = ['pending', 'assigned', 'processing', 'resolved', 'closed'];
const alarmDescriptions: Record<string, string> = {
  water_low: '剩余水量低于20%，请及时补充',
  tds_high: 'TDS值超过安全阈值，请检查滤芯',
  device_offline: '设备连接中断，请检查网络',
  leak: '检测到漏水异常，请立即检修',
  other: '设备出现未知异常',
};

export const mockAlarms: Alarm[] = Array.from({ length: 20 }, (_, i) => {
  const type = alarmTypes[i % alarmTypes.length];
  const device = mockDevices[i % mockDevices.length];
  const status = alarmStatuses[i % alarmStatuses.length];
  return {
    id: `alm-${i + 1}`,
    alarmNo: `ALM${String(20250001 + i)}`,
    deviceId: device.id,
    deviceNo: device.deviceNo,
    type,
    level: alarmLevels[i % alarmLevels.length],
    status,
    description: alarmDescriptions[type],
    assigneeId: status !== 'pending' ? 'staff-1' : undefined,
    assigneeName: status !== 'pending' ? '李维修' : undefined,
    createdAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: status === 'resolved' || status === 'closed' ? new Date().toISOString() : undefined,
    progress: status === 'pending' ? 0 : status === 'assigned' ? 20 : status === 'processing' ? 60 : 100,
    remark: status !== 'pending' ? '已派单，正在前往处理' : undefined,
  };
});

export const mockRefundRequests: RefundRequest[] = [
  { id: 'ref-1', refundNo: 'RF20250601001', userId: 'user-1', userName: '张伟', orderId: 'ord-1', amount: 25.5, reason: '设备故障未能正常取水', status: 'pending', createdAt: '2025-06-12T10:30:00Z' },
  { id: 'ref-2', refundNo: 'RF20250601002', userId: 'user-3', userName: '李娜', orderId: 'ord-5', amount: 12.0, reason: '多扣费用，申请退款', status: 'pending', createdAt: '2025-06-12T14:20:00Z' },
  { id: 'ref-3', refundNo: 'RF20250601003', userId: 'user-7', userName: '赵磊', orderId: 'ord-10', amount: 50.0, reason: '余额充错了', status: 'approved', createdAt: '2025-06-11T09:15:00Z' },
];

export const mockOperationLogs: OperationLog[] = Array.from({ length: 30 }, (_, i) => {
  const actions = [
    { module: '设备管理', action: '远程启动设备', detail: '启动设备 WD1001' },
    { module: '设备管理', action: '修改价格', detail: '将 WD1002 价格调整为 0.6元/L' },
    { module: '用户管理', action: '拉黑用户', detail: '拉黑用户 张伟 (U10005)' },
    { module: '套餐管理', action: '上架套餐', detail: '上架套餐 家庭套餐' },
    { module: '告警处理', action: '分派工单', detail: '将 ALM20250001 分派给 李维修' },
    { module: '系统设置', action: '修改参数', detail: '修改告警阈值配置' },
  ];
  const item = actions[i % actions.length];
  return {
    id: `log-${i + 1}`,
    userId: 'admin-1',
    userName: '系统管理员',
    action: item.action,
    module: item.module,
    detail: item.detail,
    ip: `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`,
    createdAt: new Date(Date.now() - i * 3600 * 1000).toISOString(),
  };
});

export const mockRoles: Role[] = [
  { id: 'role-1', name: '超级管理员', description: '拥有系统全部权限', permissions: ['all'] },
  { id: 'role-2', name: '物业管理员', description: '设备与用户管理权限', permissions: ['devices', 'orders', 'users', 'alarms'] },
  { id: 'role-3', name: '运营人员', description: '运营与数据分析权限', permissions: ['packages', 'users', 'reports', 'orders'] },
  { id: 'role-4', name: '维修人员', description: '告警工单处理权限', permissions: ['alarms'] },
];

export const mockWaterTrend: WaterTrendItem[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    volume: Math.floor(Math.random() * 500) + 300,
    revenue: Math.floor(Math.random() * 300) + 150,
  };
});

export const mockDeviceUsage: DeviceUsageItem[] = mockDevices.slice(0, 8).map((d) => ({
  deviceNo: d.deviceNo,
  usage: Math.floor(Math.random() * 100) + 20,
}));

export const mockDashboardStats: DashboardStats = {
  totalDevices: mockDevices.length,
  onlineDevices: mockDevices.filter(d => d.status === 'online').length,
  offlineDevices: mockDevices.filter(d => d.status === 'offline').length,
  warningDevices: mockDevices.filter(d => d.status === 'warning').length,
  todayOrders: 156,
  todayRevenue: 2847.5,
  pendingAlarms: mockAlarms.filter(a => a.status === 'pending' || a.status === 'assigned').length,
  totalUsers: mockUsers.length,
};

export const maintenanceStaff = [
  { id: 'staff-1', name: '李维修' },
  { id: 'staff-2', name: '王师傅' },
  { id: 'staff-3', name: '张工' },
  { id: 'staff-4', name: '陈技术员' },
];

const generateDateLabels = (dimension: TimeDimension): string[] => {
  const labels: string[] = [];
  if (dimension === 'day') {
    for (let i = 23; i >= 0; i--) {
      labels.push(`${String(23 - i).padStart(2, '0')}:00`);
    }
  } else if (dimension === 'week') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
  } else {
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (i % 3 === 0) {
        labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
      }
    }
  }
  return labels;
};

export const generateWaterTrendData = (dimension: TimeDimension): WaterTrendItem[] => {
  const labels = generateDateLabels(dimension);
  return labels.map((label) => ({
    date: label,
    volume: Math.floor(Math.random() * 800) + 200,
    revenue: Math.floor(Math.random() * 500) + 100,
  }));
};

export const generateBuildingWaterData = (): BuildingWaterItem[] => {
  return buildings.map((b) => ({
    building: b,
    volume: Math.floor(Math.random() * 5000) + 1000,
  }));
};

export const generateRevenueCompareData = (dimension: TimeDimension): RevenueCompareItem[] => {
  const labels = generateDateLabels(dimension);
  return labels.map((label) => ({
    date: label,
    recharge: Math.floor(Math.random() * 2000) + 500,
    consume: Math.floor(Math.random() * 1500) + 300,
  }));
};

export const generatePackageSaleData = (): PackageSaleItem[] => {
  return mockPackages
    .filter((p) => p.status === 'on')
    .map((p) => ({
      name: p.name,
      value: Math.floor(Math.random() * 200) + 20,
    }));
};

export const generateDeviceRankData = (): DeviceRankItem[] => {
  return mockDevices
    .slice(0, 10)
    .map((d) => ({
      deviceNo: d.deviceNo,
      building: d.building,
      usage: Math.floor(Math.random() * 60) + 40,
    }))
    .sort((a, b) => b.usage - a.usage);
};

export const generateFaultTypeData = (): FaultTypeItem[] => {
  return [
    { name: '水量不足', value: Math.floor(Math.random() * 30) + 15 },
    { name: 'TDS超标', value: Math.floor(Math.random() * 20) + 10 },
    { name: '设备离线', value: Math.floor(Math.random() * 25) + 8 },
    { name: '漏水检测', value: Math.floor(Math.random() * 10) + 3 },
    { name: '其他异常', value: Math.floor(Math.random() * 15) + 5 },
  ];
};

export const generateAlarmTrendData = (dimension: TimeDimension): AlarmTrendItem[] => {
  const labels = generateDateLabels(dimension);
  return labels.map((label) => ({
    date: label,
    count: Math.floor(Math.random() * 15) + 2,
  }));
};

export const generateUserGrowthData = (dimension: TimeDimension): UserGrowthItem[] => {
  const labels = generateDateLabels(dimension);
  let total = 800;
  return labels.map((label) => {
    const newUsers = Math.floor(Math.random() * 20) + 5;
    total += newUsers;
    return {
      date: label,
      total,
      newUsers,
    };
  });
};

export const generateRechargeDistributionData = (): RechargeDistributionItem[] => {
  return [
    { range: '0-50元', count: Math.floor(Math.random() * 100) + 80 },
    { range: '50-100元', count: Math.floor(Math.random() * 150) + 120 },
    { range: '100-200元', count: Math.floor(Math.random() * 200) + 150 },
    { range: '200-500元', count: Math.floor(Math.random() * 120) + 80 },
    { range: '500元以上', count: Math.floor(Math.random() * 60) + 30 },
  ];
};

export const generateActiveTimeHeatData = (): ActiveTimeHeatItem[] => {
  const hours = ['06', '08', '10', '12', '14', '16', '18', '20', '22'];
  return hours.map((h) => ({
    hour: `${h}:00`,
    weekday: Math.floor(Math.random() * 80) + 20,
    weekend: Math.floor(Math.random() * 100) + 30,
  }));
};

export interface ReportSummaryStats {
  totalWaterVolume: number;
  avgDailyWater: number;
  waterYoYGrowth: number;
  totalRevenue: number;
  rechargeRevenue: number;
  consumeRevenue: number;
  totalDevices: number;
  onlineRate: number;
  avgDeviceUsage: number;
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
}

export const generateReportSummaryStats = (): ReportSummaryStats => ({
  totalWaterVolume: 125680,
  avgDailyWater: 4189,
  waterYoYGrowth: 12.5,
  totalRevenue: 86420.5,
  rechargeRevenue: 52340,
  consumeRevenue: 34080.5,
  totalDevices: mockDevices.length,
  onlineRate: Number(((mockDevices.filter((d) => d.status === 'online').length / mockDevices.length) * 100).toFixed(1)),
  avgDeviceUsage: 68.5,
  totalUsers: mockUsers.length * 48,
  activeUsers: Math.floor(mockUsers.length * 48 * 0.65),
  newUsers: 126,
});
