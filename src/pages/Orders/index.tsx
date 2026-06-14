import { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingCart,
  CheckCircle,
  DollarSign,
  RefreshCcw,
  FileText,
  User,
  Cpu,
  CreditCard,
  Clock,
} from 'lucide-react';
import { mockOrders, mockUsers, mockDevices } from '@/data/mockData';
import {
  formatMoney,
  formatWaterAmount,
  formatDateTime,
  formatDuration,
  getStatusText,
} from '@/utils/format';
import StatusTag from '@/components/StatusTag';
import type { Order, OrderStatus, PayMethod } from '@/types';

const payMethodStyleMap: Record<PayMethod, { label: string; className: string }> = {
  balance: { label: '余额支付', className: 'bg-primary-50 text-primary-700 border-primary-200' },
  wechat: { label: '微信支付', className: 'bg-success-50 text-success-700 border-success-200' },
  alipay: { label: '支付宝', className: 'bg-accent-50 text-accent-700 border-accent-200' },
};

interface PayMethodTagProps {
  method: PayMethod;
}

function PayMethodTag({ method }: PayMethodTagProps) {
  const config = payMethodStyleMap[method];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium ${config.className}`}>
      <CreditCard className="w-3 h-3" />
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
}

function StatCard({ title, value, icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-5 hover:shadow-cardHover transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-500 mb-2">{title}</p>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const user = mockUsers.find((u) => u.id === order.userId);
  const device = mockDevices.find((d) => d.id === order.deviceId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-cardHover w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">订单详情</h3>
              <p className="text-xs text-neutral-500">{order.orderNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-600" />
              订单信息
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">订单号</span>
                <span className="text-sm text-neutral-900 font-medium">{order.orderNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">订单状态</span>
                <StatusTag status={order.status} category="order" />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">取水量</span>
                <span className="text-sm text-neutral-900 font-medium">{formatWaterAmount(order.waterAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">取水时长</span>
                <span className="text-sm text-neutral-900 font-medium">{formatDuration(order.duration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500">下单时间</span>
                <span className="text-sm text-neutral-900 font-medium">{formatDateTime(order.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-primary-600" />
              用户信息
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">用户名称</span>
                <span className="text-sm text-neutral-900 font-medium">{order.userName}</span>
              </div>
              {user && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">用户编号</span>
                    <span className="text-sm text-neutral-900 font-medium">{user.userNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">手机号码</span>
                    <span className="text-sm text-neutral-900 font-medium">{user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">账户余额</span>
                    <span className="text-sm text-neutral-900 font-medium">{formatMoney(user.balance)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary-600" />
              设备信息
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">设备编号</span>
                <span className="text-sm text-neutral-900 font-medium">{order.deviceNo}</span>
              </div>
              {device && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">设备状态</span>
                    <StatusTag status={device.status} category="device" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">所在位置</span>
                    <span className="text-sm text-neutral-900 font-medium">{device.building} {device.floor} {device.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500">单价</span>
                    <span className="text-sm text-neutral-900 font-medium">{formatMoney(device.pricePerLiter)}/L</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary-600" />
              支付明细
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">支付方式</span>
                <PayMethodTag method={order.payMethod} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500">取水单价</span>
                <span className="text-sm text-neutral-900 font-medium">{device ? formatMoney(device.pricePerLiter) : formatMoney(0.5)}/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">取水量</span>
                <span className="text-sm text-neutral-900 font-medium">{formatWaterAmount(order.waterAmount)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-neutral-200 mt-1">
                <span className="text-sm text-neutral-700 font-medium">实付金额</span>
                <span className="text-xl font-bold text-primary-600">{formatMoney(order.amount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchText, setSearchText] = useState('');
  const [payMethodFilter, setPayMethodFilter] = useState<'all' | PayMethod>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      if (searchText) {
        const lowerSearch = searchText.toLowerCase();
        const matchOrderNo = order.orderNo.toLowerCase().includes(lowerSearch);
        const matchUserName = order.userName.toLowerCase().includes(lowerSearch);
        if (!matchOrderNo && !matchUserName) return false;
      }
      if (payMethodFilter !== 'all' && order.payMethod !== payMethodFilter) return false;
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (startDate) {
        const orderDate = new Date(order.createdAt);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (orderDate < start) return false;
      }
      if (endDate) {
        const orderDate = new Date(order.createdAt);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (orderDate > end) return false;
      }
      return true;
    });
  }, [searchText, payMethodFilter, statusFilter, startDate, endDate]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const stats = useMemo(() => {
    const totalCount = filteredOrders.length;
    const successCount = filteredOrders.filter((o) => o.status === 'success').length;
    const totalAmount = filteredOrders
      .filter((o) => o.status === 'success' || o.status === 'refunded')
      .reduce((sum, o) => sum + o.amount, 0);
    const refundAmount = filteredOrders
      .filter((o) => o.status === 'refunded')
      .reduce((sum, o) => sum + o.amount, 0);
    return { totalCount, successCount, totalAmount, refundAmount };
  }, [filteredOrders]);

  const handleExport = () => {
    const headers = ['订单号', '用户名称', '设备编号', '取水量(L)', '金额(元)', '支付方式', '订单状态', '取水时长(秒)', '下单时间'];
    const rows = filteredOrders.map((order) => [
      order.orderNo,
      order.userName,
      order.deviceNo,
      String(order.waterAmount),
      String(order.amount),
      getStatusText(order.payMethod),
      getStatusText(order.status),
      String(order.duration),
      formatDateTime(order.createdAt),
    ]);
    const csv = '\uFEFF' + [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    a.href = url;
    a.download = `订单流水_${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSearchText('');
    setPayMethodFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">订单流水</h1>
          <p className="text-sm text-neutral-500 mt-1">查看和管理所有取水订单记录</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">起始日期</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">结束日期</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">搜索订单</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="订单号 / 用户名"
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
            <label className="block text-xs text-neutral-500 mb-1.5">支付方式</label>
            <select
              value={payMethodFilter}
              onChange={(e) => {
                setPayMethodFilter(e.target.value as 'all' | PayMethod);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white"
            >
              <option value="all">全部</option>
              <option value="balance">余额</option>
              <option value="wechat">微信</option>
              <option value="alipay">支付宝</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">订单状态</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | OrderStatus);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white"
            >
              <option value="all">全部</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
              <option value="refunded">已退款</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div className="text-sm text-neutral-500">
            共 <span className="font-semibold text-neutral-700">{filteredOrders.length}</span> 条记录
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="h-9 px-4 rounded-lg border border-neutral-200 text-sm text-neutral-600 font-medium hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
            >
              <RefreshCcw className="w-4 h-4" />
              重置
            </button>
            <button
              onClick={handleExport}
              className="h-9 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-1.5 shadow-soft"
            >
              <Download className="w-4 h-4" />
              导出Excel
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="订单总数"
          value={stats.totalCount}
          icon={<ShoppingCart className="w-6 h-6" />}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
        />
        <StatCard
          title="成功订单数"
          value={stats.successCount}
          icon={<CheckCircle className="w-6 h-6" />}
          iconBg="bg-success-50"
          iconColor="text-success-600"
        />
        <StatCard
          title="总金额"
          value={formatMoney(stats.totalAmount)}
          icon={<DollarSign className="w-6 h-6" />}
          iconBg="bg-accent-50"
          iconColor="text-accent-600"
        />
        <StatCard
          title="退款金额"
          value={formatMoney(stats.refundAmount)}
          icon={<RefreshCcw className="w-6 h-6" />}
          iconBg="bg-warning-50"
          iconColor="text-warning-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">订单号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">用户名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">设备编号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">取水量</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">金额</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">支付方式</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">订单状态</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">取水时长</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">下单时间</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-12 h-12 text-neutral-300" />
                      <p className="text-sm text-neutral-500">暂无订单数据</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-50/50 transition-colors cursor-default`}
                  >
                    <td className="px-4 py-3 text-sm text-neutral-900 font-mono">{order.orderNo}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700">{order.userName}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 font-mono">{order.deviceNo}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700">{formatWaterAmount(order.waterAmount)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-900 font-semibold">{formatMoney(order.amount)}</td>
                    <td className="px-4 py-3">
                      <PayMethodTag method={order.payMethod} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusTag status={order.status} category="order" />
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      {formatDuration(order.duration)}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{formatDateTime(order.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        详情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-100">
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
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white shadow-soft'
                        : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
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
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
