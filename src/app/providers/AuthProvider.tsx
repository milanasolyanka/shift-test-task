import { useEffect } from 'react';
import { useAuthStore } from '../../features/auth/model/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const bootstrapSession = useAuthStore((state) => state.bootstrapSession);

  useEffect(() => {
    void bootstrapSession();
  }, [bootstrapSession]);

  return children;
}
