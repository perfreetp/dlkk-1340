export const formatMoney = (amount: number): string => {
  return `¥${amount.toFixed(2)}`;
};

export const formatWaterAmount = (amount: number): string => {
  return `${amount.toFixed(1)}L`;
};

export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const formatDuration = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}分${sec}秒`;
};

export const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

export const statusTextMap: Record<string, string> = {
  online: '在线',
  offline: '离线',
  warning: '告警',
  success: '成功',
  failed: '失败',
  refunded: '已退款',
  balance: '余额支付',
  wechat: '微信支付',
  alipay: '支付宝',
  on: '已上架',
  off: '已下架',
  critical: '严重',
  warning_alm: '警告',
  info: '提示',
  water_low: '水量不足',
  tds_high: 'TDS超标',
  device_offline: '设备离线',
  leak: '漏水检测',
  other: '其他异常',
  pending: '待处理',
  assigned: '已分派',
  processing: '处理中',
  resolved: '已解决',
  closed: '已关闭',
  normal: '正常',
  blocked: '已拉黑',
  approved: '已通过',
  rejected: '已拒绝',
  admin: '超级管理员',
  property: '物业管理员',
  operator: '运营人员',
  maintenance: '维修人员',
};

export const getStatusText = (key: string): string => {
  return statusTextMap[key] || key;
};
