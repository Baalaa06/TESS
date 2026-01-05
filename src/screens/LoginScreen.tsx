import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Please enter email and password");
    setLoading(true);
    try {
      await login(email.trim(), password);
      Alert.alert("Welcome", "Logged in successfully");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Login failed", err.message || "Check credentials or network");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Signing in..." : "Sign In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#f8fafc" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 12, borderColor: "#e5e7eb", borderWidth: 1 },
  button: { backgroundColor: "#2563eb", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "#2563eb", textAlign: "center" },
});
