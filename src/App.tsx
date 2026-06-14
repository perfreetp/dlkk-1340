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

function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
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

function RouteWatcher() {
  const location = useLocation();
  const setCurrentPage = useGlobalStore((s) => s.setCurrentPage);

  useEffect(() => {
    const page = location.pathname.split("/")[1] || "dashboard";
    setCurrentPage(page);
  }, [location.pathname, setCurrentPage]);

  return null;
}

export default function App() {
  return (
    <Router>
      <RouteWatcher />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/devices"
          element={
            <RequireAuth>
              <AppLayout>
                <Devices />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <AppLayout>
                <Orders />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/packages"
          element={
            <RequireAuth>
              <AppLayout>
                <Packages />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/alarms"
          element={
            <RequireAuth>
              <AppLayout>
                <Alarms />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/users"
          element={
            <RequireAuth>
              <AppLayout>
                <Users />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/reports"
          element={
            <RequireAuth>
              <AppLayout>
                <Reports />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <AppLayout>
                <Settings />
              </AppLayout>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
