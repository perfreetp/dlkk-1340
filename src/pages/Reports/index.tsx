import { useState, useMemo } from 'react';
import {
  Droplets,
  DollarSign,
  Monitor,
  Users,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Clock,
  Activity,
  AlertTriangle,
  UserPlus,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  generateReportSummaryStats,
  generateWaterTrendData,
  generateBuildingWaterData,
  generateRevenueCompareData,
  generatePackageSaleData,
  generateDeviceRankData,
  generateFaultTypeData,
  generateAlarmTrendData,
  generateUserGrowthData,
  generateRechargeDistributionData,
  generateActiveTimeHeatData,
  type ReportSummaryStats,
} from '@/data/mockData';
import { formatMoney, formatWaterAmount, formatDateTime } from '@/utils/format';
import type { TimeDimension, ReportTab } from '@/types';

const COLORS_PRIMARY = '#0F4C81';
const COLORS_ACCENT = '#00B8D4';
const COLORS_SUCCESS = '#00C853';
const COLORS_WARNING = '#FF9800';
const COLORS_DANGER = '#F44336';
const PIE_COLORS = ['#0F4C81', '#00B8D4', '#00C853', '#FF9800', '#F44336', '#7C4DFF'];

interface TrendBadgeProps {
  value: number;
  label?: string;
}

const TrendBadge = ({ value, label = '同比' }: TrendBadgeProps) => {
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
  trend?: number;
  trendLabel?: string;
  extra?: React.ReactNode;
}

const StatCard = ({ title, value, icon, iconBg, iconColor, trend, trendLabel, extra }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-5 hover:shadow-cardHover transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-500 mb-2">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mb-2">{value}</p>
          {extra}
          {trend !== undefined && <TrendBadge value={trend} label={trendLabel} />}
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onExport?: () => void;
  className?: string;
}

const ChartCard = ({ title, subtitle, icon, children, onExport, className = '' }: ChartCardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-card p-5 ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary-600">{icon}</div>}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          导出
        </button>
      </div>
      {children}
    </div>
  );
};

