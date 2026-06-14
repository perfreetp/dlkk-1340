import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ArrowUpDown,
  X,
  Gift,
  Sparkles,
} from 'lucide-react';
import { mockPackages } from '@/data/mockData';
import { formatMoney } from '@/utils/format';
import StatusTag from '@/components/StatusTag';
import type { Package, PackageStatus } from '@/types';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | 'on' | 'off';

interface FormState {
  name: string;
  price: string;
  bonus: string;
  sort: string;
  status: PackageStatus;
}

interface FormErrors {
  name?: string;
  price?: string;
  bonus?: string;
  sort?: string;
}

const initialForm: FormState = {
  name: '',
  price: '',
  bonus: '',
  sort: '0',
  status: 'on',
};

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>(mockPackages);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const filteredPackages = useMemo(() => {
    return packages
      .filter((pkg) => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.sort - b.sort);
  }, [packages, searchTerm, statusFilter]);

  const openModal = (pkg?: Package) => {
    if (pkg) {
      setEditingId(pkg.id);
      setForm({
        name: pkg.name,
        price: String(pkg.price),
        bonus: String(pkg.bonus),
        sort: String(pkg.sort),
        status: pkg.status,
      });
    } else {
      setEditingId(null);
      setForm(initialForm);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = '请输入套餐名称';
    }

    const priceNum = Number(form.price);
    if (!form.price || form.price === '') {
      newErrors.price = '请输入套餐价格';
    } else if (isNaN(priceNum) || priceNum < 0) {
      newErrors.price = '请输入有效的数字';
    }

    const bonusNum = Number(form.bonus);
    if (form.bonus === '' || isNaN(bonusNum) || bonusNum < 0) {
      newErrors.bonus = '请输入有效的数字';
    }

    const sortNum = Number(form.sort);
    if (form.sort === '' || isNaN(sortNum)) {
      newErrors.sort = '请输入有效的数字';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const price = Number(form.price);
    const bonus = Number(form.bonus);
    const sort = Number(form.sort);

    if (editingId) {
      setPackages((prev) =>
        prev.map((pkg) =>
          pkg.id === editingId
            ? {
                ...pkg,
                name: form.name,
                price,
                bonus,
                totalValue: price + bonus,
                sort,
                status: form.status,
              }
            : pkg
        )
      );
    } else {
      const newPackage: Package = {
        id: `pkg-${Date.now()}`,
        name: form.name,
        price,
        bonus,
        totalValue: price + bonus,
        sort,
        status: form.status,
        createdAt: new Date().toISOString(),
      };
      setPackages((prev) => [...prev, newPackage]);
    }

    closeModal();
  };

  const toggleStatus = (id: string) => {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === id ? { ...pkg, status: pkg.status === 'on' ? 'off' : 'on' } : pkg
      )
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该套餐吗？')) {
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
    }
  };

  const totalValue = Number(form.price || 0) + Number(form.bonus || 0);

  return (
    <div className="p-6 space-y-6 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">充值套餐</h1>
          <p className="text-sm text-neutral-500 mt-1">管理平台充值套餐配置</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索套餐名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <div className="flex bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
          {(['all', 'on', 'off'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-all duration-200',
                statusFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-50'
              )}
            >
              {status === 'all' ? '全部' : status === 'on' ? '已上架' : '已下架'}
            </button>
          ))}
        </div>

        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 ml-auto">
          <Plus className="w-4 h-4" />
          新增套餐
        </button>
      </div>

      {filteredPackages.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20">
          <Sparkles className="w-16 h-16 text-neutral-300 mb-4" />
          <p className="text-neutral-500 text-sm">暂无符合条件的套餐</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={cn(
                'bg-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover border',
                pkg.status === 'on' ? 'border-success-200' : 'border-neutral-200'
              )}
            >
              <div
                className={cn(
                  'relative px-5 py-4 text-white',
                  pkg.status === 'on'
                    ? 'bg-gradient-to-r from-primary-600 to-accent-500'
                    : 'bg-gradient-to-r from-neutral-400 to-neutral-500'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{pkg.name}</h3>
                    <p className="text-xs text-white/80 mt-0.5">排序: {pkg.sort}</p>
                  </div>
                  <StatusTag status={pkg.status} category="package" />
                </div>
                {pkg.bonus > 0 && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2">
                    <div className="bg-warning-500 text-white text-xs font-bold px-3 py-1 rounded-l-lg shadow-md flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      赠{pkg.bonus}元
                    </div>
                  </div>
                )}
              </div>

              <div className="px-5 py-5">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-sm text-neutral-500">¥</span>
                  <span className="text-4xl font-bold text-neutral-900">{pkg.price}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                  <span>总价值: </span>
                  <span className="font-semibold text-accent-600">{formatMoney(pkg.totalValue)}</span>
                </div>

                <div className="h-px bg-neutral-100 mb-4" />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(pkg)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    编辑
                  </button>
                  <button
                    onClick={() => toggleStatus(pkg.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      pkg.status === 'on'
                        ? 'text-warning-600 bg-warning-50 hover:bg-warning-100'
                        : 'text-success-600 bg-success-50 hover:bg-success-100'
                    )}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    {pkg.status === 'on' ? '下架' : '上架'}
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-900">
                {editingId ? '编辑套餐' : '新增套餐'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="label-field">套餐名称</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="请输入套餐名称"
                  className={cn('input-field', errors.name && 'border-danger-400 focus:ring-danger-400')}
                />
                {errors.name && <p className="text-xs text-danger-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">套餐价格 (元)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={cn('input-field', errors.price && 'border-danger-400 focus:ring-danger-400')}
                  />
                  {errors.price && <p className="text-xs text-danger-500 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="label-field">赠送金额 (元)</label>
                  <input
                    type="number"
                    value={form.bonus}
                    onChange={(e) => setForm({ ...form, bonus: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={cn('input-field', errors.bonus && 'border-danger-400 focus:ring-danger-400')}
                  />
                  {errors.bonus && <p className="text-xs text-danger-500 mt-1">{errors.bonus}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">排序</label>
                  <input
                    type="number"
                    value={form.sort}
                    onChange={(e) => setForm({ ...form, sort: e.target.value })}
                    placeholder="0"
                    min="0"
                    className={cn('input-field', errors.sort && 'border-danger-400 focus:ring-danger-400')}
                  />
                  {errors.sort && <p className="text-xs text-danger-500 mt-1">{errors.sort}</p>}
                </div>
                <div>
                  <label className="label-field">状态</label>
                  <div className="flex gap-2">
                    {(['on', 'off'] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setForm({ ...form, status })}
                        className={cn(
                          'flex-1 px-3 py-2 text-sm font-medium rounded-md border transition-all duration-200',
                          form.status === status
                            ? status === 'on'
                              ? 'bg-success-50 text-success-700 border-success-300'
                              : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                            : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
                        )}
                      >
                        {status === 'on' ? '上架' : '下架'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">自动计算总价值</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-accent-600">¥</span>
                    <span className="text-2xl font-bold text-primary-600">{totalValue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100">
              <button onClick={closeModal} className="btn-ghost">
                取消
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                {editingId ? '保存修改' : '确认新增'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
