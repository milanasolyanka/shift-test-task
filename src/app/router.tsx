import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginOtpPage } from '../pages/login-otp/LoginOtpPage';
import { LoginPhonePage } from '../pages/login-phone/LoginPhonePage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { useAuthStore } from '../features/auth/model/authStore';

function RequireOtpSession({ children }: { children: React.ReactNode }) {
  const phone = useAuthStore((state) => state.phone);
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  if (!phone) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <PublicOnly>
              <LoginPhonePage />
            </PublicOnly>
          }
        />
        <Route
          path="/login/otp"
          element={
            <RequireOtpSession>
              <LoginOtpPage />
            </RequireOtpSession>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
