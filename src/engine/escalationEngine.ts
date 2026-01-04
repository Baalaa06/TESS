// Trust-aware escalation decisions
export function decideEscalation(trust) {
  if (trust >= 0.75) {
    return {
      action: "INSTANT_ALERT",
      message: "High system trust - Emergency alert sent immediately",
      delay: 0
    };
  }

  if (trust >= 0.45) {
    return {
      action: "DELAY_CONFIRMATION",
      message: "Medium trust - 5 second confirmation window",
      delay: 5000
    };
  }

  return {
    action: "FALLBACK_SMS",
    message: "Low system trust - Switching to SMS fallback with retries",
    delay: 0
  };
}
