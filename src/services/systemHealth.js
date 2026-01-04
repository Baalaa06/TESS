import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';

// Get current system health metrics
export async function getSystemHealth() {
  try {
    // Battery level
    const batteryLevel = await Battery.getBatteryLevelAsync();
    
    // Network status
    const networkState = await Network.getNetworkStateAsync();
    
    // Location (approximate)
    let location = null;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low // Low accuracy for privacy
        });
        location = {
          latitude: Math.round(currentLocation.coords.latitude * 100) / 100, // Rounded for privacy
          longitude: Math.round(currentLocation.coords.longitude * 100) / 100
        };
      }
    } catch (locationError) {
      console.warn('Location access failed:', locationError);
    }
    
    // Sensor availability
    const sensors = {
      mic: true, // Assume available (would need expo-av for real check)
      accelerometer: await Accelerometer.isAvailableAsync()
    };

    return {
      battery: batteryLevel,
      network: networkState.isConnected && networkState.isInternetReachable,
      location,
      sensors
    };
  } catch (error) {
    console.warn('System health check failed:', error);
    // Fallback values
    return {
      battery: 0.5,
      network: false,
      location: null,
      sensors: { mic: false, accelerometer: false }
    };
  }
}

// Get accelerometer data for movement detection
export function subscribeToAccelerometer(callback) {
  Accelerometer.setUpdateInterval(1000);
  return Accelerometer.addListener(callback);
}

// Generate AI confidence score (mocked for MVP)
export function generateTriggerConfidence(accelerometerData, context) {
  // Simple confidence based on movement and time
  let confidence = 0.7; // Base confidence
  
  // Higher confidence during night hours
  if (context.hour >= 22 || context.hour <= 6) {
    confidence += 0.2;
  }
  
  // Higher confidence with high movement
  if (context.movementLevel === "HIGH") {
    confidence += 0.1;
  }
  
  // Add some randomness to simulate AI uncertainty
  confidence += (Math.random() - 0.5) * 0.2;
  
  return Math.min(Math.max(confidence, 0), 1);
}