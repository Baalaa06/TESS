import { getSystemHealth, generateTriggerConfidence } from "../services/systemHealth";
import { getContextRisk, getCurrentContext } from "./contextAnalyzer";
import { calculateTrust } from "./trustEngine";
import { decideEscalation } from "./escalationEngine";
import { saveContext, saveIncident } from "../storage/localStore";

// Main emergency flow orchestrator
export async function runEmergencyFlow(accelerometerData) {
  try {
    // 1. Get current system health (including location)
    const systemHealth = await getSystemHealth();
    
    // 2. Analyze current context
    const currentContext = getCurrentContext(accelerometerData, systemHealth.location);
    const contextRisk = await getContextRisk(currentContext);
    
    // 3. Generate AI confidence score
    const aiConfidence = generateTriggerConfidence(accelerometerData, currentContext);
    
    // 4. Calculate overall trust score
    const trust = calculateTrust(
      systemHealth.battery,
      systemHealth.network,
      systemHealth.sensors,
      contextRisk,
      aiConfidence
    );
    
    // 5. Decide escalation strategy
    const decision = decideEscalation(trust);
    
    // 6. Log the incident with location
    const incident = {
      timestamp: Date.now(),
      trust: trust,
      aiConfidence: aiConfidence,
      battery: Math.round(systemHealth.battery * 100),
      network: systemHealth.network ? 'Connected' : 'Offline',
      location: systemHealth.location ? 
        `${systemHealth.location.latitude}, ${systemHealth.location.longitude}` : 'Unknown',
      sensors: systemHealth.sensors,
      context: currentContext,
      action: decision.action,
      message: decision.message
    };
    
    await saveIncident(incident);
    await saveContext(currentContext);
    
    return {
      trust,
      aiConfidence,
      decision,
      systemHealth,
      context: currentContext
    };
    
  } catch (error) {
    console.error('Emergency flow failed:', error);
    
    // Fallback response
    const fallbackDecision = {
      action: "FALLBACK_SMS",
      message: "System error - Using emergency fallback",
      delay: 0
    };
    
    await saveIncident({
      timestamp: Date.now(),
      trust: 0,
      aiConfidence: 0,
      battery: 0,
      network: 'Unknown',
      location: 'Unknown',
      sensors: { mic: false, accelerometer: false },
      context: { hour: new Date().getHours(), movementLevel: 'UNKNOWN' },
      action: fallbackDecision.action,
      message: 'System error occurred'
    });
    
    return {
      trust: 0,
      aiConfidence: 0,
      decision: fallbackDecision,
      systemHealth: { battery: 0, network: false, location: null, sensors: { mic: false, accelerometer: false } },
      context: { hour: new Date().getHours(), movementLevel: 'UNKNOWN' }
    };
  }
}
