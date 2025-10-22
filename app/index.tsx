import React from "react";
import {View, Text, Image, StyleSheet} from "react-native";
import { useRouter } from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomButton from "../components/ui/CustomButton";

export default function Home() {
  const router = useRouter();

  return (
      <SafeAreaView style={styles.container} >
        <View style={styles.hero}>
          <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>MiraPark</Text>
          <Text style={styles.subtitle}>Gerencie sua garagem de forma simples</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <CustomButton title="Logar" onPress={() => router.push("/login")} variant="primary" size="large"/>
          <CustomButton title="Registrar" onPress={() => router.push("/register")} variant="outline" size="large"/>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2F",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 80,
  },
  hero: {
    alignItems: "center"
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#6C63FF",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 22,
    color: "#A0A0FF",
    textAlign: "center",
    paddingHorizontal: 40
  },
  buttonsContainer: {
    width: "100%",
    paddingHorizontal: 60,
    paddingVertical: 40,
    gap: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18
  },
});