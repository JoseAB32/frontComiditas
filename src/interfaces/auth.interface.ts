export type UserRole = "admin" | "user";

export interface AppUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface StoredUser extends AppUser {
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterValues {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: AppUser;
}
