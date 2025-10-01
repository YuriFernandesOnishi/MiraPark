import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthFormProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthForm({ title, subtitle, children }: AuthFormProps) {
  return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {children}
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#12121F" },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  header: { marginBottom: 32 },
  title: { fontSize: 36, fontWeight: "700", color: "#6C63FF", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#A0A0FF", textAlign: "center" },
});