export type ContextEvent = {
  timestamp: number;
  hour: number;
  movementLevel: "LOW" | "MEDIUM" | "HIGH";
  locationType: "HOME" | "GYM" | "OUTDOOR" | "UNKNOWN";
};
