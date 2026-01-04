export function decideEscalation(trust: number) {
  if (trust >= 0.75) {
    return "INSTANT_ALERT";
  }

  if (trust >= 0.45) {
    return "DELAY_CONFIRMATION";
  }

  return "FALLBACK_SMS";
}
