import type { User } from '../model/authTypes';

export type ApiResponse = {
  success: boolean;
  reason?: string;
};

export type OtpRequestDto = {
  phone: string;
};

export type OtpResponse = ApiResponse & {
  retryDelay: number;
};

export type SignInDto = {
  phone: string;
  code: number;
};

export type SignInResponse = ApiResponse & {
  token: string;
  user: User;
};

export type SessionResponse = ApiResponse & {
  user: User;
};
