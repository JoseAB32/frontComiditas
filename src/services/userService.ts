import { API_ROUTES } from "../config/apiRoutes";
import type { UserListItem } from "../interfaces/user.interface";
import { api } from "./api";

export async function getUsers(): Promise<UserListItem[]> {
  const response = await api.get<UserListItem[]>(API_ROUTES.users.list);
  return response.data;
}
