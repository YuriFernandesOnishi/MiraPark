import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import AuthForm from "../components/auth/AuthForm";
import AuthInput from "../components/auth/AuthInput";
import LoadingButton from "../components/ui/LoadingButton";
import api from "../services/api";

export default function RegisterScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      return Alert.alert("Atenção", "Preencha todos os campos");
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {nome ,email, senha });

      if (res.status === 200 || res.status === 201) {
        Alert.alert("Sucesso", "Usuário registrado com sucesso", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
      } else {
        Alert.alert("Erro", res.data?.message || "Falha ao registrar usuário");
      }
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Falha ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
      <AuthForm title="Cadastre-se" subtitle="Crie sua conta">

          <AuthInput
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
              keyboardType="email-address"
              icon="email"
          />

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
            title="Registrar"
            onPress={handleRegister}
            loading={loading}
        />
      </AuthForm>
  );
}