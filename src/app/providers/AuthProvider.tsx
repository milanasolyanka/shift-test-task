import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/model/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const bootstrapSession = useAuthStore((state) => state.bootstrapSession);

  useEffect(() => {
    void bootstrapSession();
  }, [bootstrapSession, location.pathname, location.search]);

  return children;
}
