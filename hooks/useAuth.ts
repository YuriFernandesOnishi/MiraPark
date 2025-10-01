// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services/authService";

const TOKEN_KEY = "token";

// Defina o tipo do usuário conforme a resposta da API /(auth)/me
export type User = {
  nome: string;
  email: string;
};

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicialização do hook
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const t = await AsyncStorage.getItem(TOKEN_KEY);
        if (!mounted) return;

        if (t) {
          setToken(t);
          try {
            const u = await authService.me();
            if (mounted) setUser(u);
          } catch (err) {
            console.warn("Token inválido ou expirado. Limpando armazenamento.");
            await AsyncStorage.removeItem(TOKEN_KEY);
            if (mounted) {
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.error("Erro ao carregar token:", err);
        if (mounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // Login
  const login = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, senha });
      if (data?.token) {
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);

        const u = await authService.me().catch(() => null);
        setUser(u);
      }
      return data;
    } catch (err) {
      console.error("Erro no login:", err);
      throw err; // repassa para o componente tratar
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { token, user, login, logout, loading };
}
