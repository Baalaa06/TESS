import { isFirebaseEnabled } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { runEmergencyFlow } from "@/engine/emergencyFlow";
import { subscribeToAccelerometer } from "@/services/systemHealth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= TYPES ================= */

type Decision = {
  action: "INSTANT_ALERT" | "DELAY_CONFIRMATION" | "FALLBACK" | "FALLBACK_SMS";
  message: string;
  delay?: number;
};


type SystemHealth = {
  battery: number;
  network: boolean;
  location: boolean;
  sensors: {
    accelerometer: boolean;
  };
};

type Context = {
  hour: number;
  movementLevel: string;
  locationType?: string;
};

type EmergencyResult = {
  trust: number;
  aiConfidence: number;
  decision: Decision;
  systemHealth: SystemHealth;
  context: Context;
};

/* =============== COMPONENT =============== */

export default function HomeScreen() {
  const [trustData, setTrustData] = useState<EmergencyResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [accelerometerData, setAccelerometerData] = useState<any>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { user, logout } = useAuth();
  const router = useRouter();

  /* ===== SENSOR SUBSCRIPTION ===== */
  useEffect(() => {
    const unsubscribe = subscribeToAccelerometer(
      (data: { x: number; y: number; z: number }) => {
        setAccelerometerData(data);
      }
    );

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  /* ===== COUNTDOWN HANDLER ===== */
  useEffect(() => {
    if (!trustData) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0 && trustData.decision.action === "DELAY_CONFIRMATION") {
      Alert.alert("🚨 Emergency Alert", "Alert sent after confirmation period");
    }
  }, [countdown, trustData]);

  /* ===== SOS HANDLER ===== */
  const handleSOSPress = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const result = await runEmergencyFlow(accelerometerData);
      setTrustData(result);

      if (result.decision.action === "INSTANT_ALERT") {
        Alert.alert(
          "⚡ Instant Alert",
          "Emergency alert sent immediately"
        );
      } else if (result.decision.action === "DELAY_CONFIRMATION") {
        setCountdown(5);  
        Alert.alert(
          "⏱️ Confirmation Required",
          "Alert will be sent in 5 seconds unless cancelled",
          [
            { text: "Cancel", onPress: () => setCountdown(0), style: "cancel" },
            {
              text: "Send Now",
              onPress: () => {
                setCountdown(0);
                Alert.alert("🚨 Emergency Alert", "Alert sent immediately");
              },
            },
          ]
        );
      } else {
        Alert.alert("📱 Fallback Mode", "Using SMS fallback");
      }
    } catch {
      Alert.alert("❌ Error", "Emergency processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  /* ===== HELPERS ===== */
  const getTrustLabel = (trust: number) => {
    if (trust >= 0.75) return "🟢 HIGH TRUST";
    if (trust >= 0.45) return "🟡 MEDIUM TRUST";
    return "🔴 LOW TRUST";
  };

  const getStatusIcon = (available: boolean) =>
    available ? "✅" : "❌";

  /* ===== UI ===== */
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>TESS</Text>
      <Text style={styles.subtitle}>
        Trust-First Emergency Safety System
      </Text>

      <Text style={styles.cloud}>
        {isFirebaseEnabled ? "☁️ Cloud Sync" : "📱 Local Mode"}
      </Text>

      {user && (
        <View style={{ alignItems: "center", marginBottom: 12 }}>
          <Text style={{ marginBottom: 6 }}>Signed in as {user?.email || user.email}</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              await logout();
              router.replace("/login");
            }}
          >
            <Text style={{ color: "#374151" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.sosButton}
        onPress={handleSOSPress}
        disabled={isProcessing}
      >
        <Text style={styles.sosText}>
          {isProcessing ? "Processing..." : "🚨 EMERGENCY SOS"}
        </Text>
      </TouchableOpacity>

      {trustData && (
        <View style={styles.card}>
          <Text>{getTrustLabel(trustData.trust)}</Text>
          <Text>Trust: {(trustData.trust * 100).toFixed(0)}%</Text>
          <Text>AI Confidence: {(trustData.aiConfidence * 100).toFixed(0)}%</Text>

          <Text>🔋 Battery: {Math.round(trustData.systemHealth.battery * 100)}%</Text>
          <Text>📶 Network: {getStatusIcon(trustData.systemHealth.network)}</Text>
          <Text>📱 Sensor: {getStatusIcon(trustData.systemHealth.sensors.accelerometer)}</Text>

          <Text>🧠 Decision: {trustData.decision.action}</Text>
          <Text>{trustData.decision.message}</Text>

          {countdown > 0 && (
            <Text style={styles.countdown}>⏰ {countdown}s remaining</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

/* =============== STYLES =============== */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: 10 },
  cloud: { textAlign: "center", marginBottom: 20 },
  sosButton: {
    backgroundColor: "#dc2626",
    padding: 20,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 20,
  },
  sosText: { color: "white", fontSize: 18, fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
  },
  countdown: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#d97706",
  },
});
