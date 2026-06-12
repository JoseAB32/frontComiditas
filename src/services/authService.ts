import { API_ROUTES } from "../config/apiRoutes";
import type { AuthSession, LoginCredentials, RegisterValues } from "../interfaces/auth.interface";
import { api } from "./api";

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const response = await api.post<AuthSession>(API_ROUTES.auth.login, {
    email: credentials.email.trim(),
    password: credentials.password
  });

  return response.data;
}

export async function register(values: RegisterValues): Promise<AuthSession> {
  const response = await api.post<AuthSession>(API_ROUTES.auth.register, {
    fullName: values.fullName.trim(),
    email: values.email.toLowerCase().trim(),
    password: values.password
  });

  return response.data;
}
