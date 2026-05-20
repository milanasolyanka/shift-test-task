import type { AuthState } from './authTypes';

export const selectIsAuthenticated = (state: AuthState) => state.status === 'authenticated';
export const selectCanRequestOtp = (state: AuthState) => !state.isLoading;
export const selectAuthError = (state: AuthState) => state.error;
