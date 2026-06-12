import type { UserRole } from "./auth.interface";

export interface UserListItem {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
}
