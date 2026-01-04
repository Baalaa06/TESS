import { getContextRisk } from "./contextAnalyzer";
import { calculateTrust } from "./trustEngine";
import { decideEscalation } from "./escalationEngine";

export async function runEmergencyFlow() {
  // ---- MOCK CONTEXT (can be replaced later) ----
  const contextRisk = await getContextRisk({
    hour: new Date().getHours(),
    movementLevel: "LOW",
    locationType: "HOME",
  });

  // ---- MOCK SYSTEM HEALTH ----
  const batteryScore = 0.6; // pretend 30–40%
  const networkScore = 1.0; // connected
  const sensorScore = 1.0;  // mic + motion ok

  const trust = calculateTrust(
    batteryScore,
    networkScore,
    sensorScore,
    contextRisk
  );

  const action = decideEscalation(trust);

  return { trust, action };
}
