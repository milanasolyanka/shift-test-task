import { create } from 'zustand';
import { authApi } from '../api/authApi';
import type { ApiResponse } from '../api/authTypes';
import { normalizePhone } from '../lib/phoneValidation';
import type { AuthState } from './authTypes';

type AuthActions = {
  requestOtp: (phone: string) => Promise<number>;
  signIn: (code: string) => Promise<void>;
  bootstrapSession: () => Promise<void>;
  logout: () => void;
  resetError: () => void;
};

function getStoredToken() {
  return window.localStorage.getItem('authToken');
}

const initialState: AuthState = {
  phone: null,
  retryDelay: null,
  token: getStoredToken(),
  user: null,
  status: 'idle',
  isLoading: false,
  error: null,
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Сервер вернул ошибку";
}

function assertSuccess(response: ApiResponse) {
  if (!response.success) {
    throw new Error(response.reason ?? 'Сервер вернул ошибку');
  }
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  ...initialState,

  async requestOtp(phone) {
    const normalizedPhone = normalizePhone(phone);

    set({ isLoading: true, error: null });

    try {
      const response = await authApi.requestOtp({ phone: normalizedPhone });
      assertSuccess(response);

      set({
        phone: normalizedPhone,
        retryDelay: response.retryDelay,
        status: 'otpRequested',
        isLoading: false,
      });

      return response.retryDelay;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async signIn(code) {
    const { phone } = get();

    if (!phone) {
      set({ error: 'Поле является обязательным' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await authApi.signIn({ phone, code: Number(code) });
      assertSuccess(response);
      window.localStorage.setItem('authToken', response.token);

      set({
        token: response.token,
        user: response.user,
        status: 'authenticated',
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async bootstrapSession() {
    const token = get().token ?? getStoredToken();

    if (get().status === 'authenticated' || !token) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await authApi.getSession(token);
      assertSuccess(response);

      set({
        token,
        user: response.user,
        status: 'authenticated',
        isLoading: false,
      });
    } catch {
      window.localStorage.removeItem('authToken');
      set({ ...initialState, token: null });
    }
  },

  logout() {
    window.localStorage.removeItem('authToken');
    set({ ...initialState, token: null });
  },

  resetError() {
    set({ error: null });
  },
}));
