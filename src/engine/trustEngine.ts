// Trust calculation engine with AI confidence
export function calculateTrust(battery, network, sensors, contextRisk = 0.5, aiConfidence = 0.7) {
  // Weight factors: battery 25%, network 25%, sensors 15%, context 20%, AI confidence 15%
  const batteryScore = battery > 0.2 ? 1.0 : battery / 0.2;
  const networkScore = network ? 1.0 : 0.2;
  const sensorScore = sensors.mic && sensors.accelerometer ? 1.0 : 0.5;
  
  return (
    0.25 * batteryScore +
    0.25 * networkScore +
    0.15 * sensorScore +
    0.20 * contextRisk +
    0.15 * aiConfidence
  );
}
