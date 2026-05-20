export type AuthStatus = 'idle' | 'otpRequested' | 'authenticated';

export type User = {
  _id: string;
  phone: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email?: string;
  city?: string;
};

export type AuthState = {
  phone: string | null;
  retryDelay: number | null;
  token: string | null;
  user: User | null;
  status: AuthStatus;
  isLoading: boolean;
  error: string | null;
};
