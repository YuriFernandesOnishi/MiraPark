import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthForm from "../components/auth/AuthForm"
import AuthInput from "../components/auth/AuthInput";
import LoadingButton from "../components/ui/LoadingButton";
import api from "../services/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      return Alert.alert("Atenção", "Preencha todos os campos");
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, senha });

      if (res.data?.token) {
        await AsyncStorage.setItem("token", res.data.token);
        router.replace("/");
      } else {
        Alert.alert("Erro", "Credenciais inválidas");
      }
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Falha ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
      <AuthForm title="Bem-vindo" subtitle="Entre com suas credenciais">
        <AuthInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="email"
        />

        <AuthInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            icon="lock"
        />

        <LoadingButton
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
        />
      </AuthForm>
  );
}