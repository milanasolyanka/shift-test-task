import { ApiError } from "../../../shared/api/apiError";
import { apiClient } from "../../../shared/api/client";
import type {
  OtpRequestDto,
  OtpResponse,
  SessionResponse,
  SignInDto,
  SignInResponse,
} from "./authTypes";

const SUSPENDED_SERVICE_STATUS = 503;
const MOCK_REASON = "Service has been suspended. Used mock response.";

function isSuspendedServiceError(error: unknown) {
  return error instanceof ApiError && error.status === SUSPENDED_SERVICE_STATUS;
}

function createMockUser(phone: string) {
  return {
    _id: "mock-user-id",
    phone,
    firstname: "Иван",
    middlename: "Иванович",
    lastname: "Иванов",
    email: "email@gmail.com",
    city: "Томск",
  };
}

function createMockOtpResponse(): OtpResponse {
  return {
    success: true,
    reason: MOCK_REASON,
    retryDelay: 10000,
  };
}

function createMockSignInResponse(payload: SignInDto): SignInResponse {
  return {
    success: true,
    reason: MOCK_REASON,
    token: "mock-auth-token",
    user: createMockUser(payload.phone),
  };
}

function createMockSessionResponse(): SessionResponse {
  return {
    success: true,
    reason: MOCK_REASON,
    user: createMockUser("89990009999"),
  };
}

export const authApi = {
  async requestOtp(payload: OtpRequestDto) {
    try {
      return await apiClient.post<OtpResponse>("/auth/otp", payload);
    } catch (error) {
      if (isSuspendedServiceError(error)) {
        return createMockOtpResponse();
      }

      throw error;
    }
  },

  async signIn(payload: SignInDto) {
    try {
      return await apiClient.post<SignInResponse>("/users/signin", payload);
    } catch (error) {
      if (isSuspendedServiceError(error)) {
        return createMockSignInResponse(payload);
      }

      throw error;
    }
  },

  async getSession(token: string) {
    console.log("[authApi.ts] trying to get session for token ", token);
    try {
      return await apiClient.get<SessionResponse>("/users/session", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (isSuspendedServiceError(error)) {
        return createMockSessionResponse();
      }

      throw error;
    }
  },
};
