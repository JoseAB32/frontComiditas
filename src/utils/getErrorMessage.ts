import axios from "axios";

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const apiMessage = error.response?.data?.message;

    if (Array.isArray(apiMessage)) {
      return apiMessage.join(" ");
    }

    if (apiMessage) {
      return apiMessage;
    }
  }

  if (error instanceof Error && error.message !== "Network Error") {
    return error.message;
  }

  return fallback;
}
