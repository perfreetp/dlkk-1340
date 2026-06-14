import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Filter,
  List,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Power,
  Settings,
  X,
  Activity,
  Droplets,
  Thermometer,
  Beaker,
  Gauge,
  Clock,
  Wrench,
  Play,
  Pause,
  Edit3,
  Check,
} from 'lucide-react';
import { mockDevices } from '@/data/mockData';
import StatusTag from '@/components/StatusTag';
import { formatMoney, formatDate, formatWaterAmount, getStatusText } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { Device, DeviceStatus } from '@/types';

const PAGE_SIZE = 8;

const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: 'online', label: '在线' },
  { value: 'offline', label: '离线' },
  { value: 'warning', label: '告警' },
];

const deviceStatusColorMap: Record<DeviceStatus, string> = {
  online: 'bg-success-500',
  offline: 'bg-neutral-400',
  warning: 'bg-danger-500',
};

const getWaterLevelColor = (level: number) => {
  if (level > 60) return 'bg-success-500';
  if (level > 30) return 'bg-warning-500';
  return 'bg-danger-500';
};

const getWaterLevelBg = (level: number) => {
  if (level > 60) return 'bg-success-100';
  if (level > 30) return 'bg-warning-100';
  return 'bg-danger-100';
};

const getWaterLevelText = (level: number) => {
  if (level > 60) return 'text-success-700';
  if (level > 30) return 'text-warning-700';
  return 'text-danger-700';
};

interface WaterIndicatorProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  goodMin: number;
  goodMax: number;
  icon: React.ReactNode;
}

