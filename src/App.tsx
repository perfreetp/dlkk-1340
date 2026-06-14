import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Devices from "@/pages/Devices";
import Orders from "@/pages/Orders";
import Packages from "@/pages/Packages";
import Alarms from "@/pages/Alarms";
import Users from "@/pages/Users";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import AppLayout from "@/components/Layout/AppLayout";
import { useAuthStore, useGlobalStore } from "@/store";

const pagePermissionMap: Record<string, string> = {
  dashboard: "dashboard",
  devices: "devices",
  orders: "orders",
  packages: "packages",
  alarms: "alarms",
  users: "users",
  reports: "reports",
  settings: "settings",
};

function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored && !isAuthenticated) {
      try {
        const parsed = JSON.parse(stored);
        useAuthStore.setState({ user: parsed, isAuthenticated: true });
      } catch {}
    }
  }, [isAuthenticated]);

  const finalAuth = isAuthenticated || !!localStorage.getItem("auth_user");

  if (!finalAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function PermissionGuard({ children, page }: { children: JSX.Element; page: string }) {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const getFirstAllowedPage = useAuthStore((s) => s.getFirstAllowedPage);

  if (!hasPermission(pagePermissionMap[page] || page)) {
    const firstPage = getFirstAllowedPage();
    return <Navigate to={`/${firstPage}`} replace />;
  }

  return children;
}

function RouteWatcher() {
  const location = useLocation();
  const setCurrentPage = useGlobalStore((s) => s.setCurrentPage);

  useEffect(() => {
    const page = location.pathname.split("/")[1] || "dashboard";
    setCurrentPage(page);
  }, [location.pathname, setCurrentPage]);

  return null;
}

function AuthenticatedRoute({ page }: { page: string }) {
  const PageComponent = {
    dashboard: Dashboard,
    devices: Devices,
    orders: Orders,
    packages: Packages,
    alarms: Alarms,
    users: Users,
    reports: Reports,
    settings: Settings,
  }[page];

  if (!PageComponent) return <Navigate to="/dashboard" replace />;

  return (
    <RequireAuth>
      <PermissionGuard page={page}>
        <AppLayout>
          <PageComponent />
        </AppLayout>
      </PermissionGuard>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <Router>
      <RouteWatcher />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AuthenticatedRoute page="dashboard" />} />
        <Route path="/devices" element={<AuthenticatedRoute page="devices" />} />
        <Route path="/orders" element={<AuthenticatedRoute page="orders" />} />
        <Route path="/packages" element={<AuthenticatedRoute page="packages" />} />
        <Route path="/alarms" element={<AuthenticatedRoute page="alarms" />} />
        <Route path="/users" element={<AuthenticatedRoute page="users" />} />
        <Route path="/reports" element={<AuthenticatedRoute page="reports" />} />
        <Route path="/settings" element={<AuthenticatedRoute page="settings" />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
