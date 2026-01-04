import { getContexts, saveContext } from "../storage/localStore";

// Context-aware false alarm detection
export async function getContextRisk(currentContext) {
  const history = await getContexts();
  
  // Find similar contexts (same hour ±2, same movement level, similar location)
  const similarContexts = history.filter(ctx => {
    const timeSimilar = Math.abs(ctx.hour - currentContext.hour) <= 2;
    const movementSimilar = ctx.movementLevel === currentContext.movementLevel;
    
    // Location similarity (if available)
    let locationSimilar = true;
    if (ctx.location && currentContext.location) {
      const distance = Math.sqrt(
        Math.pow(ctx.location.latitude - currentContext.location.latitude, 2) +
        Math.pow(ctx.location.longitude - currentContext.location.longitude, 2)
      );
      locationSimilar = distance < 0.01; // Roughly same area
    }
    
    return timeSimilar && movementSimilar && locationSimilar;
  });

  // If user repeatedly triggers SOS in similar context → likely routine/false alarm
  if (similarContexts.length >= 3) {
    console.log('⚠️ Possible false alarm context detected - reducing sensitivity');
    return 0.2; // VERY LOW RISK (routine behavior detected)
  }
  
  if (similarContexts.length >= 2) {
    return 0.4; // LOW RISK (some routine behavior)
  }

  // High-risk scenarios
  if (currentContext.hour >= 22 || currentContext.hour <= 5) {
    return 1.0; // HIGH RISK (night time)
  }

  if (currentContext.movementLevel === "HIGH") {
    return 0.8; // MEDIUM-HIGH RISK (unusual movement)
  }

  return 0.6; // DEFAULT MEDIUM RISK
}

// Generate current context from device state
export function getCurrentContext(accelerometerData, location) {
  const hour = new Date().getHours();
  
  // Calculate movement level from accelerometer
  let movementLevel = "LOW";
  if (accelerometerData) {
    const magnitude = Math.sqrt(
      accelerometerData.x ** 2 + 
      accelerometerData.y ** 2 + 
      accelerometerData.z ** 2
    );
    
    if (magnitude > 15) movementLevel = "HIGH";
    else if (magnitude > 10) movementLevel = "MEDIUM";
  }
  
  // Determine location type (simplified)
  let locationType = "UNKNOWN";
  if (location) {
    // Simple heuristic: if same location as previous contexts, likely HOME/WORK
    locationType = "OUTDOOR"; // Default for new locations
  }

  return { 
    hour, 
    movementLevel, 
    location,
    locationType,
    timestamp: Date.now()
  };
}
