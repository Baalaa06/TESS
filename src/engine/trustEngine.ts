export function calculateTrust(
  battery: number,
  network: number,
  sensor: number,
  contextRisk: number
) {
  return (
    0.3 * battery +
    0.3 * network +
    0.2 * sensor +
    0.2 * contextRisk
  );
}
