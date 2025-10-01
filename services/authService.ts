// src/services/authService.ts
import api from "./api";

type LoginBody = { email: string; senha: string };

export const authService = {
  register: async (body: LoginBody) => {
    // retorna string "Usuário registrado com sucesso"
    const res = await api.post("/auth/register", body);
    return res.data;
  },

  login: async (body: LoginBody) => {
    // retorna { token: "..." }
    const res = await api.post("/auth/login", body);
    return res.data;
  },

  me: async () => {
    // /(auth)/me pode retornar um array com objeto ou só um objeto — acomodamos ambos
    const res = await api.get("/auth/me");
    return Array.isArray(res.data) ? res.data[0] : res.data;
  },
};
