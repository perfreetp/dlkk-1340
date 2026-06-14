import { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Wallet,
  Ticket,
  Ban,
  Check,
  User,
  Phone,
  Calendar,
  Clock,
  ArrowLeftRight,
  UserRound,
  Coins,
  ShoppingBag,
  Tag,
  AlignLeft,
} from 'lucide-react';
import { mockUsers, mockRefundRequests, mockPackages } from '@/data/mockData';
import { formatMoney, formatDateTime, formatPhone } from '@/utils/format';
import StatusTag from '@/components/StatusTag';
import type { User as UserType, UserStatus, RefundRequest } from '@/types';

type TabKey = 'list' | 'refund';

interface RechargeRecord {
  id: string;
  amount: number;
  bonus: number;
  packageName?: string;
  createdAt: string;
}

interface ConsumeRecord {
  id: string;
  orderNo: string;
  deviceNo: string;
  waterAmount: number;
  amount: number;
  createdAt: string;
}

const mockRechargeRecords: RechargeRecord[] = [
  { id: 'rc-1', amount: 50, bonus: 15, packageName: '标准套餐', createdAt: '2025-06-10T14:30:00Z' },
  { id: 'rc-2', amount: 100, bonus: 40, packageName: '超值套餐', createdAt: '2025-05-20T09:15:00Z' },
  { id: 'rc-3', amount: 20, bonus: 0, createdAt: '2025-05-05T16:45:00Z' },
];

const mockConsumeRecords: ConsumeRecord[] = [
  { id: 'cs-1', orderNo: 'O20250612001', deviceNo: 'WD1001001', waterAmount: 5.2, amount: 2.6, createdAt: '2025-06-12T10:30:00Z' },
  { id: 'cs-2', orderNo: 'O20250610005', deviceNo: 'WD1001002', waterAmount: 3.0, amount: 1.5, createdAt: '2025-06-10T08:20:00Z' },
  { id: 'cs-3', orderNo: 'O20250605012', deviceNo: 'WD1001003', waterAmount: 8.5, amount: 4.25, createdAt: '2025-06-05T19:10:00Z' },
];

interface UserDetailDrawerProps {
  user: UserType;
  onClose: () => void;
}

