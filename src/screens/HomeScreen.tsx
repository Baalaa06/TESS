import { View, Text, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { runEmergencyFlow } from "@/engine/emergencyFlow";

export default function HomeScreen() {
  const [trust, setTrust] = useState<number | null>(null);
  const [decision, setDecision] = useState<string>("");

  async function onSOSPress() {
    const result = await runEmergencyFlow();
    setTrust(result.trust);
    setDecision(result.action);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trust Status Dashboard</Text>

      <Text style={styles.trust}>
        System Trust:{" "}
        {trust === null
          ? "—"
          : trust >= 0.75
          ? "🟢 HIGH"
          : trust >= 0.45
          ? "🟡 MEDIUM"
          : "🔴 LOW"}
      </Text>

      {trust !== null && (
        <Text style={styles.action}>Action: {decision}</Text>
      )}

      <Button title="🚨 SOS" onPress={onSOSPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  trust: {
    fontSize: 16,
  },
  action: {
    fontSize: 14,
  },
});
