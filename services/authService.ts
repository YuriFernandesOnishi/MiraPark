import api from "./api";

type LoginBody = { email: string; senha: string };

export const authService = {
  register: async (body: LoginBody) => {
    const res = await api.post("/auth/register", body);
    return res.data;
  },

  login: async (body: LoginBody) => {
    const res = await api.post("/auth/login", body);
    return res.data;
  },

  me: async () => {
    const res = await api.get("/auth/me");
    return Array.isArray(res.data) ? res.data[0] : res.data;
  },
};
