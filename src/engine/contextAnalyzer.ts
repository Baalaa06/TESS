import { getContexts } from "../storage/localStore";

/**
 * Context definition
 */
export type Context = {
  hour: number;
  movementLevel: "LOW" | "MEDIUM" | "HIGH";
  locationType: "HOME" | "GYM" | "OUTDOOR";
};

/**
 * Context-Aware False Alarm Filter
 * Returns a risk score between 0 and 1
 */
export async function getContextRisk(
  currentContext: Context
): Promise<number> {
  const history = await getContexts();

  // ---- 1. History-based routine detection ----
  const similarContexts = history.filter(
    (c: Context) =>
      c.locationType === currentContext.locationType &&
      c.movementLevel === currentContext.movementLevel &&
      Math.abs(c.hour - currentContext.hour) <= 1
  );

  // If user repeatedly triggers SOS in same safe context → routine
  if (similarContexts.length >= 3) {
    return 0.3; // LOW RISK (routine behavior)
  }

  // ---- 2. Heuristic risk rules (fallback / first-time users) ----
  if (
    currentContext.locationType === "OUTDOOR" &&
    currentContext.hour >= 21
  ) {
    return 1.0; // HIGH RISK (night + outdoor)
  }

  if (
    currentContext.locationType === "GYM" &&
    currentContext.movementLevel === "HIGH"
  ) {
    return 0.3; // LOW RISK (expected activity)
  }

  // ---- 3. Default cautious behavior ----
  return 0.6; // MEDIUM RISK
}