const WaterIndicator = ({ label, value, unit, min, max, goodMin, goodMax, icon }: WaterIndicatorProps) => {
  const percent = ((value - min) / (max - min)) * 100;
  const isGood = value >= goodMin && value <= goodMax;
  return (
    <div className="bg-neutral-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            isGood ? 'bg-success-100 text-success-600' : 'bg-warning-100 text-warning-600'
          )}>
            {icon}
          </div>
          <span className="text-sm font-medium text-neutral-700">{label}</span>
        </div>
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full',
          isGood ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'
        )}>
          {isGood ? '正常' : '异常'}
        </span>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-2xl font-bold text-neutral-900">
          {value}
          <span className="text-sm font-normal text-neutral-500 ml-1">{unit}</span>
        </span>
      </div>
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isGood ? 'bg-gradient-to-r from-accent-400 to-accent-600' : 'bg-gradient-to-r from-warning-400 to-warning-600'
          )}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-xs text-neutral-400">
        <span>{min}{unit}</span>
        <span>正常范围: {goodMin}-{goodMax}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = ({ value, size = 160, strokeWidth = 12 }: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  const color = value > 60 ? '#00C853' : value > 30 ? '#FF9800' : '#F44336';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E0E0E0" strokeWidth={strokeWidth} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Droplets className="w-6 h-6 mb-1" style={{ color }} />
        <span className="text-3xl font-bold text-neutral-900">{value}%</span>
        <span className="text-xs text-neutral-500 mt-0.5">剩余水量</span>
      </div>
    </div>
  );
};

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>(() => [...mockDevices]);
  const [searchText, setSearchText] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [priceEditDevice, setPriceEditDevice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState('');

  const buildings = useMemo(() => {
    const set = new Set(devices.map(d => d.building));
    return Array.from(set);
  }, [devices]);

  const updateDevice = useCallback((deviceId: string, updates: Partial<Device>) => {
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, ...updates } : d));
  }, []);

  const selectedDevice = useMemo(() => {
    return devices.find(d => d.id === selectedDeviceId) || null;
  }, [devices, selectedDeviceId]);

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      if (searchText && !device.deviceNo.toLowerCase().includes(searchText.toLowerCase())) return false;
      if (buildingFilter !== 'all' && device.building !== buildingFilter) return false;
      if (statusFilter !== 'all' && device.status !== statusFilter) return false;
      return true;
    });
  }, [devices, searchText, buildingFilter, statusFilter]);

  const totalPages = Math.ceil(filteredDevices.length / PAGE_SIZE);
  const pagedDevices = filteredDevices.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const deviceMapPoints = useMemo(() => {
    return filteredDevices.map((device, index) => {
      const cols = 6;
      const col = index % cols;
      const row = Math.floor(index / cols);
      return {
        ...device,
        x: 10 + col * 15 + (Math.random() * 6 - 3),
        y: 15 + row * 22 + (Math.random() * 6 - 3),
      };
    });
  }, [filteredDevices]);

  const handleOpenDetail = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };

  const handleCloseDetail = () => {
    setSelectedDeviceId(null);
    setPriceEditDevice(null);
  };

  const handleToggleDevice = (device: Device) => {
    const newStatus: DeviceStatus = device.status === 'online' ? 'offline' : 'online';
    updateDevice(device.id, { status: newStatus });
  };

  const handleStartPriceEdit = (device: Device) => {
    setPriceEditDevice(device.id);
    setTempPrice(String(device.pricePerLiter));
  };

  const handleSavePrice = (deviceId: string) => {
    const price = parseFloat(tempPrice);
    if (isNaN(price) || price < 0) return;
    updateDevice(deviceId, { pricePerLiter: price });
    setPriceEditDevice(null);
  };

  const handleCancelPriceEdit = () => {
    setPriceEditDevice(null);
  };

  const formatLocation = (device: Device) => {
    return `${device.building} ${device.floor} ${device.location}`;
  };

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">设备管理</h1>
          <p className="text-sm text-neutral-500 mt-1">管理园区内所有直饮水设备</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Activity className="w-4 h-4" />
          <span>共 {filteredDevices.length} 台设备</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-4 mb-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="按设备编号搜索..."
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <select
              value={buildingFilter}
              onChange={(e) => { setBuildingFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none pl-10 pr-10 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all bg-white cursor-pointer"
            >
              <option value="all">全部楼栋</option>
              {buildings.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="appearance-none px-4 pr-10 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all bg-white cursor-pointer"
            >
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          </div>
          <div className="ml-auto flex items-center p-0.5 bg-neutral-100 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              <List className="w-4 h-4" />列表
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                viewMode === 'map' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              )}
            >
              <MapPin className="w-4 h-4" />地图
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">设备编号</th>
                  <th className="table-th">位置</th>
                  <th className="table-th">状态</th>
                  <th className="table-th">剩余水量</th>
                  <th className="table-th">TDS</th>
                  <th className="table-th">PH值</th>
                  <th className="table-th">温度</th>
                  <th className="table-th">单价</th>
                  <th className="table-th text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {pagedDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="table-td"><span className="font-medium text-neutral-900">{device.deviceNo}</span></td>
                    <td className="table-td">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                        <span className="text-neutral-600">{formatLocation(device)}</span>
                      </div>
                    </td>
                    <td className="table-td"><StatusTag status={device.status} category="device" /></td>
                    <td className="table-td">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className={cn('flex-1 h-2 rounded-full overflow-hidden', getWaterLevelBg(device.waterLevel))}>
                          <div className={cn('h-full rounded-full transition-all duration-500', getWaterLevelColor(device.waterLevel))} style={{ width: `${device.waterLevel}%` }} />
                        </div>
                        <span className={cn('text-xs font-medium w-10 text-right', getWaterLevelText(device.waterLevel))}>{device.waterLevel}%</span>
                      </div>
                    </td>
                    <td className="table-td"><span className="text-neutral-700">{device.tds} ppm</span></td>
                    <td className="table-td"><span className="text-neutral-700">{device.ph}</span></td>
                    <td className="table-td"><span className="text-neutral-700">{device.temperature}°C</span></td>
                    <td className="table-td">
                      {priceEditDevice === device.id ? (
                        <div className="flex items-center gap-1">
                          <input type="number" step="0.1" min="0" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} className="w-16 px-2 py-1 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent" />
                          <span className="text-xs text-neutral-500">元/L</span>
                        </div>
                      ) : (
                        <span className="text-neutral-700 font-medium">{formatMoney(device.pricePerLiter)}/L</span>
                      )}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleOpenDetail(device.id)} className="p-2 rounded-md text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-all" title="查看详情">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleToggleDevice(device)} className={cn('p-2 rounded-md transition-all', device.status === 'online' ? 'text-danger-500 hover:bg-danger-50' : 'text-success-600 hover:bg-success-50')} title={device.status === 'online' ? '远程停止' : '远程启动'}>
                          <Power className="w-4 h-4" />
                        </button>
                        {priceEditDevice === device.id ? (
                          <div className="flex items-center gap-0.5">
                            <button onClick={() => handleSavePrice(device.id)} className="p-2 rounded-md text-success-600 hover:bg-success-50 transition-all" title="保存"><Check className="w-4 h-4" /></button>
                            <button onClick={handleCancelPriceEdit} className="p-2 rounded-md text-neutral-400 hover:bg-neutral-100 transition-all" title="取消"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <button onClick={() => handleStartPriceEdit(device)} className="p-2 rounded-md text-neutral-500 hover:text-accent-600 hover:bg-accent-50 transition-all" title="配置价格"><Settings className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {pagedDevices.length === 0 && (
                  <tr><td colSpan={9} className="py-12 text-center text-neutral-400">暂无符合条件的设备</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
              <span className="text-sm text-neutral-500">共 {filteredDevices.length} 条，第 {currentPage}/{totalPages} 页</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={cn('w-9 h-9 rounded-md text-sm font-medium transition-all', page === currentPage ? 'bg-primary-600 text-white shadow-soft' : 'text-neutral-600 hover:bg-neutral-100')}>{page}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">设备分布地图</h3>
              <p className="text-sm text-neutral-500 mt-0.5">点击设备点可查看详情</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success-500" /><span className="text-neutral-600">在线</span></span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-neutral-400" /><span className="text-neutral-600">离线</span></span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-danger-500" /><span className="text-neutral-600">告警</span></span>
            </div>
          </div>
          <div className="relative h-[520px] rounded-xl overflow-hidden bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(15, 76, 129, 0.08) 24px, rgba(15, 76, 129, 0.08) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(15, 76, 129, 0.08) 24px, rgba(15, 76, 129, 0.08) 25px)' }} />
            <div className="absolute top-4 left-4 text-xs text-primary-700 font-medium">园区平面图</div>
            {deviceMapPoints.map((device) => (
              <div key={device.id} className="absolute -translate-x-1/2 -translate-y-1/2 group" style={{ left: `${device.x}%`, top: `${device.y}%` }}>
                <div onClick={() => handleOpenDetail(device.id)} className={cn('relative w-5 h-5 rounded-full ring-2 ring-white cursor-pointer transition-transform hover:scale-150', deviceStatusColorMap[device.status])}>
                  <div className={cn('absolute inset-0 rounded-full animate-ping opacity-40', deviceStatusColorMap[device.status])} />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-neutral-900 text-white text-xs px-2.5 py-1.5 rounded whitespace-nowrap shadow-lg">
                    <p className="font-medium">{device.deviceNo}</p>
                    <p className="text-neutral-300 mt-0.5">{device.building} {device.floor}</p>
                    <p className="text-neutral-300">{getStatusText(device.status)} · {formatMoney(device.pricePerLiter)}/L</p>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-neutral-900 rotate-45" />
                </div>
              </div>
            ))}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs text-primary-700 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5" /><span>共 {deviceMapPoints.length} 个设备点位</span>
            </div>
          </div>
        </div>
      )}

      {selectedDevice && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCloseDetail} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto animate-slide-right">
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">设备详情</h2>
                <p className="text-sm text-neutral-500 mt-0.5">{selectedDevice.deviceNo}</p>
              </div>
              <button onClick={handleCloseDetail} className="p-2 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl p-5 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white/70">设备编号</p>
                    <p className="text-xl font-bold mt-1">{selectedDevice.deviceNo}</p>
                  </div>
                  <StatusTag status={selectedDevice.status} category="device" />
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{formatLocation(selectedDevice)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">基本信息</h3>
                <div className="bg-neutral-50 rounded-xl divide-y divide-neutral-200">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-neutral-500">设备编号</span>
                    <span className="text-sm font-medium text-neutral-900">{selectedDevice.deviceNo}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-neutral-500">安装位置</span>
                    <span className="text-sm font-medium text-neutral-900">{formatLocation(selectedDevice)}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-neutral-500 flex items-center gap-1.5"><Clock className="w-4 h-4" />安装时间</span>
                    <span className="text-sm font-medium text-neutral-900">2024-08-15</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-neutral-500 flex items-center gap-1.5"><Wrench className="w-4 h-4" />最后维护</span>
                    <span className="text-sm font-medium text-neutral-900">{formatDate(selectedDevice.lastMaintenance)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">实时状态</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-neutral-50 rounded-xl p-4 text-center">
                    <Activity className="w-6 h-6 mx-auto text-primary-600 mb-2" />
                    <p className="text-xs text-neutral-500 mb-1">在线状态</p>
                    <StatusTag status={selectedDevice.status} category="device" showDot={false} />
                  </div>
                  <div className="bg-neutral-50 rounded-xl p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto text-accent-600 mb-2" />
                    <p className="text-xs text-neutral-500 mb-1">运行时长</p>
                    <p className="text-lg font-bold text-neutral-900">{Math.floor(Math.random() * 2000 + 500)}h</p>
                  </div>
                  <div className="bg-neutral-50 rounded-xl p-4 text-center">
                    <Droplets className="w-6 h-6 mx-auto text-success-600 mb-2" />
                    <p className="text-xs text-neutral-500 mb-1">累计出水量</p>
                    <p className="text-lg font-bold text-neutral-900">{formatWaterAmount(selectedDevice.totalWater)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">水质指标</h3>
                <div className="grid grid-cols-2 gap-3">
                  <WaterIndicator label="TDS值" value={selectedDevice.tds} unit="ppm" min={0} max={500} goodMin={0} goodMax={150} icon={<Gauge className="w-4 h-4" />} />
                  <WaterIndicator label="PH值" value={selectedDevice.ph} unit="" min={0} max={14} goodMin={6.5} goodMax={8.5} icon={<Beaker className="w-4 h-4" />} />
                  <WaterIndicator label="余氯" value={selectedDevice.chlorine} unit="mg/L" min={0} max={1} goodMin={0.05} goodMax={0.5} icon={<Droplets className="w-4 h-4" />} />
                  <WaterIndicator label="温度" value={selectedDevice.temperature} unit="°C" min={0} max={50} goodMin={15} goodMax={30} icon={<Thermometer className="w-4 h-4" />} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">剩余水量</h3>
                <div className="bg-neutral-50 rounded-xl p-5 flex flex-col items-center">
                  <CircularProgress value={selectedDevice.waterLevel} />
                  <p className="mt-4 text-sm text-neutral-500 text-center">水箱容量 200L，剩余约 {Math.round(200 * selectedDevice.waterLevel / 100)}L</p>
                  {selectedDevice.waterLevel < 30 && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-danger-600 bg-danger-50 px-3 py-1.5 rounded-full">
                      <Activity className="w-3.5 h-3.5" />水量不足，请及时补充
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">操作</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleToggleDevice(selectedDevice)}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all',
                      selectedDevice.status === 'online'
                        ? 'bg-danger-50 text-danger-600 hover:bg-danger-100'
                        : 'bg-success-50 text-success-600 hover:bg-success-100'
                    )}
                  >
                    {selectedDevice.status === 'online' ? (<><Pause className="w-4 h-4" />停止设备</>) : (<><Play className="w-4 h-4" />启动设备</>)}
                  </button>
                  <button
                    onClick={() => handleStartPriceEdit(selectedDevice)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-primary-50 text-primary-600 hover:bg-primary-100 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />调整价格
                  </button>
                </div>
                {priceEditDevice === selectedDevice.id && (
                  <div className="mt-3 bg-neutral-50 rounded-lg p-4 flex items-center gap-3">
                    <input type="number" step="0.1" min="0" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} className="w-24 px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent" placeholder="新单价" />
                    <span className="text-sm text-neutral-500">元/L</span>
                    <button onClick={() => handleSavePrice(selectedDevice.id)} className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-all">保存</button>
                    <button onClick={handleCancelPriceEdit} className="px-4 py-2 text-neutral-500 text-sm rounded-md hover:bg-neutral-100 transition-all">取消</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
