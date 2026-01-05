import * as Battery from "expo-battery";
import * as Location from "expo-location";
import * as Network from "expo-network";
import { Accelerometer } from "expo-sensors";
import { Platform } from "react-native";

// Simple health check function used by emergencyFlow
export async function getSystemHealth() {
  const sensors = { accelerometer: true };

  // battery
  let battery = 1;
  try {
    const level = await Battery.getBatteryLevelAsync();
    battery = typeof level === "number" ? level : 1;
  } catch (e) {
    battery = 0;
  }

  // network
  let network = false;
  try {
    const state = await Network.getNetworkStateAsync();
    network = !!(state && state.isConnected);
  } catch (e) {
    network = false;
  }

  // location
  let location = null;
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const pos = await Location.getCurrentPositionAsync({});
      location = pos.coords;
    }
  } catch (e) {
    location = null;
  }

  return { battery, network, location, sensors };
}

// Very small heuristic for AI confidence from accelerometer and context
export function generateTriggerConfidence(accelerometerData, context = {}) {
  try {
    if (!accelerometerData) return 0.2;
    const { x = 0, y = 0, z = 0 } = accelerometerData;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    // normalize and clamp
    const conf = Math.min(1, magnitude / 2);
    return conf;
  } catch (e) {
    return 0.1;
  }
}

export function subscribeToAccelerometer(onData) {
  // ❌ DO NOTHING ON WEB
  if (Platform.OS === "web") {
    console.log("Accelerometer not supported on Web");
    return () => {};
  }

  // ✅ SAFE FOR MOBILE
  const subscription = Accelerometer.addListener(onData);

  Accelerometer.setUpdateInterval(1000);

  return () => {
    subscription && subscription.remove();
  };
}
