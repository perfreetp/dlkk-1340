import {
  Monitor,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  MapPin,
  ArrowRight,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  mockDashboardStats,
  mockWaterTrend,
  mockDevices,
  mockDeviceUsage,
  mockAlarms,
} from '@/data/mockData';
import { formatMoney, formatDateTime, getStatusText } from '@/utils/format';
import type { DeviceStatus, AlarmLevel } from '@/types';

interface TrendBadgeProps {
  value: number;
  label?: string;
}

const TrendBadge = ({ value, label = '较昨日' }: TrendBadgeProps) => {
  const isPositive = value >= 0;
  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-neutral-500">{label}</span>
      {isPositive ? (
        <TrendingUp className="w-3.5 h-3.5 text-success-600" />
      ) : (
        <TrendingDown className="w-3.5 h-3.5 text-danger-500" />
      )}
      <span className={isPositive ? 'text-success-600 font-medium' : 'text-danger-500 font-medium'}>
        {isPositive ? '+' : ''}{value}%
      </span>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend: number;
  extra?: React.ReactNode;
}

const StatCard = ({ title, value, icon, iconBg, iconColor, trend, extra }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-5 hover:shadow-cardHover transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-500 mb-2">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mb-2">{value}</p>
          {extra}
          <TrendBadge value={trend} />
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

const statusColorMap: Record<DeviceStatus, string> = {
  online: 'bg-success-500',
  offline: 'bg-neutral-400',
  warning: 'bg-danger-500',
};

const alarmLevelConfig: Record<AlarmLevel, { bg: string; text: string; label: string }> = {
  critical: { bg: 'bg-danger-100', text: 'text-danger-600', label: '严重' },
  warning: { bg: 'bg-warning-100', text: 'text-warning-600', label: '警告' },
  info: { bg: 'bg-accent-100', text: 'text-accent-600', label: '提示' },
};

export default function Dashboard() {
  const stats = mockDashboardStats;
  const onlineRate = stats.totalDevices > 0
    ? ((stats.onlineDevices / stats.totalDevices) * 100).toFixed(1)
    : '0';

  const latestAlarms = mockAlarms.slice(0, 5);

  const deviceMapPoints = mockDevices.slice(0, 16).map((device, index) => {
    const cols = 4;
    const rows = 4;
    const col = index % cols;
    const row = Math.floor(index / cols);
    return {
      ...device,
      x: 12 + col * 22 + (Math.random() * 8 - 4),
      y: 15 + row * 20 + (Math.random() * 6 - 3),
    };
  });

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">数据看板</h1>
          <p className="text-sm text-neutral-500 mt-1">实时监控平台运营数据</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Clock className="w-4 h-4" />
          <span>更新于 {formatDateTime(new Date().toISOString())}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="设备总数"
          value={stats.totalDevices}
          icon={<Monitor className="w-6 h-6" />}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          trend={3.2}
          extra={
            <div className="flex gap-3 mb-3">
              <span className="inline-flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-success-500" />
                <span className="text-neutral-600">在线 {stats.onlineDevices}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                <span className="text-neutral-600">离线 {stats.offlineDevices}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-danger-500" />
                <span className="text-neutral-600">告警 {stats.warningDevices}</span>
              </span>
            </div>
          }
        />

        <StatCard
          title="今日订单数"
          value={stats.todayOrders}
          icon={<ShoppingCart className="w-6 h-6" />}
          iconBg="bg-accent-50"
          iconColor="text-accent-600"
          trend={12.5}
        />

        <StatCard
          title="今日收入"
          value={formatMoney(stats.todayRevenue)}
          icon={<DollarSign className="w-6 h-6" />}
          iconBg="bg-success-50"
          iconColor="text-success-600"
          trend={8.7}
        />

        <StatCard
          title="待处理告警"
          value={stats.pendingAlarms}
          icon={<AlertTriangle className="w-6 h-6" />}
          iconBg="bg-warning-50"
          iconColor="text-warning-600"
          trend={-15.3}
        />

        <StatCard
          title="用户总数"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          trend={5.1}
        />

        <StatCard
          title="设备在线率"
          value={`${onlineRate}%`}
          icon={<Activity className="w-6 h-6" />}
          iconBg="bg-accent-50"
          iconColor="text-accent-600"
          trend={1.8}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">取水量趋势</h3>
              <p className="text-sm text-neutral-500 mt-0.5">近7天取水量与收入统计</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary-500" />
                <span className="text-neutral-600">取水量 (L)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-accent-500" />
                <span className="text-neutral-600">收入 (元)</span>
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockWaterTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0F4C81" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B8D4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00B8D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#757575', fontSize: 12 }}
                  axisLine={{ stroke: '#E0E0E0' }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#757575', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#757575', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  labelStyle={{ color: '#212121', fontWeight: 600, marginBottom: 4 }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="volume"
                  name="取水量 (L)"
                  stroke="#0F4C81"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="收入 (元)"
                  stroke="#00B8D4"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#00B8D4', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">设备分布</h3>
              <p className="text-sm text-neutral-500 mt-0.5">园区设备位置分布情况</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-success-500" />
                <span className="text-neutral-600">在线</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                <span className="text-neutral-600">离线</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-danger-500" />
                <span className="text-neutral-600">告警</span>
              </span>
            </div>
          </div>
          <div className="relative h-72 rounded-xl overflow-hidden bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(15, 76, 129, 0.08) 24px, rgba(15, 76, 129, 0.08) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(15, 76, 129, 0.08) 24px, rgba(15, 76, 129, 0.08) 25px)',
              }}
            />
            <div className="absolute top-4 left-4 text-xs text-primary-700 font-medium">园区平面图</div>

            {deviceMapPoints.map((device) => (
              <div
                key={device.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${device.x}%`, top: `${device.y}%` }}
              >
                <div
                  className={`relative w-4 h-4 rounded-full ${statusColorMap[device.status]} ring-2 ring-white cursor-pointer transition-transform hover:scale-150`}
                >
                  <div
                    className={`absolute inset-0 rounded-full ${statusColorMap[device.status]} animate-ping opacity-40`}
                  />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-neutral-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                    {device.deviceNo} · {getStatusText(device.status)}
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-neutral-900 rotate-45" />
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs text-primary-700">
              <MapPin className="w-3.5 h-3.5" />
              <span>共 {deviceMapPoints.length} 个设备点位</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">设备使用率排行</h3>
              <p className="text-sm text-neutral-500 mt-0.5">使用率 Top 8 设备</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockDeviceUsage}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                barSize={28}
              >
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00B8D4" />
                    <stop offset="100%" stopColor="#0F4C81" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
                <XAxis
                  dataKey="deviceNo"
                  tick={{ fill: '#757575', fontSize: 11 }}
                  axisLine={{ stroke: '#E0E0E0' }}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fill: '#757575', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value: number) => [`${value}%`, '使用率']}
                  labelStyle={{ color: '#212121', fontWeight: 600 }}
                />
                <Bar
                  dataKey="usage"
                  name="使用率"
                  fill="url(#colorUsage)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">最新告警</h3>
              <p className="text-sm text-neutral-500 mt-0.5">最近产生的告警信息</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
              查看全部
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {latestAlarms.map((alarm) => {
              const levelConfig = alarmLevelConfig[alarm.level];
              return (
                <div
                  key={alarm.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer border border-transparent hover:border-neutral-100"
                >
                  <div className={`w-8 h-8 rounded-lg ${levelConfig.bg} flex items-center justify-center flex-shrink-0`}>
                    <AlertCircle className={`w-4 h-4 ${levelConfig.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${levelConfig.bg} ${levelConfig.text}`}>
                        {levelConfig.label}
                      </span>
                      <span className="text-xs text-neutral-500">{alarm.deviceNo}</span>
                    </div>
                    <p className="text-sm text-neutral-800 truncate">{alarm.description}</p>
                    <p className="text-xs text-neutral-400 mt-1">{formatDateTime(alarm.createdAt)}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-300 flex-shrink-0 mt-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
