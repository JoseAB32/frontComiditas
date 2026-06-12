export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    register: "/auth/register"
  },
  foods: {
    list: "/foods",
    detail: (id: number) => `/foods/${id}`,
    create: "/foods",
    update: (id: number) => `/foods/${id}`,
    remove: (id: number) => `/foods/${id}`
  },
  users: {
    list: "/users"
  }
} as const;
