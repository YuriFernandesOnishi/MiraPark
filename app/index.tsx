import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import logo from "../assets/logo.png";

export default function Home() {
  const router = useRouter();

  return (
      <View style={styles.container}>
        <View style={styles.hero}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>MiraPark</Text>
          <Text style={styles.subtitle}>Gerencie sua garagem de forma simples</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => router.push("/login")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={() => router.push("/register")}
          >
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2F",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  hero: { alignItems: "center" },
  logo: { width: 150, height: 150, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: "700", color: "#6C63FF", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#A0A0FF", textAlign: "center", paddingHorizontal: 40 },
  buttonsContainer: { width: "100%", paddingHorizontal: 40 },
  button: { paddingVertical: 16, borderRadius: 12, marginVertical: 8, alignItems: "center" },
  loginButton: { backgroundColor: "#4B7BEC" },
  registerButton: { backgroundColor: "#6C63FF" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 18 },
});