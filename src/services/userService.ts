import axios from "axios";
import type { JsonPlaceholderUser, UserListItem } from "../interfaces/user.interface";
import { getStoredUsersForAdmin } from "./authService";
import { api, HAS_BACKEND_API } from "./api";

export async function getUsers(): Promise<UserListItem[]> {
  if (HAS_BACKEND_API) {
    const response = await api.get<UserListItem[]>("/users");
    return response.data;
  }

  const localUsers: UserListItem[] = getStoredUsersForAdmin().map((user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    source: "local"
  }));

  try {
    const response = await axios.get<JsonPlaceholderUser[]>("https://jsonplaceholder.typicode.com/users", {
      timeout: 7000
    });

    const apiUsers: UserListItem[] = response.data.slice(0, 5).map((user) => ({
      id: 1000 + user.id,
      fullName: user.name,
      email: user.email.toLowerCase(),
      role: "externo",
      source: "api"
    }));

    return [...localUsers, ...apiUsers];
  } catch {
    return localUsers;
  }
}