const TimeDimensionToggle = ({
  value,
  onChange,
}: {
  value: TimeDimension;
  onChange: (v: TimeDimension) => void;
}) => {
  const options: { key: TimeDimension; label: string }[] = [
    { key: 'day', label: '日' },
    { key: 'week', label: '周' },
    { key: 'month', label: '月' },
  ];
  return (
    <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all ${
            value === opt.key
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

const TabButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-lg transition-all ${
      active
        ? 'bg-primary-600 text-white shadow-soft'
        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default function Reports() {
  const [timeDimension, setTimeDimension] = useState<TimeDimension>('week');
  const [activeTab, setActiveTab] = useState<ReportTab>('water');

  const stats: ReportSummaryStats = useMemo(() => generateReportSummaryStats(), []);
  const waterTrendData = useMemo(() => generateWaterTrendData(timeDimension), [timeDimension]);
  const buildingWaterData = useMemo(() => generateBuildingWaterData(), []);
  const revenueCompareData = useMemo(() => generateRevenueCompareData(timeDimension), [timeDimension]);
  const packageSaleData = useMemo(() => generatePackageSaleData(), []);
  const deviceRankData = useMemo(() => generateDeviceRankData(), []);
  const faultTypeData = useMemo(() => generateFaultTypeData(), []);
  const alarmTrendData = useMemo(() => generateAlarmTrendData(timeDimension), [timeDimension]);
  const userGrowthData = useMemo(() => generateUserGrowthData(timeDimension), [timeDimension]);
  const rechargeDistributionData = useMemo(() => generateRechargeDistributionData(), []);
  const activeTimeHeatData = useMemo(() => generateActiveTimeHeatData(), []);

  const handleExport = (chartName: string) => {
    const dataMap: Record<string, { headers: string[]; rows: string[][] }> = {
      '取水量趋势': {
        headers: ['日期', '取水量(L)', '收入(元)'],
        rows: waterTrendData.map((d) => [d.date, String(d.volume), String(d.revenue)]),
      },
      '楼栋取水量对比': {
        headers: ['楼栋', '取水量(L)'],
        rows: buildingWaterData.map((d) => [d.building, String(d.volume)]),
      },
      '收入对比': {
        headers: ['日期', '充值收入(元)', '消费收入(元)'],
        rows: revenueCompareData.map((d) => [d.date, String(d.recharge), String(d.consume)]),
      },
      '套餐销售分布': {
        headers: ['套餐名称', '销量(份)'],
        rows: packageSaleData.map((d) => [d.name, String(d.value)]),
      },
      '设备使用率排名': {
        headers: ['设备编号', '楼栋', '使用率(%)'],
        rows: deviceRankData.map((d) => [d.deviceNo, d.building, String(d.usage)]),
      },
      '故障类型分布': {
        headers: ['故障类型', '数量(次)'],
        rows: faultTypeData.map((d) => [d.name, String(d.value)]),
      },
      '告警趋势': {
        headers: ['日期', '告警数(条)'],
        rows: alarmTrendData.map((d) => [d.date, String(d.count)]),
      },
      '用户增长趋势': {
        headers: ['日期', '用户总数', '新增用户'],
        rows: userGrowthData.map((d) => [d.date, String(d.total), String(d.newUsers)]),
      },
      '充值金额分布': {
        headers: ['充值区间', '用户数(人)'],
        rows: rechargeDistributionData.map((d) => [d.range, String(d.count)]),
      },
      '活跃时段热力图': {
        headers: ['时段', '工作日(人)', '周末(人)'],
        rows: activeTimeHeatData.map((d) => [d.hour, String(d.weekday), String(d.weekend)]),
      },
    };
    const data = dataMap[chartName];
    if (!data) return;
    const csv = '\uFEFF' + [data.headers, ...data.rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    a.href = url;
    a.download = `${chartName}_${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderWaterTab = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="总取水量"
          value={formatWaterAmount(stats.totalWaterVolume)}
          icon={<Droplets className="w-6 h-6" />}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          trend={stats.waterYoYGrowth}
          trendLabel="同比"
        />
        <StatCard
          title="日均取水量"
          value={formatWaterAmount(stats.avgDailyWater)}
          icon={<BarChart3 className="w-6 h-6" />}
          iconBg="bg-accent-50"
          iconColor="text-accent-600"
          trend={8.3}
          trendLabel="环比"
        />
        <StatCard
          title="同比增长率"
          value={`+${stats.waterYoYGrowth}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          iconBg="bg-success-50"
          iconColor="text-success-600"
          extra={
            <div className="flex gap-3 mb-3">
              <span className="inline-flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-success-500" />
                <span className="text-neutral-600">增长趋势</span>
              </span>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard
          title="取水量趋势"
          subtitle="取水量变化趋势与收入关联"
          icon={<AreaChartIcon className="w-5 h-5" />}
          onExport={() => handleExport('取水量趋势')}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="waterColorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS_PRIMARY} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={COLORS_PRIMARY} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="waterColorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS_ACCENT} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={COLORS_ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#757575', fontSize: 12 }} axisLine={{ stroke: '#E0E0E0' }} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: '#757575', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#757575', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  labelStyle={{ color: '#212121', fontWeight: 600, marginBottom: 4 }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="volume"
                  name="取水量 (L)"
                  stroke={COLORS_PRIMARY}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#waterColorVolume)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="收入 (元)"
                  stroke={COLORS_ACCENT}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: COLORS_ACCENT, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="各楼栋取水量对比"
          subtitle="各楼栋取水量统计"
          icon={<BarChart3 className="w-5 h-5" />}
          onExport={() => handleExport('楼栋取水量对比')}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingWaterData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barSize={32}>
                <defs>
                  <linearGradient id="buildingWaterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS_ACCENT} />
                    <stop offset="100%" stopColor={COLORS_PRIMARY} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
                <XAxis dataKey="building" tick={{ fill: '#757575', fontSize: 11 }} axisLine={{ stroke: '#E0E0E0' }} tickLine={false} />
                <YAxis tick={{ fill: '#757575', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}L`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value: number) => [formatWaterAmount(value), '取水量']}
                  labelStyle={{ color: '#212121', fontWeight: 600 }}
                />
                <Bar dataKey="volume" name="取水量" fill="url(#buildingWaterGradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );

  const renderRevenueTab = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="总收入"
          value={formatMoney(stats.totalRevenue)}
          icon={<DollarSign className="w-6 h-6" />}
          iconBg="bg-success-50"
          iconColor="text-success-600"
          trend={15.2}
          trendLabel="同比"
        />
        <StatCard
          title="充值收入"
          value={formatMoney(stats.rechargeRevenue)}
          icon={<Zap className="w-6 h-6" />}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          trend={18.7}
          trendLabel="同比"
        />
        <StatCard
          title="消费收入"
          value={formatMoney(stats.consumeRevenue)}
          icon={<Activity className="w-6 h-6" />}
          iconBg="bg-accent-50"
          iconColor="text-accent-600"
          trend={10.3}
          trendLabel="同比"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard
          title="充值 vs 消费收入对比"
          subtitle="收入变化趋势对比"
          icon={<LineChartIcon className="w-5 h-5" />}
          onExport={() => handleExport('收入对比')}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueCompareData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#757575', fontSize: 12 }} axisLine={{ stroke: '#E0E0E0' }} tickLine={false} />
                <YAxis tick={{ fill: '#757575', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `¥${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value: number) => [formatMoney(value), '']}
                  labelStyle={{ color: '#212121', fontWeight: 600 }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="recharge"
                  name="充值收入"
                  stroke={COLORS_PRIMARY}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: COLORS_PRIMARY, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="consume"
                  name="消费收入"
                  stroke={COLORS_ACCENT}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: COLORS_ACCENT, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="套餐销售分布"
          subtitle="各套餐销售占比"
          icon={<PieChartIcon className="w-5 h-5" />}
          onExport={() => handleExport('套餐销售分布')}
        >
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="70%" height="100%">
              <PieChart>
                <Pie
                  data={packageSaleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#BDBDBD', strokeWidth: 1 }}
                >
                  {packageSaleData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value: number) => [`${value} 份`, '销量']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {packageSaleData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className="text-neutral-700">{item.name}</span>
                  </div>
                  <span className="font-medium text-neutral-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );

  const renderDeviceTab = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="设备总数"
          value={stats.totalDevices}
          icon={<Monitor className="w-6 h-6" />}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          trend={3.2}
          trendLabel="环比"
        />
        <StatCard
          title="在线率"
          value={`${stats.onlineRate}%`}
          icon={<Activity className="w-6 h-6" />}
          iconBg="bg-success-50"
          iconColor="text-success-600"
          trend={1.8}
          trendLabel="环比"
        />
        <StatCard
          title="平均使用率"
          value={`${stats.avgDeviceUsage}%`}
          icon={<Zap className="w-6 h-6" />}
          iconBg="bg-accent-50"
          iconColor="text-accent-600"
          trend={5.6}
          trendLabel="环比"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard
          title="设备使用率排名"
          subtitle="使用率 Top 10 设备"
          icon={<BarChart3 className="w-5 h-5" />}
          onExport={() => handleExport('设备使用率排名')}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deviceRankData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                barSize={18}
              >
                <defs>
                  <linearGradient id="deviceRankGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={COLORS_PRIMARY} />
                    <stop offset="100%" stopColor={COLORS_ACCENT} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#757575', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis
                  type="category"
                  dataKey="deviceNo"
                  tick={{ fill: '#757575', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
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
                <Bar dataKey="usage" name="使用率" fill="url(#deviceRankGradient)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="设备故障类型分布"
          subtitle="各类故障占比统计"
          icon={<PieChartIcon className="w-5 h-5" />}
          onExport={() => handleExport('故障类型分布')}
        >
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="70%" height="100%">
              <PieChart>
                <Pie
                  data={faultTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#BDBDBD', strokeWidth: 1 }}
                >
                  {faultTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value: number) => [`${value} 次`, '数量']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {faultTypeData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className="text-neutral-700">{item.name}</span>
                  </div>
                  <span className="font-medium text-neutral-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="告警趋势"
        subtitle="告警数量变化趋势"
        icon={<AlertTriangle className="w-5 h-5" />}
        onExport={() => handleExport('告警趋势')}
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={alarmTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="alarmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS_WARNING} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS_WARNING} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#757575', fontSize: 12 }} axisLine={{ stroke: '#E0E0E0' }} tickLine={false} />
              <YAxis tick={{ fill: '#757575', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                formatter={(value: number) => [`${value} 条`, '告警数']}
                labelStyle={{ color: '#212121', fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="告警数"
                stroke={COLORS_WARNING}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#alarmGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );

  const renderUserTab = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="用户总数"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          trend={7.8}
          trendLabel="环比"
        />
        <StatCard
          title="活跃用户"
          value={stats.activeUsers}
          icon={<Activity className="w-6 h-6" />}
          iconBg="bg-success-50"
          iconColor="text-success-600"
          extra={
            <p className="text-xs text-neutral-500 mb-2">
              活跃率 {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
            </p>
          }
          trend={5.2}
          trendLabel="环比"
        />
        <StatCard
          title="新增用户"
          value={stats.newUsers}
          icon={<UserPlus className="w-6 h-6" />}
          iconBg="bg-accent-50"
          iconColor="text-accent-600"
          trend={12.5}
          trendLabel="环比"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard
          title="用户增长趋势"
          subtitle="用户总数与新增用户趋势"
          icon={<AreaChartIcon className="w-5 h-5" />}
          onExport={() => handleExport('用户增长趋势')}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="userTotalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS_PRIMARY} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={COLORS_PRIMARY} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="userNewGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS_SUCCESS} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={COLORS_SUCCESS} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#757575', fontSize: 12 }} axisLine={{ stroke: '#E0E0E0' }} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: '#757575', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#757575', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  labelStyle={{ color: '#212121', fontWeight: 600, marginBottom: 4 }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="total"
                  name="用户总数"
                  stroke={COLORS_PRIMARY}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#userTotalGradient)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="newUsers"
                  name="新增用户"
                  stroke={COLORS_SUCCESS}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#userNewGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="用户充值金额分布"
          subtitle="各充值区间用户数量"
          icon={<BarChart3 className="w-5 h-5" />}
          onExport={() => handleExport('充值金额分布')}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rechargeDistributionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barSize={40}>
                <defs>
                  <linearGradient id="rechargeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS_ACCENT} />
                    <stop offset="100%" stopColor={COLORS_PRIMARY} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: '#757575', fontSize: 11 }} axisLine={{ stroke: '#E0E0E0' }} tickLine={false} />
                <YAxis tick={{ fill: '#757575', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value: number) => [`${value} 人`, '用户数']}
                  labelStyle={{ color: '#212121', fontWeight: 600 }}
                />
                <Bar dataKey="count" name="用户数" fill="url(#rechargeGradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="活跃用户时段热力图"
        subtitle="工作日 vs 周末各时段活跃用户分布（简化版）"
        icon={<Clock className="w-5 h-5" />}
        onExport={() => handleExport('活跃时段热力图')}
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeTimeHeatData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: '#757575', fontSize: 12 }} axisLine={{ stroke: '#E0E0E0' }} tickLine={false} />
              <YAxis tick={{ fill: '#757575', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                formatter={(value: number) => [`${value} 人`, '']}
                labelStyle={{ color: '#212121', fontWeight: 600 }}
              />
              <Legend />
              <Bar dataKey="weekday" name="工作日" fill={COLORS_PRIMARY} radius={[4, 4, 0, 0]} />
              <Bar dataKey="weekend" name="周末" fill={COLORS_ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );

  const tabs: { key: ReportTab; label: string; icon: React.ReactNode }[] = [
    { key: 'water', label: '取水量统计', icon: <Droplets className="w-4 h-4" /> },
    { key: 'revenue', label: '收入统计', icon: <DollarSign className="w-4 h-4" /> },
    { key: 'device', label: '设备分析', icon: <Monitor className="w-4 h-4" /> },
    { key: 'user', label: '用户分析', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">统计报表</h1>
          <p className="text-sm text-neutral-500 mt-1">多维度数据分析与可视化报表</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Calendar className="w-4 h-4" />
            <TimeDimensionToggle value={timeDimension} onChange={setTimeDimension} />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            <Clock className="w-4 h-4" />
            <span>更新于 {formatDateTime(new Date().toISOString())}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-xl shadow-card p-2 flex-wrap">
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </div>

      {activeTab === 'water' && renderWaterTab()}
      {activeTab === 'revenue' && renderRevenueTab()}
      {activeTab === 'device' && renderDeviceTab()}
      {activeTab === 'user' && renderUserTab()}
    </div>
  );
}
