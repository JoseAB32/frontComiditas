import type { AppUser, AuthSession, LoginCredentials, RegisterValues, StoredUser } from "../interfaces/auth.interface";
import { readStorage, writeStorage } from "../utils/storage";
import { api, HAS_BACKEND_API } from "./api";

const REGISTERED_USERS_KEY = "catalogo_registered_users";

const DEFAULT_USERS: StoredUser[] = [
  {
    id: 1,
    fullName: "Jose Maria Arias Balderrama",
    email: "admin@catalogo.com",
    password: "admin123",
    role: "admin"
  },
  {
    id: 2,
    fullName: "Cliente Invitado",
    email: "usuario@catalogo.com",
    password: "usuario123",
    role: "user"
  }
];

function getRegisteredUsers(): StoredUser[] {
  return readStorage<StoredUser[]>(REGISTERED_USERS_KEY, []);
}

function saveRegisteredUsers(users: StoredUser[]) {
  writeStorage(REGISTERED_USERS_KEY, users);
}

function toAppUser(user: StoredUser): AppUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role
  };
}

function createFakeJwt(user: AppUser): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: user.id, email: user.email, role: user.role }));
  const signature = btoa("catalogo-comida-demo");

  return `${header}.${payload}.${signature}`;
}

export function getStoredUsersForAdmin(): AppUser[] {
  const registeredUsers = getRegisteredUsers().map(toAppUser);
  return [...DEFAULT_USERS.map(toAppUser), ...registeredUsers];
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  if (HAS_BACKEND_API) {
    const response = await api.post<AuthSession>("/auth/login", {
      email: credentials.email.trim(),
      password: credentials.password
    });

    return response.data;
  }

  await new Promise((resolve) => setTimeout(resolve, 350));

  const allUsers = [...DEFAULT_USERS, ...getRegisteredUsers()];
  const foundUser = allUsers.find(
    (user) =>
      user.email.toLowerCase() === credentials.email.toLowerCase().trim() &&
      user.password === credentials.password
  );

  if (!foundUser) {
    throw new Error("Correo o contraseña incorrectos.");
  }

  const user = toAppUser(foundUser);

  return {
    token: createFakeJwt(user),
    user
  };
}

export async function register(values: RegisterValues): Promise<AuthSession> {
  if (HAS_BACKEND_API) {
    const response = await api.post<AuthSession>("/auth/register", {
      fullName: values.fullName.trim(),
      email: values.email.toLowerCase().trim(),
      password: values.password
    });

    return response.data;
  }

  await new Promise((resolve) => setTimeout(resolve, 350));

  const normalizedEmail = values.email.toLowerCase().trim();
  const allUsers = [...DEFAULT_USERS, ...getRegisteredUsers()];
  const emailExists = allUsers.some((user) => user.email.toLowerCase() === normalizedEmail);

  if (emailExists) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }

  const registeredUsers = getRegisteredUsers();
  const newStoredUser: StoredUser = {
    id: Date.now(),
    fullName: values.fullName.trim(),
    email: normalizedEmail,
    password: values.password,
    role: "user"
  };

  saveRegisteredUsers([...registeredUsers, newStoredUser]);

  const user = toAppUser(newStoredUser);

  return {
    token: createFakeJwt(user),
    user
  };
}
