import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#1E1E2F" />
        <Stack screenOptions={{ headerShown: false }} />
      </>
  );
}