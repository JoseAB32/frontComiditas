import type { UserRole } from "./auth.interface";

export interface UserListItem {
  id: number;
  fullName: string;
  email: string;
  role: UserRole | "externo";
  source: "local" | "api";
}

export interface JsonPlaceholderUser {
  id: number;
  name: string;
  email: string;
}
