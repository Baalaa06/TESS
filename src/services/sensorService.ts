import * as Battery from "expo-battery";

export async function getBatteryScore() {
  const level = await Battery.getBatteryLevelAsync();
  if (level > 0.4) return 1.0;
  if (level > 0.2) return 0.6;
  return 0.3;
}