function UserDetailDrawer({ user, onClose }: UserDetailDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl h-full overflow-hidden animate-slide-right flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <UserRound className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">用户详情</h3>
              <p className="text-xs text-neutral-500">{user.userNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <UserRound className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold">{user.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-3.5 h-3.5 opacity-80" />
                  <span className="text-sm opacity-90">{formatPhone(user.phone)}</span>
                </div>
                <div className="mt-2">
                  <StatusTag status={user.status} category="user" showDot={false} className="!bg-white/20 !text-white !border-white/30" />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs opacity-80">账户余额</p>
                <p className="text-2xl font-bold mt-1">{formatMoney(user.balance)}</p>
              </div>
              <div>
                <p className="text-xs opacity-80">注册时间</p>
                <p className="text-sm font-medium mt-1">{formatDateTime(user.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-neutral-50 rounded-xl p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-success-50 flex items-center justify-center mb-2">
                <Coins className="w-5 h-5 text-success-600" />
              </div>
              <p className="text-xs text-neutral-500">累计充值</p>
              <p className="text-lg font-bold text-neutral-900 mt-1">{formatMoney(user.totalRecharge)}</p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-warning-50 flex items-center justify-center mb-2">
                <ShoppingBag className="w-5 h-5 text-warning-600" />
              </div>
              <p className="text-xs text-neutral-500">累计消费</p>
              <p className="text-lg font-bold text-neutral-900 mt-1">{formatMoney(user.totalConsume)}</p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-accent-50 flex items-center justify-center mb-2">
                <Ticket className="w-5 h-5 text-accent-600" />
              </div>
              <p className="text-xs text-neutral-500">优惠券</p>
              <p className="text-lg font-bold text-neutral-900 mt-1">{user.coupons.length} 张</p>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary-600" />
              充值记录
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">金额</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">赠送</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">套餐</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {mockRechargeRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-3 py-2.5 text-sm font-medium text-success-600">+{formatMoney(record.amount)}</td>
                      <td className="px-3 py-2.5 text-sm text-warning-600">+{formatMoney(record.bonus)}</td>
                      <td className="px-3 py-2.5 text-sm text-neutral-700">{record.packageName || '自定义充值'}</td>
                      <td className="px-3 py-2.5 text-sm text-neutral-500">{formatDateTime(record.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary-600" />
              消费记录
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">订单号</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">设备</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">水量</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">金额</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {mockConsumeRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-3 py-2.5 text-sm font-mono text-neutral-700">{record.orderNo}</td>
                      <td className="px-3 py-2.5 text-sm text-neutral-700 font-mono">{record.deviceNo}</td>
                      <td className="px-3 py-2.5 text-sm text-neutral-700">{record.waterAmount.toFixed(1)}L</td>
                      <td className="px-3 py-2.5 text-sm font-medium text-danger-600">-{formatMoney(record.amount)}</td>
                      <td className="px-3 py-2.5 text-sm text-neutral-500">{formatDateTime(record.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary-600" />
              优惠券
            </h4>
            <div className="space-y-2">
              {user.coupons.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-4">暂无优惠券</p>
              ) : (
                user.coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`flex items-center justify-between bg-white rounded-lg p-3 border ${coupon.used ? 'border-neutral-200 opacity-60' : 'border-primary-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${coupon.used ? 'bg-neutral-100' : 'bg-accent-50'}`}>
                        <Tag className={`w-6 h-6 ${coupon.used ? 'text-neutral-400' : 'text-accent-600'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${coupon.used ? 'text-neutral-500' : 'text-neutral-900'}`}>{coupon.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {formatDateTime(coupon.validFrom).split(' ')[0]} - {formatDateTime(coupon.validTo).split(' ')[0]}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${coupon.used ? 'text-neutral-400' : 'text-accent-600'}`}>¥{coupon.amount}</p>
                      <p className="text-xs text-neutral-500">{coupon.used ? '已使用' : '未使用'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-100 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

interface RechargeModalProps {
  user: UserType;
  onClose: () => void;
}

function RechargeModal({ user, onClose }: RechargeModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');

  const availablePackages = mockPackages.filter((p) => p.status === 'on');

  const totalAmount = useMemo(() => {
    if (selectedPackage) {
      const pkg = mockPackages.find((p) => p.id === selectedPackage);
      return pkg ? pkg.price : 0;
    }
    return customAmount ? Number(customAmount) : 0;
  }, [selectedPackage, customAmount]);

  const bonusAmount = useMemo(() => {
    if (selectedPackage) {
      const pkg = mockPackages.find((p) => p.id === selectedPackage);
      return pkg ? pkg.bonus : 0;
    }
    return 0;
  }, [selectedPackage]);

  const handleConfirm = () => {
    if (totalAmount <= 0) return;
    alert(`已为用户 ${user.name} 充值 ${formatMoney(totalAmount)}，赠送 ${formatMoney(bonusAmount)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-cardHover w-full max-w-md overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">充值</h3>
              <p className="text-xs text-neutral-500">用户：{user.name}</p>
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
            <label className="block text-sm font-medium text-neutral-700 mb-2">选择充值套餐</label>
            <select
              value={selectedPackage}
              onChange={(e) => {
                setSelectedPackage(e.target.value);
                setCustomAmount('');
              }}
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white"
            >
              <option value="">-- 选择套餐 --</option>
              {availablePackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - {formatMoney(pkg.price)}（赠送{formatMoney(pkg.bonus)}，总价值{formatMoney(pkg.totalValue)}）
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400">或</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">自定义金额</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">¥</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedPackage('');
                }}
                placeholder="输入充值金额"
                min="0"
                step="1"
                className="w-full h-10 pl-8 pr-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          {totalAmount > 0 && (
            <div className="bg-neutral-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-neutral-500">充值金额</span>
                <span className="text-sm font-medium text-neutral-900">{formatMoney(totalAmount)}</span>
              </div>
              {bonusAmount > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-500">赠送金额</span>
                  <span className="text-sm font-medium text-warning-600">+{formatMoney(bonusAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
                <span className="text-sm font-medium text-neutral-700">到账总金额</span>
                <span className="text-xl font-bold text-success-600">{formatMoney(totalAmount + bonusAmount)}</span>
              </div>
            </div>
          )}
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
            disabled={totalAmount <= 0}
            className="px-6 py-2 rounded-lg bg-success-600 text-white text-sm font-medium hover:bg-success-700 transition-colors shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
          >
            确认充值
          </button>
        </div>
      </div>
    </div>
  );
}

interface CouponModalProps {
  user: UserType;
  onClose: () => void;
}

function CouponModal({ user, onClose }: CouponModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');

  const handleConfirm = () => {
    if (!name || !amount || !validFrom || !validTo) {
      alert('请填写完整信息');
      return;
    }
    alert(`已为用户 ${user.name} 发放「${name}」面额 ¥${amount}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-cardHover w-full max-w-md overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">发放优惠券</h3>
              <p className="text-xs text-neutral-500">用户：{user.name}</p>
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
            <label className="block text-sm font-medium text-neutral-700 mb-2">优惠券名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：满减优惠券"
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">面额</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">¥</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="输入面额"
                min="0"
                step="1"
                className="w-full h-10 pl-8 pr-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">开始日期</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">结束日期</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="date"
                  value={validTo}
                  onChange={(e) => setValidTo(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
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
            className="px-6 py-2 rounded-lg bg-accent-600 text-white text-sm font-medium hover:bg-accent-700 transition-colors shadow-soft"
          >
            确认发放
          </button>
        </div>
      </div>
    </div>
  );
}

interface RefundReviewModalProps {
  refund: RefundRequest;
  action: 'approve' | 'reject';
  onClose: () => void;
  onConfirm: (remark: string) => void;
}

function RefundReviewModal({ refund, action, onClose, onConfirm }: RefundReviewModalProps) {
  const [remark, setRemark] = useState('');

  const isApprove = action === 'approve';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-cardHover w-full max-w-md overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isApprove ? 'bg-success-50' : 'bg-danger-50'}`}>
              {isApprove ? (
                <Check className="w-5 h-5 text-success-600" />
              ) : (
                <X className="w-5 h-5 text-danger-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                {isApprove ? '通过退款' : '拒绝退款'}
              </h3>
              <p className="text-xs text-neutral-500">{refund.refundNo}</p>
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
          <div className="bg-neutral-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">用户</span>
              <span className="text-sm font-medium text-neutral-900">{refund.userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">关联订单</span>
              <span className="text-sm font-medium text-neutral-900 font-mono">{refund.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">退款金额</span>
              <span className="text-sm font-bold text-danger-600">{formatMoney(refund.amount)}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-neutral-500 flex items-center gap-1 mt-0.5">
                <AlignLeft className="w-3.5 h-3.5" />
                退款原因
              </span>
              <span className="text-sm text-neutral-900 text-right max-w-[60%]">{refund.reason}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">审核备注</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder={isApprove ? '请输入通过原因（可选）' : '请输入拒绝原因'}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors resize-none"
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
            onClick={() => onConfirm(remark)}
            className={`px-6 py-2 rounded-lg text-white text-sm font-medium transition-colors shadow-soft ${
              isApprove
                ? 'bg-success-600 hover:bg-success-700'
                : 'bg-danger-600 hover:bg-danger-700'
            }`}
          >
            {isApprove ? '确认通过' : '确认拒绝'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const [activeTab, setActiveTab] = useState<TabKey>('list');

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [detailUser, setDetailUser] = useState<UserType | null>(null);
  const [rechargeUser, setRechargeUser] = useState<UserType | null>(null);
  const [couponUser, setCouponUser] = useState<UserType | null>(null);
  const [refundReview, setRefundReview] = useState<{ refund: RefundRequest; action: 'approve' | 'reject' } | null>(null);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      if (searchText) {
        const lowerSearch = searchText.toLowerCase();
        const matchName = user.name.toLowerCase().includes(lowerSearch);
        const matchPhone = user.phone.includes(searchText);
        const matchUserNo = user.userNo.toLowerCase().includes(lowerSearch);
        if (!matchName && !matchPhone && !matchUserNo) return false;
      }
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;
      return true;
    });
  }, [searchText, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const pendingRefunds = useMemo(() => mockRefundRequests.filter((r) => r.status === 'pending'), []);

  const handleBlockToggle = (user: UserType) => {
    const action = user.status === 'normal' ? '拉黑' : '解禁';
    if (confirm(`确定要${action}用户 ${user.name} 吗？`)) {
      alert(`已${action}用户 ${user.name}`);
    }
  };

  const handleRefundReviewConfirm = (remark: string) => {
    if (!refundReview) return;
    const action = refundReview.action === 'approve' ? '通过' : '拒绝';
    alert(`已${action}退款申请 ${refundReview.refund.refundNo}${remark ? `，备注：${remark}` : ''}`);
    setRefundReview(null);
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'list', label: '用户列表', icon: <User className="w-4 h-4" /> },
    { key: 'refund', label: '退款审核', icon: <ArrowLeftRight className="w-4 h-4" />, badge: pendingRefunds.length },
  ];

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">用户账户</h1>
          <p className="text-sm text-neutral-500 mt-1">管理平台用户账户与退款审核</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="flex items-center border-b border-neutral-100 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-danger-500 text-white text-xs font-medium flex items-center justify-center">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-600 rounded-t" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'list' && (
          <div>
            <div className="p-5 border-b border-neutral-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-neutral-500 mb-1.5">搜索用户</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="搜索姓名 / 手机号 / 用户编号"
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
                  <label className="block text-xs text-neutral-500 mb-1.5">用户状态</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as 'all' | UserStatus);
                      setCurrentPage(1);
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white"
                  >
                    <option value="all">全部</option>
                    <option value="normal">正常</option>
                    <option value="blocked">已拉黑</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">用户编号</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">姓名</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">手机号</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">余额</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">累计充值</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">累计消费</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">状态</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">注册时间</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <User className="w-12 h-12 text-neutral-300" />
                          <p className="text-sm text-neutral-500">暂无用户数据</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-50/50 transition-colors cursor-default`}
                      >
                        <td className="px-4 py-3 text-sm text-neutral-700 font-mono">{user.userNo}</td>
                        <td className="px-4 py-3 text-sm text-neutral-900 font-medium">{user.name}</td>
                        <td className="px-4 py-3 text-sm text-neutral-700">{formatPhone(user.phone)}</td>
                        <td className="px-4 py-3 text-sm text-neutral-900 font-semibold">{formatMoney(user.balance)}</td>
                        <td className="px-4 py-3 text-sm text-success-600 font-medium">{formatMoney(user.totalRecharge)}</td>
                        <td className="px-4 py-3 text-sm text-warning-600 font-medium">{formatMoney(user.totalConsume)}</td>
                        <td className="px-4 py-3">
                          <StatusTag status={user.status} category="user" />
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-neutral-400" />
                            {formatDateTime(user.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setDetailUser(user)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                              title="查看详情"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              详情
                            </button>
                            <button
                              onClick={() => setRechargeUser(user)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-success-600 hover:bg-success-50 transition-colors"
                              title="充值"
                            >
                              <Wallet className="w-3.5 h-3.5" />
                              充值
                            </button>
                            <button
                              onClick={() => setCouponUser(user)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-accent-600 hover:bg-accent-50 transition-colors"
                              title="发放优惠券"
                            >
                              <Ticket className="w-3.5 h-3.5" />
                              优惠券
                            </button>
                            <button
                              onClick={() => handleBlockToggle(user)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                user.status === 'normal'
                                  ? 'text-danger-600 hover:bg-danger-50'
                                  : 'text-success-600 hover:bg-success-50'
                              }`}
                              title={user.status === 'normal' ? '拉黑' : '解禁'}
                            >
                              {user.status === 'normal' ? (
                                <><Ban className="w-3.5 h-3.5" />拉黑</>
                              ) : (
                                <><Check className="w-3.5 h-3.5" />解禁</>
                              )}
                            </button>
                          </div>
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
                  共 <span className="font-semibold text-neutral-700">{filteredUsers.length}</span> 条记录，
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
        )}

        {activeTab === 'refund' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">退款单号</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">用户姓名</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">关联订单号</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">退款金额</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">退款原因</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">申请时间</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">状态</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {mockRefundRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <ArrowLeftRight className="w-12 h-12 text-neutral-300" />
                        <p className="text-sm text-neutral-500">暂无退款申请</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  mockRefundRequests.map((refund, index) => (
                    <tr
                      key={refund.id}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-50/50 transition-colors cursor-default`}
                    >
                      <td className="px-4 py-3 text-sm text-neutral-700 font-mono">{refund.refundNo}</td>
                      <td className="px-4 py-3 text-sm text-neutral-900 font-medium">{refund.userName}</td>
                      <td className="px-4 py-3 text-sm text-neutral-700 font-mono">{refund.orderId}</td>
                      <td className="px-4 py-3 text-sm font-bold text-danger-600">{formatMoney(refund.amount)}</td>
                      <td className="px-4 py-3 text-sm text-neutral-700 max-w-[200px] truncate" title={refund.reason}>
                        {refund.reason}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          {formatDateTime(refund.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusTag status={refund.status} category="refund" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {refund.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setRefundReview({ refund, action: 'approve' })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-success-600 hover:bg-success-50 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              通过
                            </button>
                            <button
                              onClick={() => setRefundReview({ refund, action: 'reject' })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-danger-600 hover:bg-danger-50 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              拒绝
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400">已处理</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detailUser && (
        <UserDetailDrawer user={detailUser} onClose={() => setDetailUser(null)} />
      )}

      {rechargeUser && (
        <RechargeModal user={rechargeUser} onClose={() => setRechargeUser(null)} />
      )}

      {couponUser && (
        <CouponModal user={couponUser} onClose={() => setCouponUser(null)} />
      )}

      {refundReview && (
        <RefundReviewModal
          refund={refundReview.refund}
          action={refundReview.action}
          onClose={() => setRefundReview(null)}
          onConfirm={handleRefundReviewConfirm}
        />
      )}
    </div>
  );
}
