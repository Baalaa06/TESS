import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { runEmergencyFlow } from "@/engine/emergencyFlow";
import { subscribeToAccelerometer } from "@/services/systemHealth";
import { isFirebaseEnabled } from "@/config/firebase";
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const [trustData, setTrustData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [accelerometerData, setAccelerometerData] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Subscribe to accelerometer for movement detection
    const subscription = subscribeToAccelerometer(setAccelerometerData);
    return () => subscription && subscription.remove();
  }, []);

  useEffect(() => {
    // Handle countdown for medium trust scenarios
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && trustData?.decision?.action === "DELAY_CONFIRMATION") {
      // Countdown finished, proceed with alert
      Alert.alert("🚨 Emergency Alert", "Alert sent after confirmation period");
    }
  }, [countdown, trustData]);

  const handleSOSPress = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const result = await runEmergencyFlow(accelerometerData);
      setTrustData(result);
      
      // Handle different escalation strategies
      if (result.decision.action === "INSTANT_ALERT") {
        Alert.alert("⚡ Instant Alert", "Emergency alert sent immediately - High system trust detected!");
      } else if (result.decision.action === "DELAY_CONFIRMATION") {
        setCountdown(5);
        Alert.alert(
          "⏱️ Confirmation Required", 
          "Medium system trust detected. Alert will be sent in 5 seconds unless cancelled.",
          [
            { text: "❌ Cancel", onPress: () => setCountdown(0), style: "cancel" },
            { text: "🚨 Send Now", onPress: () => {
              setCountdown(0);
              Alert.alert("🚨 Emergency Alert", "Alert sent immediately");
            }}
          ]
        );
      } else {
        Alert.alert("📱 Fallback Mode", "Low system trust detected - Using SMS fallback with retries for maximum reliability");
      }
      
    } catch (error) {
      Alert.alert("❌ Error", "Failed to process emergency request. Using fallback mode.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getTrustColor = (trust) => {
    if (trust >= 0.75) return ['#4CAF50', '#66BB6A']; // Green gradient
    if (trust >= 0.45) return ['#FF9800', '#FFB74D']; // Orange gradient
    return ['#F44336', '#EF5350']; // Red gradient
  };

  const getTrustLabel = (trust) => {
    if (trust >= 0.75) return '🟢 HIGH TRUST';
    if (trust >= 0.45) return '🟡 MEDIUM TRUST';
    return '🔴 LOW TRUST';
  };

  const getStatusIcon = (available) => available ? '✅' : '❌';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>TESS</Text>
        <Text style={styles.subtitle}>Trust-First Emergency Safety System</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.dbStatus}>
            {isFirebaseEnabled ? '☁️ Cloud Sync' : '📱 Local Storage'}
          </Text>
        </View>
      </View>
      
      {/* Trust Status Display */}
      <View style={styles.trustContainer}>
        <Text style={styles.trustTitle}>🛡️ System Trust Status</Text>
        {trustData ? (
          <>
            <View style={[styles.trustBadge, { backgroundColor: getTrustColor(trustData.trust)[0] }]}>
              <Text style={styles.trustScore}>
                {getTrustLabel(trustData.trust)}
              </Text>
            </View>
            <Text style={styles.trustValue}>
              Trust Score: {(trustData.trust * 100).toFixed(0)}%
            </Text>
            <Text style={styles.aiConfidence}>
              🤖 AI Confidence: {(trustData.aiConfidence * 100).toFixed(0)}%
            </Text>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Press SOS to evaluate system trust</Text>
          </View>
        )}
      </View>

      {/* System Health Grid */}
      {trustData && (
        <View style={styles.healthGrid}>
          <Text style={styles.sectionTitle}>📊 System Health</Text>
          <View style={styles.healthRow}>
            <View style={styles.healthCard}>
              <Text style={styles.healthIcon}>🔋</Text>
              <Text style={styles.healthLabel}>Battery</Text>
              <Text style={styles.healthValue}>
                {Math.round(trustData.systemHealth.battery * 100)}%
              </Text>
            </View>
            <View style={styles.healthCard}>
              <Text style={styles.healthIcon}>📶</Text>
              <Text style={styles.healthLabel}>Network</Text>
              <Text style={styles.healthValue}>
                {getStatusIcon(trustData.systemHealth.network)}
              </Text>
            </View>
          </View>
          <View style={styles.healthRow}>
            <View style={styles.healthCard}>
              <Text style={styles.healthIcon}>📍</Text>
              <Text style={styles.healthLabel}>Location</Text>
              <Text style={styles.healthValue}>
                {getStatusIcon(trustData.systemHealth.location)}
              </Text>
            </View>
            <View style={styles.healthCard}>
              <Text style={styles.healthIcon}>📱</Text>
              <Text style={styles.healthLabel}>Sensors</Text>
              <Text style={styles.healthValue}>
                {getStatusIcon(trustData.systemHealth.sensors.accelerometer)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Decision Explanation */}
      {trustData && (
        <View style={styles.decisionContainer}>
          <Text style={styles.decisionTitle}>🧠 System Decision</Text>
          <Text style={styles.decisionText}>{trustData.decision.message}</Text>
          <View style={styles.actionBadge}>
            <Text style={styles.actionText}>Action: {trustData.decision.action}</Text>
          </View>
        </View>
      )}

      {/* Countdown Display */}
      {countdown > 0 && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownTitle}>⏰ Alert Countdown</Text>
          <Text style={styles.countdownText}>{countdown}</Text>
          <Text style={styles.countdownSubtext}>seconds remaining</Text>
        </View>
      )}

      {/* SOS Button */}
      <View style={styles.sosContainer}>
        <TouchableOpacity 
          style={[styles.sosButton, isProcessing && styles.sosButtonDisabled]} 
          onPress={handleSOSPress}
          disabled={isProcessing}
        >
          <Text style={styles.sosButtonText}>
            {isProcessing ? "🔄 Processing..." : "🚨 EMERGENCY SOS"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.sosHint}>Tap to trigger emergency evaluation</Text>
      </View>

      {/* Context Info */}
      {trustData && (
        <View style={styles.contextContainer}>
          <Text style={styles.contextTitle}>📋 Context Analysis</Text>
          <Text style={styles.contextText}>
            ⏰ Time: {trustData.context.hour}:00 | 🏃 Movement: {trustData.context.movementLevel}
          </Text>
          {trustData.context.locationType && (
            <Text style={styles.contextText}>
              📍 Location Type: {trustData.context.locationType}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dbStatus: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  trustContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  trustBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 12,
  },
  trustScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  trustValue: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 8,
  },
  aiConfidence: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyState: {
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  healthGrid: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  healthCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  healthIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  healthLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  decisionContainer: {
    backgroundColor: '#dbeafe',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  decisionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 12,
  },
  decisionText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  countdownContainer: {
    backgroundColor: '#fef3c7',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  countdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#d97706',
  },
  countdownSubtext: {
    fontSize: 14,
    color: '#92400e',
  },
  sosContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  sosButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 50,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  sosButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0.1,
  },
  sosButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sosHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  contextContainer: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  contextTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  contextText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
});
