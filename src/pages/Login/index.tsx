import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  Droplets,
  Cpu,
  Activity,
  Waves,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('remember_username');
    if (saved) {
      setUsername(saved);
      setRememberMe(true);
    }
  }, []);

  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const success = login(username.trim(), password);

    if (success) {
      if (rememberMe) {
        localStorage.setItem('remember_username', username.trim());
      } else {
        localStorage.removeItem('remember_username');
      }
      navigate('/dashboard', { replace: true });
    } else {
      setError('用户名或密码错误');
      setLoading(false);
    }
  };

  const decorElements = [
    { Icon: Droplets, className: 'top-16 left-12 w-16 h-16 opacity-10' },
    { Icon: Cpu, className: 'top-32 right-20 w-20 h-20 opacity-10' },
    { Icon: Activity, className: 'bottom-40 left-24 w-14 h-14 opacity-10' },
    { Icon: Shield, className: 'bottom-24 right-32 w-18 h-18 opacity-10' },
    { Icon: Waves, className: 'top-1/2 left-8 w-12 h-12 opacity-10' },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent-400/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-accent-400/15 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-accent-400/20 rounded-full" />
        {decorElements.map(({ Icon, className }, idx) => (
          <Icon
            key={idx}
            className={cn('absolute text-accent-300 animate-pulse-slow', className)}
            style={{ animationDelay: `${idx * 0.5}s` }}
          />
        ))}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(0,184,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,184,212,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative w-full max-w-6xl z-10 animate-fade-in">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center text-white">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-lg shadow-accent-500/30">
                  <Droplets className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Smart Water</h2>
                  <p className="text-xs text-accent-200">Management System</p>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                小区饮水设备
                <br />
                <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
                  智能管理系统
                </span>
              </h1>

              <p className="text-lg text-primary-100 mb-6 font-medium">
                Community Drinking Water Equipment Management
              </p>

              <p className="text-primary-200 leading-relaxed mb-10 max-w-md">
                集设备监控、水质检测、订单管理、用户服务于一体的智能化管理平台，
                为小区饮水安全保驾护航，让管理更高效、服务更贴心。
              </p>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Activity, label: '实时监控', value: '24/7' },
                  { icon: Shield, label: '安全可靠', value: '99.9%' },
                  { icon: Cpu, label: '智能分析', value: 'AI' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                    <Icon className="w-6 h-6 text-accent-300 mb-2" />
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-xs text-primary-200">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 p-8 lg:p-12 bg-white">
              <div className="max-w-md mx-auto animate-slide-up">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">欢迎登录</h2>
                  <p className="text-neutral-500">请输入您的账号信息登录系统</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 flex items-start gap-3 animate-slide-up">
                    <Shield className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-danger-700">登录失败</p>
                      <p className="text-sm text-danger-600">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="label-field">用户名</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="请输入 admin / property / operator / maintenance"
                        className="input-field pl-10"
                        autoComplete="username"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-400">
                      提示：可用账号 admin / property / operator / maintenance
                    </p>
                  </div>

                  <div>
                    <label className="label-field">密码</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码"
                        className="input-field pl-10 pr-10"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-400">提示：默认密码 123456</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 rounded border-2 border-neutral-300 peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all flex items-center justify-center">
                          {rememberMe && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <span className="text-sm text-neutral-600 group-hover:text-neutral-800 transition-colors">
                        记住我
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      忘记密码？
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      'w-full py-3 rounded-lg font-medium text-white transition-all duration-200 relative overflow-hidden',
                      'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600',
                      'shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30',
                      'active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed'
                    )}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                          <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        登录中...
                      </span>
                    ) : (
                      '登 录'
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-100">
                  <p className="text-center text-sm text-neutral-500">
                    登录即表示您同意
                    <a href="#" className="text-primary-600 hover:text-primary-700 font-medium mx-1">服务条款</a>
                    和
                    <a href="#" className="text-primary-600 hover:text-primary-700 font-medium mx-1">隐私政策</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-white/40 text-sm">
          © 2024 小区饮水设备智能管理系统 · All Rights Reserved
        </p>
      </div>
    </div>
  );
}
