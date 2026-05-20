import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
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

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  phone: null,
  retryDelay: null,
  token: null,
  user: null,
  status: 'idle',
  isLoading: false,
  error: null,
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Что-то пошло не так. Попробуйте еще раз.';
}

function assertSuccess(response: ApiResponse) {
  if (!response.success) {
    throw new Error(response.reason ?? 'Сервер вернул ошибку');
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
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
        const { token } = get();

        if (!token) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await authApi.getSession(token);
          assertSuccess(response);

          set({
            user: response.user,
            status: 'authenticated',
            isLoading: false,
          });
        } catch {
          set({ ...initialState });
        }
      },

      logout() {
        set({ ...initialState });
      },

      resetError() {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        phone: state.phone,
        retryDelay: state.retryDelay,
        token: state.token,
        user: state.user,
        status: state.status,
        isLoading: false,
        error: null,
      }),
    },
  ),
);
